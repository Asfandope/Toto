import Link from 'next/link';
import { Plus, BookOpen, Star } from 'lucide-react';
import { getCurrentUser } from '@/lib/auth/helpers';
import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';

export default async function DashboardPage() {
  const user = await getCurrentUser();

  if (!user) {
    redirect('/');
  }

  // Fetch user's decks
  const supabase = await createClient();
  const { data: decks } = await supabase
    .from('decks')
    .select('*, cards(count)')
    .eq('user_id', user.id)
    .order('updated_at', { ascending: false });

  // Fetch due cards count (simplified for now)
  const { count: dueCount } = await supabase
    .from('reviews')
    .select('*', { count: 'exact', head: true })
    .eq('user_id', user.id)
    .lte('next_review_date', new Date().toISOString());

  return (
    <div className="min-h-screen bg-ink-50">
      <div className="max-w-6xl mx-auto px-4 py-12">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-ink-900 mb-2">
            Welcome back, {user.username}!
          </h1>
          <p className="text-ink-600">
            Continue your learning journey
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="card bg-white p-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-toto-100 flex items-center justify-center">
                <BookOpen className="w-6 h-6 text-toto-600" />
              </div>
              <div>
                <p className="text-sm text-ink-600">Total Decks</p>
                <p className="text-2xl font-bold text-ink-900">{decks?.length || 0}</p>
              </div>
            </div>
          </div>

          <Link
            href="/study/due"
            className="card bg-white p-6 hover:shadow-lg transition-shadow group"
          >
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center group-hover:bg-blue-200 transition-colors">
                <Star className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-ink-600">Cards Due</p>
                <p className="text-2xl font-bold text-ink-900">{dueCount || 0}</p>
              </div>
            </div>
          </Link>

          <Link
            href="/generate"
            className="card bg-toto-500 hover:bg-toto-600 p-6 transition-colors group"
          >
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center">
                <Plus className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="text-sm text-white/90">Create Deck</p>
                <p className="text-lg font-semibold text-white">From Wikipedia</p>
              </div>
            </div>
          </Link>
        </div>

        {/* Decks List */}
        <div>
          <h2 className="text-xl font-bold text-ink-900 mb-4">Your Decks</h2>

          {!decks || decks.length === 0 ? (
            <div className="card bg-white p-12 text-center">
              <BookOpen className="w-16 h-16 text-ink-300 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-ink-900 mb-2">
                No decks yet
              </h3>
              <p className="text-ink-600 mb-6">
                Create your first deck to start learning!
              </p>
              <Link href="/generate" className="btn btn-primary inline-flex items-center gap-2">
                <Plus className="w-4 h-4" />
                Create from Wikipedia
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {decks.map((deck: any) => (
                <Link
                  key={deck.id}
                  href={`/decks/${deck.id}`}
                  className="card bg-white p-6 hover:shadow-lg transition-shadow group"
                >
                  <h3 className="font-semibold text-ink-900 mb-2 group-hover:text-toto-600 transition-colors">
                    {deck.title}
                  </h3>
                  {deck.description && (
                    <p className="text-sm text-ink-600 mb-4 line-clamp-2">
                      {deck.description}
                    </p>
                  )}
                  <div className="flex items-center gap-4 text-sm text-ink-500">
                    <span>{deck.cards[0]?.count || 0} cards</span>
                    {deck.is_public && (
                      <span className="text-toto-600">Public</span>
                    )}
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
