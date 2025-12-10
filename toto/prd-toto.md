# Toto — Product Requirements Document

**Version:** 1.0  
**Date:** December 10, 2025  
**Author:** Asfand / Kamui Labs

---

## Executive Summary

Toto is a modern spaced repetition learning platform positioned as "GitHub for flashcards." The name draws inspiration from Studio Ghibli, evoking a friendly, approachable companion for your learning journey. It combines AI-powered content generation with community-driven deck sharing, forking, and collaboration. The initial hook is one-tap conversion of any Wikipedia page into study-ready flashcards.

---

## Problem Statement

**Anki** is powerful but has terrible UX. The learning curve is steep, the interface feels dated, and sharing/discovering decks is fragmented across third-party sites.

**Quizlet** optimized for students and school contexts, leaving professionals and lifelong learners underserved. Recent monetization pushes have frustrated users.

**The gap:** No platform exists that combines modern UX, AI-powered content generation, and GitHub-style collaboration mechanics for learning content.

---

## Target Users

**Primary (MVP focus):**
- Self-directed learners (professionals upskilling, certification prep)
- Medical/law students (heavy flashcard users, vocal communities)
- Language learners
- Developers learning new technologies

**Secondary (post-MVP):**
- Educators creating shareable curricula
- Corporate training teams
- Content creators monetizing educational decks

---

## Core Value Propositions

1. **Instant content creation** — Paste a Wikipedia URL, get flashcards in seconds
2. **Community library** — Discover, fork, and improve decks created by others
3. **Modern UX** — Clean, fast, minimal interface that doesn't feel like 2005
4. **Open ecosystem** — Your learning data is yours; export anytime

---

## MVP Feature Set

### 1. Wikipedia → Flashcards (The Hook)

**User Flow:**
1. User pastes Wikipedia URL
2. System fetches article content via Wikipedia API
3. AI generates 10-30 flashcards (question/answer pairs)
4. User previews, edits, removes cards as needed
5. User publishes deck (public) or saves as private
6. Deck appears in library with source attribution

**AI Generation Requirements:**
- Focus on key facts, definitions, cause/effect relationships, dates
- Avoid trivial or overly specific details
- Generate clear, unambiguous questions
- Answers should be concise (1-3 sentences max)
- Output as structured JSON for easy parsing

**Card Types (v1):**
- Basic (front/back)
- Reversible (can be studied both directions)

### 2. Public Deck Library

**Features:**
- Browse all public decks
- Search by title, tags, source URL
- Sort by: newest, most starred, most forked, recently updated
- Filter by category/tags
- Deck preview (see cards before studying)

**Deck Metadata:**
- Title, description
- Tags/categories
- Card count
- Source URL (if generated from Wikipedia)
- Star count, fork count
- Creator profile link
- Created/updated timestamps

### 3. Fork & Edit

**Mechanics:**
- Any public deck can be forked to user's library
- Fork creates full copy; changes don't affect original
- Forked decks display "Forked from [original]" attribution
- Users can make forked decks public or keep private
- Edit individual cards (question, answer, delete, add new)

### 4. Spaced Repetition Study Mode

**Algorithm:** SM-2 (SuperMemo 2)

**Per-card tracking:**
- `ease_factor` (default 2.5)
- `interval` (days until next review)
- `repetitions` (consecutive correct answers)
- `next_review_date`

**Study Session Flow:**
1. User opens deck or "Review All Due"
2. System presents cards where `next_review_date <= today`
3. User sees front, taps to reveal back
4. User rates: Again (0), Hard (1), Good (2), Easy (3)
5. Algorithm updates interval and ease_factor
6. Session continues until no due cards remain

**Session Stats:**
- Cards reviewed
- Accuracy rate
- Time spent
- Streak counter

### 5. User Profiles & Authentication

**Auth Methods:**
- Email/password
- Google OAuth
- GitHub OAuth (fits the "GitHub for flashcards" brand)

**Profile Features:**
- Username, avatar
- Bio (optional)
- Public decks created
- Total stars received
- Study streak
- Joined date

---

## Data Model

### users
| Field | Type | Notes |
|-------|------|-------|
| id | uuid | Primary key |
| email | string | Unique |
| username | string | Unique, URL-safe |
| avatar_url | string | Nullable |
| bio | text | Nullable |
| created_at | timestamp | |
| updated_at | timestamp | |

