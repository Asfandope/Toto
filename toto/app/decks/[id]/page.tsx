import Link from 'next/link';
import { notFound } from 'next/navigation';
import {
  ArrowLeft,
  Play,
  Edit,
  Trash2,
  Share2,
  GitFork,
  Star,
  BookOpen,
} from 'lucide-react';
import { getCurrentUser } from '@/lib/auth/helpers';
import { createClient } from '@/lib/supabase/server';

interface DeckPageProps {
  params: { id: string };
}

export default async function DeckPage({ params }: DeckPageProps) {
  const { id } = params;
  const user = await getCurrentUser();
  const supabase = await createClient();

  // Fetch deck with cards
  const { data: deck, error: deckError } = await supabase
    .from('decks')
    .select(`
      *,
      cards (*),
      users!decks_user_id_fkey (username, avatar_url),
      forked_from_deck:decks!decks_forked_from_fkey (id, title, users!decks_user_id_fkey (username))
    `)
    .eq('id', id)
    .single();

  if (deckError || !deck) {
    notFound();
  }

  // Check access permissions
  if (!deck.is_public && (!user || deck.user_id !== user.id)) {
    notFound();
  }

  // Get review statistics if user is authenticated
  let reviewStats = null;
  if (user) {
    const { count: dueCount } = await supabase
      .from('reviews')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', user.id)
      .in('card_id', deck.cards.map((c: any) => c.id))
      .lte('next_review_date', new Date().toISOString());

    const { count: reviewedCount } = await supabase
      .from('reviews')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', user.id)
      .in('card_id', deck.cards.map((c: any) => c.id));

    reviewStats = {
      dueCount: dueCount || 0,
      reviewedCount: reviewedCount || 0,
      totalCards: deck.cards.length,
      newCards: deck.cards.length - (reviewedCount || 0),
    };
  }

  // Check if user is the owner
  const isOwner = user?.id === deck.user_id;

  return (
    <div className="min-h-screen bg-ink-50">
      {/* Header */}
      <header className="border-b border-ink-200 bg-white">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4">
          <Link href="/dashboard" className="btn-ghost">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Dashboard
          </Link>

          {isOwner && (
            <div className="flex gap-2">
              <Link href={`/decks/${id}/edit`} className="btn-secondary">
                <Edit className="mr-2 h-4 w-4" />
                Edit
              </Link>
              <button className="btn-ghost text-red-600 hover:bg-red-50">
                <Trash2 className="mr-2 h-4 w-4" />
                Delete
              </button>
            </div>
          )}
        </div>
      </header>

      {/* Content */}
      <main className="mx-auto max-w-6xl px-4 py-8">
        {/* Deck Header */}
        <div className="mb-8">
          <div className="flex items-start justify-between mb-4">
            <div className="flex-1">
              <h1 className="text-3xl font-bold text-ink-900 mb-2">
                {deck.title}
              </h1>
              {deck.description && (
                <p className="text-ink-600 mb-4">{deck.description}</p>
              )}

              {/* Metadata */}
              <div className="flex items-center gap-4 text-sm text-ink-500">
                <span className="flex items-center gap-1">
                  <BookOpen className="w-4 h-4" />
                  {deck.cards.length} cards
                </span>
                <span>by {deck.users.username}</span>
                {deck.source_url && (
                  <a
                    href={deck.source_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-toto-600 hover:underline"
                  >
                    Wikipedia source
                  </a>
                )}
                {deck.is_public && (
                  <span className="px-2 py-1 bg-toto-100 text-toto-700 rounded text-xs font-medium">
                    Public
                  </span>
                )}
              </div>

              {/* Fork attribution */}
              {deck.forked_from_deck && (
                <div className="mt-3 flex items-center gap-2 text-sm text-ink-600">
                  <GitFork className="w-4 h-4" />
                  <span>
                    Forked from{' '}
                    <Link
                      href={`/decks/${deck.forked_from_deck.id}`}
                      className="text-toto-600 hover:underline"
                    >
                      {deck.forked_from_deck.title}
                    </Link>
                    {' by '}
                    {deck.forked_from_deck.users.username}
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3">
            <Link
              href={`/study/deck/${id}`}
              className="btn-primary flex items-center gap-2"
            >
              <Play className="w-4 h-4" />
              Start Studying
            </Link>

            {!isOwner && user && (
              <button className="btn-secondary flex items-center gap-2">
                <GitFork className="w-4 h-4" />
                Fork Deck
              </button>
            )}

            <button className="btn-ghost flex items-center gap-2">
              <Star className="w-4 h-4" />
              Star ({deck.star_count || 0})
            </button>

            <button className="btn-ghost flex items-center gap-2">
              <Share2 className="w-4 h-4" />
              Share
            </button>
          </div>

          {/* Review Statistics */}
          {reviewStats && (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
              <div className="card bg-white p-4">
                <p className="text-sm text-ink-600">Due Today</p>
                <p className="text-2xl font-bold text-toto-600">
                  {reviewStats.dueCount}
                </p>
              </div>
              <div className="card bg-white p-4">
                <p className="text-sm text-ink-600">New Cards</p>
                <p className="text-2xl font-bold text-ink-900">
                  {reviewStats.newCards}
                </p>
              </div>
              <div className="card bg-white p-4">
                <p className="text-sm text-ink-600">Reviewed</p>
                <p className="text-2xl font-bold text-ink-900">
                  {reviewStats.reviewedCount}
                </p>
              </div>
              <div className="card bg-white p-4">
                <p className="text-sm text-ink-600">Total</p>
                <p className="text-2xl font-bold text-ink-900">
                  {reviewStats.totalCards}
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Cards List */}
        <div>
          <h2 className="text-xl font-bold text-ink-900 mb-4">Cards</h2>

          {deck.cards.length === 0 ? (
            <div className="card bg-white p-12 text-center">
              <p className="text-ink-600">This deck has no cards yet.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {deck.cards.map((card: any, index: number) => (
                <div key={card.id} className="card bg-white p-6">
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-ink-100 flex items-center justify-center text-sm font-medium text-ink-600">
                      {index + 1}
                    </div>
                    <div className="flex-1">
                      <div className="mb-3">
                        <p className="text-sm font-medium text-ink-500 mb-1">
                          Question
                        </p>
                        <p className="text-ink-900">{card.front}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-ink-500 mb-1">
                          Answer
                        </p>
                        <p className="text-ink-700">{card.back}</p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
