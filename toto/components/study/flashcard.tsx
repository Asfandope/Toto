"use client";

import { useState } from "react";
import { cn } from "@/utils/cn";
import { getRatingLabel, getRatingColor } from "@/utils/sm2";
import type { CardWithReview, Rating } from "@/types";

interface FlashcardProps {
  card: CardWithReview;
  onRate: (rating: Rating) => void;
  showAnswer: boolean;
  onFlip: () => void;
}

export function Flashcard({
  card,
  onRate,
  showAnswer,
  onFlip,
}: FlashcardProps) {
  return (
    <div className="flex flex-col items-center">
      {/* Card */}
      <div
        onClick={!showAnswer ? onFlip : undefined}
        className={cn(
          "card w-full max-w-2xl cursor-pointer select-none transition-all",
          !showAnswer && "hover:shadow-lg"
        )}
      >
        <div className="min-h-[200px] flex flex-col justify-center text-center p-8">
          <p className="text-xl text-ink-900">{card.front}</p>

          {showAnswer && (
            <>
              <hr className="my-6 border-ink-200" />
              <p className="text-lg text-ink-700">{card.back}</p>
            </>
          )}
        </div>

        {!showAnswer && (
          <p className="text-center text-sm text-ink-400 pb-4">
            Tap to reveal answer
          </p>
        )}
      </div>

      {/* Rating buttons */}
      {showAnswer && (
        <div className="mt-8 flex gap-3">
          {([0, 1, 2, 3] as Rating[]).map((rating) => (
            <button
              key={rating}
              onClick={() => onRate(rating)}
              className={cn(
                "btn min-w-[80px] border-2",
                rating === 0 && "border-red-200 bg-red-50 text-red-700 hover:bg-red-100",
                rating === 1 && "border-orange-200 bg-orange-50 text-orange-700 hover:bg-orange-100",
                rating === 2 && "border-green-200 bg-green-50 text-green-700 hover:bg-green-100",
                rating === 3 && "border-blue-200 bg-blue-50 text-blue-700 hover:bg-blue-100"
              )}
            >
              {getRatingLabel(rating)}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

interface StudySessionProps {
  cards: CardWithReview[];
  onComplete: (results: { cardId: string; rating: Rating }[]) => void;
}

export function StudySession({ cards, onComplete }: StudySessionProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);
  const [results, setResults] = useState<{ cardId: string; rating: Rating }[]>(
    []
  );

  const currentCard = cards[currentIndex];
  const progress = ((currentIndex) / cards.length) * 100;

  const handleRate = (rating: Rating) => {
    const newResults = [...results, { cardId: currentCard.id, rating }];
    setResults(newResults);

    if (currentIndex + 1 >= cards.length) {
      // Session complete
      onComplete(newResults);
    } else {
      // Next card
      setCurrentIndex(currentIndex + 1);
      setShowAnswer(false);
    }
  };

  if (!currentCard) {
    return (
      <div className="text-center py-12">
        <p className="text-ink-600">No cards to study!</p>
      </div>
    );
  }

  return (
    <div className="py-8">
      {/* Progress bar */}
      <div className="mx-auto max-w-2xl mb-8">
        <div className="flex items-center justify-between text-sm text-ink-500 mb-2">
          <span>
            Card {currentIndex + 1} of {cards.length}
          </span>
          <span>{Math.round(progress)}% complete</span>
        </div>
        <div className="h-2 w-full rounded-full bg-ink-100">
          <div
            className="h-2 rounded-full bg-toto-500 transition-all"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Flashcard */}
      <Flashcard
        card={currentCard}
        onRate={handleRate}
        showAnswer={showAnswer}
        onFlip={() => setShowAnswer(true)}
      />

      {/* Keyboard shortcuts hint */}
      <div className="mt-8 text-center text-sm text-ink-400">
        <p>
          Press <kbd className="px-1.5 py-0.5 bg-ink-100 rounded">Space</kbd> to
          flip •{" "}
          <kbd className="px-1.5 py-0.5 bg-ink-100 rounded">1-4</kbd> to rate
        </p>
      </div>
    </div>
  );
}

interface SessionCompleteProps {
  stats: {
    total: number;
    correct: number;
    timeSpent: number;
  };
  onContinue: () => void;
}

export function SessionComplete({ stats, onContinue }: SessionCompleteProps) {
  const accuracy = Math.round((stats.correct / stats.total) * 100);

  return (
    <div className="text-center py-12">
      <div className="text-6xl mb-4">🎉</div>
      <h2 className="text-2xl font-bold text-ink-900">Session Complete!</h2>

      <div className="mt-8 grid grid-cols-3 gap-8 max-w-md mx-auto">
        <div>
          <p className="text-3xl font-bold text-toto-600">{stats.total}</p>
          <p className="text-sm text-ink-500">Cards reviewed</p>
        </div>
        <div>
          <p className="text-3xl font-bold text-green-600">{accuracy}%</p>
          <p className="text-sm text-ink-500">Accuracy</p>
        </div>
        <div>
          <p className="text-3xl font-bold text-blue-600">
            {Math.round(stats.timeSpent / 60)}m
          </p>
          <p className="text-sm text-ink-500">Time spent</p>
        </div>
      </div>

      <button onClick={onContinue} className="btn-primary mt-8">
        Continue
      </button>
    </div>
  );
}
