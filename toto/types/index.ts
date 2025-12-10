// User types
export interface User {
  id: string;
  email: string;
  username: string;
  avatar_url: string | null;
  bio: string | null;
  created_at: string;
  updated_at: string;
}

// Deck types
export interface Deck {
  id: string;
  user_id: string;
  title: string;
  description: string | null;
  source_url: string | null;
  is_public: boolean;
  forked_from: string | null;
  star_count: number;
  fork_count: number;
  created_at: string;
  updated_at: string;
  // Relations
  user?: User;
  cards?: Card[];
  tags?: Tag[];
}

export interface DeckWithCards extends Deck {
  cards: Card[];
}

// Card types
export interface Card {
  id: string;
  deck_id: string;
  front: string;
  back: string;
  is_reversible: boolean;
  position: number;
  created_at: string;
  updated_at: string;
}

export interface GeneratedCard {
  front: string;
  back: string;
  reversible: boolean;
}

// Review types
export interface Review {
  id: string;
  user_id: string;
  card_id: string;
  ease_factor: number;
  interval: number;
  repetitions: number;
  next_review_date: string;
  last_reviewed_at: string;
}

export interface CardWithReview extends Card {
  review?: Review;
}

// Rating for SM-2 algorithm
export type Rating = 0 | 1 | 2 | 3; // Again, Hard, Good, Easy

// Tag types
export interface Tag {
  id: string;
  name: string;
}

// API response types
export interface ApiResponse<T> {
  data?: T;
  error?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  per_page: number;
  has_more: boolean;
}

// Wikipedia API types
export interface WikipediaExtract {
  title: string;
  content: string;
  url: string;
}

// Study session types
export interface StudySession {
  deck_id: string;
  cards_due: CardWithReview[];
  current_index: number;
  cards_reviewed: number;
  correct_count: number;
  started_at: Date;
}

export interface SessionStats {
  cards_reviewed: number;
  accuracy: number;
  time_spent_seconds: number;
  streak: number;
}
