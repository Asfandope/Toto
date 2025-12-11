# Toto - Development Tracker

**Project:** Toto - GitHub for Flashcards
**Started:** December 10, 2025
**Status:** MVP User Journey Complete! 🎉

---

## Overview

This document tracks the development progress of Toto MVP across 10 phases. Check off tasks as they are completed.

**Progress:** 2/10 Phases Complete ✓ (+ Complete User Journey!)

---

## Phase 1: Foundation & Setup ✅

**Status:** Complete (December 10, 2025)
**Goal:** Initialize the project with all necessary tooling and infrastructure

### Tasks

- [x] Initialize Next.js 14 project with TypeScript
  - [x] Run `npx create-next-app@latest` with App Router
  - [x] Configure TypeScript settings
  - [x] Set up project structure (`/app`, `/components`, `/lib`, `/types`)
- [x] Configure Tailwind CSS
  - [x] Install and configure Tailwind
  - [x] Set up custom theme (Studio Ghibli inspired colors)
  - [x] Create base styles
- [x] Set up Supabase project
  - [x] Create Supabase account/project
  - [x] Get API keys and connection strings
  - [x] Install Supabase client libraries
- [x] Create database schema
  - [x] Create `users` table
  - [x] Create `decks` table
  - [x] Create `cards` table
  - [x] Create `reviews` table
  - [x] Create `stars` table
  - [x] Create `tags` table
  - [x] Create `deck_tags` junction table
  - [x] Set up foreign key relationships
  - [x] Create indexes for performance
- [x] Environment configuration
  - [x] Create `.env.local` file
  - [x] Add Supabase credentials
  - [x] Add placeholder for Claude API key
  - [x] Add placeholder for Upstash Redis
  - [x] Create `.env.example` for reference
- [x] Set up git repository
  - [x] Initialize git
  - [x] Create `.gitignore`
  - [x] Make initial commit

---

## Phase 2: Authentication ✅

**Status:** Complete (December 10, 2025)
**Goal:** Implement user authentication with email/password and OAuth

### Tasks

- [x] Configure Supabase Auth
  - [x] Enable email provider
  - [x] Enable Google OAuth provider (ready for configuration)
  - [x] Configure redirect URLs
- [x] Create auth utilities
  - [x] Create `lib/supabase/client.ts` (client-side)
  - [x] Create `lib/supabase/server.ts` (server-side)
  - [x] Create auth helper functions (`lib/auth/helpers.ts`)
  - [x] Create middleware for protected routes (`middleware.ts`)
- [x] Build auth API routes
  - [x] `POST /api/auth/signup`
  - [x] `POST /api/auth/login`
  - [x] `POST /api/auth/logout`
  - [x] `GET /api/auth/me`
  - [x] `GET /api/auth/callback` (OAuth)
- [x] Create auth UI components
  - [x] `SignUpForm` component
  - [x] `LoginForm` component
  - [x] `AuthModal` component
  - [x] `OAuthButtons` component (Google)
  - [x] `AuthButton` component (header)
- [x] Build auth pages
  - [x] `/auth/callback` page (OAuth loading)
  - [x] `/dashboard` page (protected)
  - [x] Modal-based auth flow (preferred over dedicated pages)
- [x] Implement session management
  - [x] Client-side session handling with AuthProvider
  - [x] Protected route middleware
  - [x] Automatic token refresh
- [x] Additional features
  - [x] Install sonner for toast notifications
  - [x] Create Zod validation schemas
  - [x] Implement useAuth hook
  - [x] Build `/api/decks` endpoint (GET & POST)
  - [x] Auth gating on generate page
  - [x] User menu with dashboard/settings links

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

### December 10, 2025 - Phase 1 Complete + Bonus Features

**Phase 1 Status:** ✅ Complete
- All foundational infrastructure is in place
- Git repository initialized with initial commit
- Project structure follows Next.js 14 App Router best practices
- Custom Ghibli-inspired theme implemented in Tailwind

**Bonus Features Already Implemented:**
Beyond Phase 1, several advanced features from later phases have been pre-built:

**From Phase 4 (Wikipedia → Flashcards):**
- ✅ Wikipedia API integration (`utils/wikipedia.ts`)
  - URL validation and title extraction
  - Content fetching with truncation support
- ✅ Claude AI integration (`lib/ai/generate.ts`)
  - Using claude-sonnet-4-20250514 model
  - Prompt engineering for flashcard generation
  - JSON parsing and validation
- ✅ Generation API endpoint (`app/api/generate/wikipedia/route.ts`)
- ✅ Generation UI page (`app/generate/page.tsx`)
  - Card preview and editing interface

**From Phase 5 (Study Mode):**
- ✅ Complete SM-2 algorithm implementation (`utils/sm2.ts`)
  - Rating system (0-3: Again, Hard, Good, Easy)
  - Ease factor calculations
  - Interval scheduling
  - Initial review state creation
- ✅ Flashcard UI components (`components/study/flashcard.tsx`)
  - Flip animations
  - Rating buttons
  - Progress tracking
  - Session statistics

