import { addDays } from "date-fns";
import type { Rating, Review } from "@/types";

interface SM2Input {
  easeFactor: number;
  interval: number;
  repetitions: number;
}

interface SM2Output {
  easeFactor: number;
  interval: number;
  repetitions: number;
  nextReviewDate: Date;
}

/**
 * SM-2 Algorithm Implementation
 * 
 * Rating scale:
 * 0 = Again (complete failure, reset progress)
 * 1 = Hard (correct but with difficulty)
 * 2 = Good (correct with some hesitation)
 * 3 = Easy (perfect recall)
 */
export function sm2(input: SM2Input, rating: Rating): SM2Output {
  let { easeFactor, interval, repetitions } = input;

  if (rating < 2) {
    // Failed — reset progress
    repetitions = 0;
    interval = 1;
  } else {
    // Passed — increase interval
    if (repetitions === 0) {
      interval = 1;
    } else if (repetitions === 1) {
      interval = 6;
    } else {
      interval = Math.round(interval * easeFactor);
    }
    repetitions += 1;
  }

  // Update ease factor based on rating
  // Formula: EF' = EF + (0.1 - (5-q) * (0.08 + (5-q) * 0.02))
  // Adjusted for 0-3 scale (originally 0-5)
  const adjustedRating = rating + 2; // Convert 0-3 to 2-5
  easeFactor =
    easeFactor +
    (0.1 - (5 - adjustedRating) * (0.08 + (5 - adjustedRating) * 0.02));

  // Ease factor floor at 1.3
  easeFactor = Math.max(1.3, easeFactor);

  const nextReviewDate = addDays(new Date(), interval);

  return {
    easeFactor,
    interval,
    repetitions,
    nextReviewDate,
  };
}

/**
 * Create initial review state for a new card
 */
export function createInitialReview(
  userId: string,
  cardId: string
): Omit<Review, "id"> {
  return {
    user_id: userId,
    card_id: cardId,
    ease_factor: 2.5,
    interval: 0,
    repetitions: 0,
    next_review_date: new Date().toISOString().split("T")[0],
    last_reviewed_at: new Date().toISOString(),
  };
}

/**
 * Check if a card is due for review
 */
export function isDue(review: Review | undefined): boolean {
  if (!review) return true; // New card, never reviewed
  const today = new Date().toISOString().split("T")[0];
  return review.next_review_date <= today;
}

/**
 * Get rating label for display
 */
export function getRatingLabel(rating: Rating): string {
  const labels: Record<Rating, string> = {
    0: "Again",
    1: "Hard",
    2: "Good",
    3: "Easy",
  };
  return labels[rating];
}

/**
 * Get rating color for UI
 */
export function getRatingColor(rating: Rating): string {
  const colors: Record<Rating, string> = {
    0: "text-red-500",
    1: "text-orange-500",
    2: "text-green-500",
    3: "text-blue-500",
  };
  return colors[rating];
}
