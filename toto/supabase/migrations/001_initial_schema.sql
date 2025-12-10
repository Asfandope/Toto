-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- Users table (extends Supabase auth.users)
create table public.users (
  id uuid references auth.users on delete cascade primary key,
  email text unique not null,
  username text unique not null,
  avatar_url text,
  bio text,
  created_at timestamptz default now() not null,
  updated_at timestamptz default now() not null
);

-- Decks table
create table public.decks (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.users on delete cascade not null,
  title text not null,
  description text,
  source_url text,
  is_public boolean default false not null,
  forked_from uuid references public.decks on delete set null,
  star_count integer default 0 not null,
  fork_count integer default 0 not null,
  created_at timestamptz default now() not null,
  updated_at timestamptz default now() not null
);

-- Cards table
create table public.cards (
  id uuid default uuid_generate_v4() primary key,
  deck_id uuid references public.decks on delete cascade not null,
  front text not null,
  back text not null,
  is_reversible boolean default false not null,
  position integer not null,
  created_at timestamptz default now() not null,
  updated_at timestamptz default now() not null
);

-- Reviews table (tracks SM-2 state per user per card)
create table public.reviews (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.users on delete cascade not null,
  card_id uuid references public.cards on delete cascade not null,
  ease_factor real default 2.5 not null,
  interval integer default 0 not null,
  repetitions integer default 0 not null,
  next_review_date date default current_date not null,
  last_reviewed_at timestamptz default now() not null,
  unique(user_id, card_id)
);

-- Stars table
create table public.stars (
  user_id uuid references public.users on delete cascade not null,
  deck_id uuid references public.decks on delete cascade not null,
  created_at timestamptz default now() not null,
  primary key (user_id, deck_id)
);

-- Tags table
create table public.tags (
  id uuid default uuid_generate_v4() primary key,
  name text unique not null
);

-- Deck tags junction table
create table public.deck_tags (
  deck_id uuid references public.decks on delete cascade not null,
  tag_id uuid references public.tags on delete cascade not null,
  primary key (deck_id, tag_id)
);

-- Indexes for performance
create index decks_user_id_idx on public.decks(user_id);
create index decks_is_public_idx on public.decks(is_public);
create index decks_star_count_idx on public.decks(star_count desc);
create index cards_deck_id_idx on public.cards(deck_id);
create index reviews_user_id_idx on public.reviews(user_id);
create index reviews_next_review_date_idx on public.reviews(next_review_date);
create index stars_deck_id_idx on public.stars(deck_id);

-- Row Level Security
alter table public.users enable row level security;
alter table public.decks enable row level security;
alter table public.cards enable row level security;
alter table public.reviews enable row level security;
alter table public.stars enable row level security;
alter table public.tags enable row level security;
alter table public.deck_tags enable row level security;

-- Users policies
create policy "Users can view any profile"
  on public.users for select
  using (true);

create policy "Users can update own profile"
  on public.users for update
  using (auth.uid() = id);

-- Decks policies
create policy "Anyone can view public decks"
  on public.decks for select
  using (is_public = true);

create policy "Users can view own decks"
  on public.decks for select
  using (auth.uid() = user_id);

create policy "Users can create decks"
  on public.decks for insert
  with check (auth.uid() = user_id);

create policy "Users can update own decks"
  on public.decks for update
  using (auth.uid() = user_id);

create policy "Users can delete own decks"
  on public.decks for delete
  using (auth.uid() = user_id);

-- Cards policies
create policy "Anyone can view cards of public decks"
  on public.cards for select
  using (
    exists (
      select 1 from public.decks
      where decks.id = cards.deck_id
      and (decks.is_public = true or decks.user_id = auth.uid())
    )
  );

create policy "Users can manage cards in own decks"
  on public.cards for all
  using (
    exists (
      select 1 from public.decks
      where decks.id = cards.deck_id
      and decks.user_id = auth.uid()
    )
  );

-- Reviews policies
create policy "Users can view own reviews"
  on public.reviews for select
  using (auth.uid() = user_id);

create policy "Users can manage own reviews"
  on public.reviews for all
  using (auth.uid() = user_id);

-- Stars policies
create policy "Anyone can view stars"
  on public.stars for select
  using (true);

create policy "Users can manage own stars"
  on public.stars for all
  using (auth.uid() = user_id);

-- Tags policies
create policy "Anyone can view tags"
  on public.tags for select
  using (true);

-- Deck tags policies
create policy "Anyone can view deck tags"
  on public.deck_tags for select
  using (true);

-- Functions for incrementing/decrementing counts
create or replace function increment_star_count()
returns trigger as $$
begin
  update public.decks
  set star_count = star_count + 1
  where id = new.deck_id;
  return new;
end;
$$ language plpgsql security definer;

create or replace function decrement_star_count()
returns trigger as $$
begin
  update public.decks
  set star_count = star_count - 1
  where id = old.deck_id;
  return old;
end;
$$ language plpgsql security definer;

create trigger on_star_insert
  after insert on public.stars
  for each row execute function increment_star_count();

create trigger on_star_delete
  after delete on public.stars
  for each row execute function decrement_star_count();

-- Function to handle user creation
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.users (id, email, username)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data->>'username', split_part(new.email, '@', 1))
  );
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- Updated_at trigger function
create or replace function update_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger users_updated_at
  before update on public.users
  for each row execute function update_updated_at();

create trigger decks_updated_at
  before update on public.decks
  for each row execute function update_updated_at();

create trigger cards_updated_at
  before update on public.cards
  for each row execute function update_updated_at();
