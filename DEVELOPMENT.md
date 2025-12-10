# Toto - Development Tracker

**Project:** Toto - GitHub for Flashcards
**Started:** December 10, 2025
**Status:** Phase 1 - Foundation & Setup

---

## Overview

This document tracks the development progress of Toto MVP across 10 phases. Check off tasks as they are completed.

**Progress:** 0/10 Phases Complete

---

## Phase 1: Foundation & Setup

**Status:** Not Started
**Goal:** Initialize the project with all necessary tooling and infrastructure

### Tasks

- [ ] Initialize Next.js 14 project with TypeScript
  - [ ] Run `npx create-next-app@latest` with App Router
  - [ ] Configure TypeScript settings
  - [ ] Set up project structure (`/app`, `/components`, `/lib`, `/types`)
- [ ] Configure Tailwind CSS
  - [ ] Install and configure Tailwind
  - [ ] Set up custom theme (Studio Ghibli inspired colors)
  - [ ] Create base styles
- [ ] Set up Supabase project
  - [ ] Create Supabase account/project
  - [ ] Get API keys and connection strings
  - [ ] Install Supabase client libraries
- [ ] Create database schema
  - [ ] Create `users` table
  - [ ] Create `decks` table
  - [ ] Create `cards` table
  - [ ] Create `reviews` table
  - [ ] Create `stars` table
  - [ ] Create `tags` table
  - [ ] Create `deck_tags` junction table
  - [ ] Set up foreign key relationships
  - [ ] Create indexes for performance
- [ ] Environment configuration
  - [ ] Create `.env.local` file
  - [ ] Add Supabase credentials
  - [ ] Add placeholder for Claude API key
  - [ ] Add placeholder for Upstash Redis
  - [ ] Create `.env.example` for reference
- [ ] Set up git repository
  - [ ] Initialize git
  - [ ] Create `.gitignore`
  - [ ] Make initial commit

---

## Phase 2: Authentication

**Status:** Not Started
**Goal:** Implement user authentication with email/password and OAuth

### Tasks

- [ ] Configure Supabase Auth
  - [ ] Enable email provider
  - [ ] Enable Google OAuth provider
  - [ ] Enable GitHub OAuth provider
  - [ ] Configure redirect URLs
- [ ] Create auth utilities
  - [ ] Create `lib/supabase/client.ts` (client-side)
  - [ ] Create `lib/supabase/server.ts` (server-side)
  - [ ] Create auth helper functions
  - [ ] Create middleware for protected routes
- [ ] Build auth API routes
  - [ ] `POST /api/auth/signup`
  - [ ] `POST /api/auth/login`
  - [ ] `POST /api/auth/logout`
  - [ ] `GET /api/auth/me`
  - [ ] `POST /api/auth/callback` (OAuth)
- [ ] Create auth UI components
  - [ ] `SignUpForm` component
  - [ ] `LoginForm` component
  - [ ] `AuthModal` component
  - [ ] OAuth buttons (Google, GitHub)
- [ ] Build auth pages
  - [ ] `/login` page
  - [ ] `/signup` page
  - [ ] `/auth/callback` page
- [ ] Implement session management
  - [ ] Client-side session handling
  - [ ] Protected route middleware
  - [ ] Automatic token refresh
- [ ] Test authentication flow
  - [ ] Test email/password signup
  - [ ] Test email/password login
  - [ ] Test Google OAuth
  - [ ] Test GitHub OAuth
  - [ ] Test logout
  - [ ] Test protected routes

---

## Phase 3: Core Database & API

**Status:** Not Started
**Goal:** Build foundational CRUD operations for decks, cards, and users

### Tasks

- [ ] Create TypeScript types
  - [ ] `types/database.ts` (Supabase generated types)
  - [ ] `types/api.ts` (API request/response types)
  - [ ] `types/models.ts` (Domain models)
- [ ] Implement Deck API routes
  - [ ] `GET /api/decks` - List public decks (with pagination)
  - [ ] `GET /api/decks/:id` - Get single deck with cards
  - [ ] `POST /api/decks` - Create new deck
  - [ ] `PUT /api/decks/:id` - Update deck
  - [ ] `DELETE /api/decks/:id` - Delete deck
- [ ] Implement Card API routes
  - [ ] `POST /api/decks/:id/cards` - Add card to deck
  - [ ] `PUT /api/cards/:id` - Update card
  - [ ] `DELETE /api/cards/:id` - Delete card
  - [ ] `PATCH /api/cards/:id/position` - Reorder cards