**Database Architecture Notes:**
- Row Level Security (RLS) policies implemented on all tables
- PostgreSQL functions for auto-incrementing star counts
- Cascading deletes configured for proper data integrity
- Indexes added on frequently queried columns for performance

---

### December 10, 2025 - Phase 2 Complete: Authentication System

**Phase 2 Status:** ✅ Complete
- Full authentication system with email/password and Google OAuth
- Modal-based authentication flow for better UX
- Protected routes with middleware
- Toast notifications for user feedback
- Dashboard with deck listing and statistics

**Implementation Highlights:**
- 23 files created (19 new, 3 updated, 1 package file)
- 8,277 lines of code added
- Complete auth flow: signup → login → session management → logout
- Auth gating on deck saving (prompts login if not authenticated)
- Professional UI with Tailwind custom components

**Architecture Decisions:**
- **Modal-based auth:** Chosen over dedicated pages for better UX
- **Username at signup:** Users choose username during signup (not auto-generated)
- **No email verification:** Immediate access for MVP (can add later)
- **Toast notifications:** Using sonner library for consistent feedback
- **Dashboard with deck listing:** Built full dashboard instead of placeholder

**Files Structure:**
```
lib/auth/          - Validation schemas and helper functions
providers/         - AuthProvider for global state
hooks/            - useAuth hook
components/auth/   - All auth-related UI components
app/api/auth/     - Auth API routes
app/api/decks/    - Deck CRUD endpoints (GET & POST)
app/dashboard/    - Protected dashboard page
middleware.ts     - Route protection and session refresh
```

---

### December 10, 2025 - Complete MVP User Journey! 🎉

**Status:** ✅ MVP is now fully functional!

Instead of going through Phase 3 methodically, we built the complete end-to-end user journey to make Toto actually usable. The app now delivers the full learning experience from generation to spaced repetition!

**What We Built:**

**1. Deck Management**
- Deck detail page (`/decks/[id]`)
  - View all cards in a deck
  - Review statistics (due, new, reviewed, total)
  - Action buttons: Study, Edit, Delete, Fork, Star, Share
  - Fork attribution display
- CRUD API endpoints:
  - `GET /api/decks/[id]` - Fetch deck with cards and stats
  - `PUT /api/decks/[id]` - Update deck (owner only)
  - `DELETE /api/decks/[id]` - Delete deck (owner only)

**2. Study Session Flow (The Core Experience!)**
- Study session page (`/study/deck/[id]`)
  - Uses existing Flashcard components (already built in Phase 1!)
  - Real-time progress tracking
  - SM-2 algorithm integration
  - Session completion stats
- Review API:
  - `POST /api/reviews` - Submit reviews with SM-2 calculations
  - `GET /api/decks/[id]/due` - Get due cards for specific deck
  - Automatic review record creation for new cards

**3. Daily Review Workflow**
- Review all due cards (`/study/due`)
  - Studies cards across all user's decks
  - Prioritizes new cards, then due cards
  - Same study interface as single deck
- API endpoint:
  - `GET /api/reviews/due` - Get all due cards across decks
- Dashboard integration:
  - "Cards Due" stat now clickable
  - Links directly to /study/due for instant review

**4. User Profile Management**
- Settings page (`/settings`)
  - Update username and bio
  - Username uniqueness validation
  - Email display (read-only)
  - Danger zone with delete account option
- API endpoint:
  - `PUT /api/users/me` - Update user profile

**Complete User Journey Now Works:**
1. ✅ Visit homepage → Paste Wikipedia URL
2. ✅ AI generates flashcards
3. ✅ Edit/customize cards
4. ✅ Sign up/Login (modal-based auth)
5. ✅ Save deck to account
6. ✅ View deck details and statistics
7. ✅ Study deck with spaced repetition
8. ✅ Rate cards (Again, Hard, Good, Easy)
9. ✅ SM-2 algorithm schedules next review
10. ✅ Come back tomorrow → See due cards
11. ✅ Review all due cards in one session
12. ✅ Track progress over time
13. ✅ Update profile in settings

**Implementation Stats:**
- 9 new files created (4 API routes, 5 pages)
- 1 file updated (dashboard)
- 1,258 lines of code added
- All core features working end-to-end

**What This Means:**
Toto is now a **fully functional MVP**! Users can:
- Generate decks from Wikipedia instantly
- Save and organize their learning materials
- Study with scientifically-proven spaced repetition
- Track their learning progress over time
- Manage their profile

**Next Steps:**
The MVP is feature-complete for the core learning loop! Remaining work:
- Polish & UX improvements (Phase 9)
- Fork & Star features (Phase 7)
- Public library & discovery (Phase 6)
- Tags system
- Deployment to production (Phase 10)

---

## Resources

- [PRD](./toto/prd-toto.md)
- Supabase: https://supabase.com
- Anthropic API Docs: https://docs.anthropic.com
- Next.js Docs: https://nextjs.org/docs
- SM-2 Algorithm: See PRD Appendix

---

**Last Updated:** December 10, 2025 - MVP User Journey Complete! 🎉
