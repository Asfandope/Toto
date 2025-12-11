'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { toast } from 'sonner';
import { StudySession, SessionComplete } from '@/components/study/flashcard';
import type { Rating } from '@/types';

export default function StudyDuePage() {
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [cards, setCards] = useState<any[]>([]);
  const [sessionComplete, setSessionComplete] = useState(false);
  const [stats, setStats] = useState({
    total: 0,
    correct: 0,
    timeSpent: 0,
  });
  const [startTime] = useState(Date.now());

  useEffect(() => {
    fetchDueCards();
  }, []);

  const fetchDueCards = async () => {
    try {
      setLoading(true);

      const response = await fetch('/api/reviews/due');
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch cards');
      }

      if (data.cards.length === 0) {
        toast.info('No cards due for review!');
        router.push('/dashboard');
        return;
      }

      setCards(data.cards);
    } catch (error) {
      console.error('Error fetching cards:', error);
      toast.error('Failed to load cards');
      router.push('/dashboard');
    } finally {
      setLoading(false);
    }
  };

  const handleComplete = async (results: { cardId: string; rating: Rating }[]) => {
    try {
      // Submit all reviews
      const promises = results.map((result) =>
        fetch('/api/reviews', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            card_id: result.cardId,
            rating: result.rating,
          }),
        })
      );

      await Promise.all(promises);

      // Calculate stats
      const timeSpent = Math.floor((Date.now() - startTime) / 1000);
      const correct = results.filter((r) => r.rating >= 2).length;

      setStats({
        total: results.length,
        correct,
        timeSpent,
      });

      setSessionComplete(true);
      toast.success('Study session complete!');
    } catch (error) {
      console.error('Error submitting reviews:', error);
      toast.error('Failed to save reviews');
    }
  };

  const handleContinue = () => {
    router.push('/dashboard');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin text-toto-600 mx-auto mb-4" />
          <p className="text-ink-600">Loading due cards...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-ink-50">
      {/* Header */}
      <header className="border-b border-ink-200 bg-white">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4">
          <Link href="/dashboard" className="btn-ghost">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Dashboard
          </Link>

          <h1 className="text-lg font-semibold text-ink-900">Review Due Cards</h1>

          <div className="w-32" /> {/* Spacer for centering */}
        </div>
      </header>

      {/* Content */}
      <main className="mx-auto max-w-6xl px-4">
        {sessionComplete ? (
          <SessionComplete stats={stats} onContinue={handleContinue} />
        ) : (
          <StudySession cards={cards} onComplete={handleComplete} />
        )}
      </main>
    </div>
  );
}