- [ ] Implement User API routes
  - [ ] `GET /api/users/:username` - Get public profile
  - [ ] `GET /api/users/:username/decks` - Get user's public decks
  - [ ] `PUT /api/users/me` - Update own profile
- [ ] Create database utility functions
  - [ ] Deck queries (`lib/db/decks.ts`)
  - [ ] Card queries (`lib/db/cards.ts`)
  - [ ] User queries (`lib/db/users.ts`)
- [ ] Implement error handling
  - [ ] Create error classes
  - [ ] API error handler middleware
  - [ ] Validation helpers
- [ ] Add request validation
  - [ ] Install Zod for schema validation
  - [ ] Create validation schemas
  - [ ] Validate all API inputs

---

## Phase 4: Wikipedia → Flashcards (The Hook)

**Status:** Not Started
**Goal:** Implement the core value proposition - instant flashcard generation from Wikipedia

### Tasks

- [ ] Set up Claude API integration
  - [ ] Get Anthropic API key
  - [ ] Install `@anthropic-ai/sdk`
  - [ ] Create Claude client wrapper (`lib/ai/claude.ts`)
- [ ] Build Wikipedia fetcher
  - [ ] Create `lib/wikipedia/fetcher.ts`
  - [ ] Implement URL validation
  - [ ] Implement Wikipedia API call
  - [ ] Handle API errors gracefully
  - [ ] Truncate long articles (~8000 tokens)
- [ ] Implement flashcard generation
  - [ ] Create generation prompt (from PRD)
  - [ ] Create `lib/ai/generate-flashcards.ts`
  - [ ] Parse JSON response from Claude
  - [ ] Validate generated cards structure
  - [ ] Handle generation errors
- [ ] Build generation API endpoint
  - [ ] `POST /api/generate/wikipedia`
  - [ ] Accept Wikipedia URL
  - [ ] Return generated cards
  - [ ] Add rate limiting (Upstash Redis)
- [ ] Set up Upstash Redis
  - [ ] Create Upstash account
  - [ ] Get Redis connection URL
  - [ ] Install `@upstash/redis`
  - [ ] Implement rate limiting middleware
- [ ] Create generation UI
  - [ ] Wikipedia URL input component
  - [ ] Loading state with progress indicator
  - [ ] Card preview grid
  - [ ] Individual card edit component
  - [ ] Bulk actions (delete selected, edit all)
- [ ] Build homepage with generation
  - [ ] Hero section with URL input
  - [ ] Demo GIF/video
  - [ ] Generated cards preview
  - [ ] Save/publish flow
- [ ] Test generation pipeline
  - [ ] Test with various Wikipedia articles
  - [ ] Test error cases (invalid URL, rate limit)
  - [ ] Test card editing
  - [ ] Test save flow (authenticated)

---

## Phase 5: Study Mode (SM-2 Algorithm)

**Status:** Not Started
**Goal:** Implement spaced repetition study sessions

### Tasks

- [ ] Implement SM-2 algorithm
  - [ ] Create `lib/algorithms/sm2.ts`
  - [ ] Implement core algorithm function
  - [ ] Add tests for algorithm
  - [ ] Validate against PRD spec
- [ ] Build Review API routes
  - [ ] `GET /api/reviews/due` - Get all due cards
  - [ ] `GET /api/decks/:id/due` - Get due cards for deck
  - [ ] `POST /api/reviews` - Submit review & update SM-2 data
  - [ ] `GET /api/reviews/stats` - Get user stats (streak, etc.)
- [ ] Create review database functions
  - [ ] `lib/db/reviews.ts`
  - [ ] Get due cards query
  - [ ] Update review data
  - [ ] Calculate next review date
  - [ ] Track streaks
- [ ] Build study session UI
  - [ ] Study session layout
  - [ ] Card display component (front/back flip)
  - [ ] Rating buttons (Again, Hard, Good, Easy)
  - [ ] Progress bar
  - [ ] Cards remaining counter
- [ ] Create session stats display
  - [ ] Session summary modal
  - [ ] Cards reviewed count
  - [ ] Accuracy percentage
  - [ ] Time spent
  - [ ] Streak counter
  - [ ] Encouragement messages
- [ ] Build study pages
  - [ ] `/study/due` - Review all due cards
  - [ ] `/study/deck/:id` - Study specific deck
  - [ ] `/study/complete` - Session complete page
- [ ] Add keyboard shortcuts
  - [ ] Space to flip card
  - [ ] 1-4 to rate cards
  - [ ] Esc to exit session
- [ ] Test study flow
  - [ ] Test SM-2 calculations
  - [ ] Test rating flow
  - [ ] Test session completion
  - [ ] Test streak tracking

---