### decks
| Field | Type | Notes |
|-------|------|-------|
| id | uuid | Primary key |
| user_id | uuid | Foreign key → users |
| title | string | |
| description | text | Nullable |
| source_url | string | Wikipedia URL, nullable |
| is_public | boolean | Default false |
| forked_from | uuid | Foreign key → decks, nullable |
| star_count | integer | Denormalized for perf |
| fork_count | integer | Denormalized for perf |
| created_at | timestamp | |
| updated_at | timestamp | |

### cards
| Field | Type | Notes |
|-------|------|-------|
| id | uuid | Primary key |
| deck_id | uuid | Foreign key → decks |
| front | text | Question |
| back | text | Answer |
| is_reversible | boolean | Default false |
| position | integer | For ordering |
| created_at | timestamp | |
| updated_at | timestamp | |

### reviews
| Field | Type | Notes |
|-------|------|-------|
| id | uuid | Primary key |
| user_id | uuid | Foreign key → users |
| card_id | uuid | Foreign key → cards |
| ease_factor | float | Default 2.5 |
| interval | integer | Days |
| repetitions | integer | Consecutive correct |
| next_review_date | date | |
| last_reviewed_at | timestamp | |

### stars
| Field | Type | Notes |
|-------|------|-------|
| user_id | uuid | Foreign key → users |
| deck_id | uuid | Foreign key → decks |
| created_at | timestamp | |
| | | Composite PK: user_id + deck_id |

### tags
| Field | Type | Notes |
|-------|------|-------|
| id | uuid | Primary key |
| name | string | Unique, lowercase |

### deck_tags
| Field | Type | Notes |
|-------|------|-------|
| deck_id | uuid | Foreign key → decks |
| tag_id | uuid | Foreign key → tags |
| | | Composite PK |

---

## Technical Architecture

### Stack

| Layer | Technology |
|-------|------------|
| Frontend | Next.js 14 (App Router), TypeScript, Tailwind CSS |
| Backend | Next.js API Routes (monolith for MVP) |
| Database | PostgreSQL via Supabase |
| Auth | Supabase Auth |
| AI | Anthropic Claude API (claude-sonnet-4-20250514) |
| Hosting | Vercel |
| Rate Limiting | Upstash Redis |

### API Endpoints

**Auth**
- `POST /api/auth/signup`
- `POST /api/auth/login`
- `POST /api/auth/logout`
- `GET /api/auth/me`

**Decks**
- `GET /api/decks` — List public decks (paginated, filterable)
- `GET /api/decks/:id` — Get deck with cards
- `POST /api/decks` — Create deck
- `PUT /api/decks/:id` — Update deck
- `DELETE /api/decks/:id` — Delete deck
- `POST /api/decks/:id/fork` — Fork deck
- `POST /api/decks/:id/star` — Star/unstar deck

**Cards**
- `POST /api/decks/:id/cards` — Add card
- `PUT /api/cards/:id` — Update card
- `DELETE /api/cards/:id` — Delete card

**Reviews**
- `GET /api/reviews/due` — Get all due cards across decks
- `GET /api/decks/:id/due` — Get due cards for specific deck
- `POST /api/reviews` — Submit review (updates SM-2 data)

**Generation**
- `POST /api/generate/wikipedia` — Generate cards from Wikipedia URL

**Users**
- `GET /api/users/:username` — Public profile
- `GET /api/users/:username/decks` — User's public decks

### Wikipedia → Flashcard Pipeline

```
1. Client sends Wikipedia URL
          ↓
2. Server validates URL (must be wikipedia.org/wiki/*)
          ↓
3. Extract article title from URL
          ↓
4. Fetch from Wikipedia API:
   https://en.wikipedia.org/w/api.php?action=query&titles={title}&prop=extracts&explaintext=true
          ↓
5. Truncate content to ~8,000 tokens if needed
          ↓
6. Send to Claude with generation prompt
          ↓
7. Parse JSON response, validate structure
          ↓
8. Return cards to client for preview/edit
```

**AI Prompt (v1):**

```
You are an expert educator creating flashcards for spaced repetition learning.

Given the following Wikipedia article content, generate flashcards that:
- Focus on the most important facts, definitions, and relationships
- Ask clear, unambiguous questions
- Provide concise answers (1-3 sentences)
- Avoid trivial details or overly specific minutiae
- Cover the breadth of the article, not just the introduction

Output as JSON array:
[
  {"front": "question", "back": "answer", "reversible": false},
  ...
]

Generate 15-25 flashcards depending on article length.

Article content:
{content}
```

