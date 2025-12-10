# Toto

**GitHub for flashcards** — Turn any Wikipedia page into study-ready flashcards in seconds.

## Features

- 🤖 **AI-Powered Generation** — Paste a Wikipedia URL, get flashcards instantly
- 🍴 **Fork & Improve** — Clone any public deck, customize it, make it yours
- 👥 **Community Library** — Browse, star, and share decks with learners worldwide
- 🧠 **Spaced Repetition** — SM-2 algorithm optimizes your review schedule

## Tech Stack

- **Frontend**: Next.js 14 (App Router), TypeScript, Tailwind CSS
- **Backend**: Next.js API Routes
- **Database**: PostgreSQL via Supabase
- **Auth**: Supabase Auth
- **AI**: Anthropic Claude API

## Getting Started

### Prerequisites

- Node.js 18+
- pnpm (recommended) or npm
- Supabase account
- Anthropic API key

### Setup

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/toto.git
   cd toto
   ```

2. Install dependencies:
   ```bash
   pnpm install
   ```

3. Copy environment variables:
   ```bash
   cp .env.example .env.local
   ```

4. Configure your `.env.local`:
   ```
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
   ANTHROPIC_API_KEY=your_anthropic_api_key
   ```

5. Set up the database:
   ```bash
   # If using Supabase CLI
   supabase db push
   
   # Or run the migration manually in Supabase SQL editor
   # Copy contents of supabase/migrations/001_initial_schema.sql
   ```

6. Run the development server:
   ```bash
   pnpm dev
   ```

7. Open [http://localhost:3000](http://localhost:3000)

## Project Structure

```
toto/
├── app/                    # Next.js App Router
│   ├── api/               # API routes
│   ├── generate/          # Card generation page
│   └── page.tsx           # Homepage
├── components/
│   ├── study/             # Study session components
│   ├── deck/              # Deck-related components
│   └── ui/                # Reusable UI components
├── lib/
│   ├── ai/                # AI generation logic
│   └── supabase/          # Supabase clients
├── utils/
│   ├── sm2.ts             # Spaced repetition algorithm
│   └── wikipedia.ts       # Wikipedia API helpers
├── types/                 # TypeScript types
└── supabase/
    └── migrations/        # Database migrations
```

## Roadmap

- [x] Wikipedia → Flashcards generation
- [x] Card preview and editing
- [ ] User authentication
- [ ] Save and publish decks
- [ ] Public deck library
- [ ] Fork and star decks
- [ ] Study mode with SM-2
- [ ] User profiles
- [ ] YouTube → Flashcards
- [ ] PDF → Flashcards

## License

MIT