## Phase 6: Public Library & Discovery

**Status:** Not Started
**Goal:** Build the public deck browsing and discovery experience

### Tasks

- [ ] Implement Tags system
  - [ ] Create tag management functions (`lib/db/tags.ts`)
  - [ ] `POST /api/tags` - Create tag
  - [ ] `POST /api/decks/:id/tags` - Add tag to deck
  - [ ] `DELETE /api/decks/:id/tags/:tagId` - Remove tag
  - [ ] `GET /api/tags` - List all tags
- [ ] Enhance deck listing API
  - [ ] Add search query parameter
  - [ ] Add tag filtering
  - [ ] Add sorting options (newest, most starred, most forked)
  - [ ] Add pagination
  - [ ] Add deck metadata in response
- [ ] Build library page UI
  - [ ] `/library` - Main library page
  - [ ] Search bar component
  - [ ] Filter sidebar (tags, sort options)
  - [ ] Deck card grid component
  - [ ] Pagination controls
- [ ] Create deck card component
  - [ ] Deck thumbnail/preview
  - [ ] Title and description
  - [ ] Metadata (card count, stars, forks)
  - [ ] Creator info
  - [ ] Tags display
  - [ ] Star button
- [ ] Build deck detail page
  - [ ] `/decks/:id` - Deck detail page
  - [ ] Full deck metadata
  - [ ] Card preview list
  - [ ] Action buttons (Study, Fork, Star, Edit)
  - [ ] Creator profile link
  - [ ] Fork attribution
- [ ] Implement search functionality
  - [ ] Search by title
  - [ ] Search by description
  - [ ] Search by tags
  - [ ] Search by creator
- [ ] Test discovery features
  - [ ] Test search
  - [ ] Test filters
  - [ ] Test sorting
  - [ ] Test pagination

---

## Phase 7: Fork & Star Features

**Status:** Not Started
**Goal:** Implement GitHub-style collaboration features

### Tasks

- [ ] Implement Fork functionality
  - [ ] `POST /api/decks/:id/fork` endpoint
  - [ ] Create fork database function
  - [ ] Copy all cards to new deck
  - [ ] Set `forked_from` reference
  - [ ] Increment fork count on original
  - [ ] Handle fork of a fork (attribution chain)
- [ ] Implement Star functionality
  - [ ] `POST /api/decks/:id/star` endpoint (toggle)
  - [ ] Create/delete star record
  - [ ] Increment/decrement star count
  - [ ] Get user's starred decks
  - [ ] `GET /api/users/me/starred` endpoint
- [ ] Build Fork UI
  - [ ] Fork button on deck page
  - [ ] Fork confirmation modal
  - [ ] Fork success notification
  - [ ] Redirect to forked deck
- [ ] Display fork attribution
  - [ ] "Forked from [original]" banner
  - [ ] Link to original deck
  - [ ] Show fork tree/lineage
- [ ] Build Star UI
  - [ ] Star button (filled/unfilled state)
  - [ ] Star count display
  - [ ] Starred decks page (`/starred`)
- [ ] Update deck counts
  - [ ] Create database trigger for star_count
  - [ ] Create database trigger for fork_count
  - [ ] Handle count updates in API
- [ ] Test fork and star features
  - [ ] Test forking public deck
  - [ ] Test editing forked deck
  - [ ] Test fork attribution
  - [ ] Test starring/unstarring
  - [ ] Test starred decks page

---

## Phase 8: User Profiles

**Status:** Not Started
**Goal:** Build public profiles and user-facing features

### Tasks

- [ ] Enhance user data model
  - [ ] Add profile fields to database (if needed)
  - [ ] Add computed fields (total stars, streak)
  - [ ] Create profile view query
- [ ] Build profile page
  - [ ] `/users/:username` - Public profile
  - [ ] Avatar display
  - [ ] Username and bio
  - [ ] Joined date
  - [ ] Stats (decks created, total stars, study streak)
  - [ ] Public decks list
- [ ] Create profile components
  - [ ] `ProfileHeader` component
  - [ ] `ProfileStats` component
  - [ ] `UserDecksList` component
- [ ] Build settings page
  - [ ] `/settings` - User settings
  - [ ] Update username
  - [ ] Update bio
  - [ ] Upload avatar (consider using Supabase Storage)
  - [ ] Delete account option
- [ ] Implement avatar upload
  - [ ] Set up Supabase Storage bucket
  - [ ] Create upload endpoint
  - [ ] Handle image validation and resize
  - [ ] Update user record with avatar URL