---

## User Flows

### Flow 1: New User Creates First Deck

1. Land on homepage → See hero with "Paste a Wikipedia URL" input
2. Paste URL → Loading state → Preview generated cards
3. Prompt to sign up to save
4. Sign up with Google (one click)
5. Edit cards if desired → Publish deck
6. Redirected to deck page with shareable URL

### Flow 2: Returning User Study Session

1. Login → Dashboard shows due card count
2. Click "Review Due Cards"
3. Study session begins
4. Rate each card → See progress bar
5. Session complete → Show stats (cards reviewed, accuracy, streak)
6. Return to dashboard

### Flow 3: Discover and Fork

1. Browse library → Filter by "Medical"
2. Find "Anatomy: Muscular System" deck with 200 stars
3. Preview cards
4. Click "Fork to My Library"
5. Edit 3 cards to add personal notes
6. Study forked version

---

## Success Metrics

### North Star
**Weekly Active Learners (WAL):** Users who complete at least one study session per week

### Leading Indicators
- Decks generated from Wikipedia per day
- Fork rate (forks / deck views)
- Star rate
- D1/D7/D30 retention
- Cards reviewed per session
- Session completion rate

### Launch Targets (First 30 Days)
- 500 decks created
- 100 WAL
- 50 forked decks
- Average 4.0+ rating on user feedback

---

## Go-to-Market: Reddit Seeding Strategy

**Target Subreddits:**
- r/Anki (350k members) — Frame as "modern alternative"
- r/GetStudying (500k members)
- r/medicalschool (400k members)
- r/learnprogramming (4M members)
- r/languagelearning (1.5M members)
- r/ADHD (2M members) — Spaced repetition is huge here
- r/productivity (2M members)

**Post Strategy:**
1. **Launch post:** "I built a tool that turns any Wikipedia page into flashcards in 10 seconds" — Include GIF demo
2. **Follow-up engagement:** Answer every comment, incorporate feedback publicly
3. **Niche posts:** "Made a free tool for med students..." in r/medicalschool
4. **Value posts:** Share interesting pre-made decks relevant to each community

**Content Assets Needed:**
- 15-second GIF showing Wikipedia → flashcards flow
- Screenshot of clean study interface
- Before/after comparison with Anki UI

---

## Future Roadmap (Post-MVP)

**Phase 2: Content Sources**
- YouTube video → flashcards (via transcript)
- PDF upload → flashcards
- Plain text/notes → flashcards
- URL (any article) → flashcards

**Phase 3: Collaboration**
- Deck comments/discussions
- Suggested edits (like GitHub PRs)
- Collaborative editing
- Deck "organizations" for teams

**Phase 4: Advanced Learning**
- FSRS algorithm option
- Learning insights/analytics
- Weak card identification
- Custom review settings

**Phase 5: Monetization**
- Pro tier: private decks unlimited, advanced analytics, priority AI generation
- Team tier: shared libraries, admin controls
- Creator program: revenue share for popular deck creators

---

## Open Questions

1. **Mobile:** PWA sufficient for MVP, or native apps needed?
2. **Rate limiting:** How many Wikipedia generations per user per day on free tier?
3. **Moderation:** How to handle inappropriate content in public decks?

---

## Appendix: SM-2 Algorithm Reference

```javascript
function sm2(card, rating) {
  // rating: 0 = Again, 1 = Hard, 2 = Good, 3 = Easy
  
  let { easeFactor, interval, repetitions } = card;
  
  if (rating < 2) {
    // Failed — reset
    repetitions = 0;
    interval = 1;
  } else {
    // Passed
    if (repetitions === 0) {
      interval = 1;
    } else if (repetitions === 1) {
      interval = 6;
    } else {
      interval = Math.round(interval * easeFactor);
    }
    repetitions += 1;
  }
  
  // Update ease factor
  easeFactor = easeFactor + (0.1 - (3 - rating) * (0.08 + (3 - rating) * 0.02));
  easeFactor = Math.max(1.3, easeFactor); // Floor at 1.3
  
  return {
    easeFactor,
    interval,
    repetitions,
    nextReviewDate: addDays(today(), interval)
  };
}
```

---

*End of PRD*
