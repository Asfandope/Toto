import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { getCurrentUser } from '@/lib/auth/helpers';

/**
 * GET /api/decks/:id/due
 * Get due cards for a specific deck
 */
export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const user = await getCurrentUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const supabase = await createClient();
    const today = new Date().toISOString();

    // Get all cards in the deck
    const { data: deck } = await supabase
      .from('decks')
      .select('id, user_id, cards(id, front, back, is_reversible, position)')
      .eq('id', id)
      .single();

    if (!deck) {
      return NextResponse.json({ error: 'Deck not found' }, { status: 404 });
    }

    // Check access (only owner can study their own deck)
    if (deck.user_id !== user.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    const allCardIds = deck.cards.map((card: any) => card.id);

    if (allCardIds.length === 0) {
      return NextResponse.json({ cards: [] }, { status: 200 });
    }

    // Get due reviews
    const { data: dueReviews } = await supabase
      .from('reviews')
      .select('card_id')
      .eq('user_id', user.id)
      .in('card_id', allCardIds)
      .lte('next_review_date', today);

    const dueCardIds = dueReviews?.map((r) => r.card_id) || [];

    // Get cards that have never been reviewed (new cards)
    const { data: reviewedCardIds } = await supabase
      .from('reviews')
      .select('card_id')
      .eq('user_id', user.id)
      .in('card_id', allCardIds);

    const reviewedIds = reviewedCardIds?.map((r) => r.card_id) || [];
    const newCardIds = allCardIds.filter((id) => !reviewedIds.includes(id));

    // Combine due and new cards (prioritize new cards, then due cards)
    const cardIdsToStudy = [...new Set([...newCardIds, ...dueCardIds])];

    // Get the full card objects in order
    const cardsToStudy = deck.cards
      .filter((card: any) => cardIdsToStudy.includes(card.id))
      .sort((a: any, b: any) => {
        // New cards first
        const aIsNew = newCardIds.includes(a.id);
        const bIsNew = newCardIds.includes(b.id);
        if (aIsNew && !bIsNew) return -1;
        if (!aIsNew && bIsNew) return 1;
        // Then by position
        return a.position - b.position;
      });

    return NextResponse.json(
      {
        cards: cardsToStudy,
        stats: {
          total: allCardIds.length,
          due: dueCardIds.length,
          new: newCardIds.length,
          toStudy: cardsToStudy.length,
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Get deck due cards error:', error);
    return NextResponse.json(
      { error: 'An unexpected error occurred' },
      { status: 500 }
    );
  }
}