- [ ] Build dashboard
  - [ ] `/dashboard` - User dashboard
  - [ ] Due cards widget
  - [ ] Study streak widget
  - [ ] Recent decks
  - [ ] Quick actions
- [ ] Test profile features
  - [ ] Test profile viewing
  - [ ] Test profile editing
  - [ ] Test avatar upload
  - [ ] Test dashboard widgets

---

## Phase 9: Polish & Testing

**Status:** Not Started
**Goal:** Refine UX, handle edge cases, and ensure quality

### Tasks

- [ ] Implement comprehensive error handling
  - [ ] 404 page
  - [ ] 500 error page
  - [ ] API error boundaries
  - [ ] Toast notifications for errors
  - [ ] Graceful degradation
- [ ] Add loading states
  - [ ] Skeleton loaders for cards
  - [ ] Loading spinners
  - [ ] Optimistic UI updates
  - [ ] Suspense boundaries
- [ ] Create empty states
  - [ ] No decks created yet
  - [ ] No due cards
  - [ ] No search results
  - [ ] No starred decks
  - [ ] Empty library
- [ ] Responsive design polish
  - [ ] Test mobile layouts
  - [ ] Test tablet layouts
  - [ ] Optimize touch interactions
  - [ ] Mobile navigation menu
- [ ] Accessibility improvements
  - [ ] Keyboard navigation
  - [ ] ARIA labels
  - [ ] Focus management
  - [ ] Screen reader testing
- [ ] Performance optimization
  - [ ] Image optimization
  - [ ] Code splitting
  - [ ] Lazy loading
  - [ ] Cache strategies
  - [ ] Database query optimization
- [ ] Add analytics
  - [ ] Set up analytics tool (Plausible/Vercel Analytics)
  - [ ] Track key events (deck created, cards studied, etc.)
  - [ ] Track conversion funnel
- [ ] Testing
  - [ ] Unit tests for SM-2 algorithm
  - [ ] API endpoint tests
  - [ ] Critical user flow testing
  - [ ] Cross-browser testing
- [ ] Content and copy
  - [ ] Write homepage copy
  - [ ] Write about page
  - [ ] Write help/FAQ content
  - [ ] Terms of service
  - [ ] Privacy policy
- [ ] Final UX review
  - [ ] Consistent spacing and typography
  - [ ] Button states and feedback
  - [ ] Form validation messages
  - [ ] Success states

---

## Phase 10: Deployment

**Status:** Not Started
**Goal:** Launch Toto to production

### Tasks

- [ ] Set up Vercel project
  - [ ] Create Vercel account/team
  - [ ] Connect GitHub repository
  - [ ] Configure build settings
- [ ] Configure production environment
  - [ ] Set production environment variables
  - [ ] Configure Supabase production instance
  - [ ] Set up production database
  - [ ] Run migrations on production
- [ ] Set up custom domain
  - [ ] Register domain (if needed)
  - [ ] Configure DNS
  - [ ] Enable HTTPS
- [ ] Production testing
  - [ ] Test all critical flows on production
  - [ ] Test OAuth redirects
  - [ ] Test Wikipedia generation
  - [ ] Test payments/rate limits
- [ ] Set up monitoring
  - [ ] Error tracking (Sentry or similar)
  - [ ] Uptime monitoring
  - [ ] Performance monitoring
  - [ ] Set up alerts
- [ ] Create seed data
  - [ ] Create demo user accounts
  - [ ] Generate 10-20 high-quality public decks
  - [ ] Add relevant tags
- [ ] Pre-launch checklist
  - [ ] Test signup flow
  - [ ] Test study flow
  - [ ] Test deck creation
  - [ ] Verify all OAuth providers
  - [ ] Check mobile responsiveness
  - [ ] Verify analytics working
- [ ] Launch preparation
  - [ ] Create demo GIF for Reddit
  - [ ] Take screenshots
  - [ ] Write launch post
  - [ ] Prepare FAQ responses
- [ ] Go live
  - [ ] Deploy to production
  - [ ] Announce on Reddit (r/Anki, r/GetStudying, etc.)
  - [ ] Monitor for issues
  - [ ] Respond to feedback
- [ ] Post-launch
  - [ ] Monitor error rates
  - [ ] Track key metrics
  - [ ] Collect user feedback
  - [ ] Plan first iteration

---

## Notes & Decisions

*Track important decisions and learnings here*

---

## Resources

- [PRD](./toto/prd-toto.md)
- Supabase: https://supabase.com
- Anthropic API Docs: https://docs.anthropic.com
- Next.js Docs: https://nextjs.org/docs
- SM-2 Algorithm: See PRD Appendix

---

**Last Updated:** December 10, 2025
