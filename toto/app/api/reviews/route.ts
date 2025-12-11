import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { getCurrentUser } from '@/lib/auth/helpers';
import { sm2, createInitialReview } from '@/utils/sm2';

/**
 * POST /api/reviews
 * Submit a review for a card
 */
export async function POST(request: Request) {
  try {
    const user = await getCurrentUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { card_id, rating } = body;

    if (!card_id || rating === undefined) {
      return NextResponse.json(
        { error: 'card_id and rating are required' },
        { status: 400 }
      );
    }

    // Validate rating (0-3)
    if (rating < 0 || rating > 3) {
      return NextResponse.json(
        { error: 'Rating must be between 0 and 3' },
        { status: 400 }
      );
    }

    const supabase = await createClient();

    // Check if review exists
    const { data: existingReview } = await supabase
      .from('reviews')
      .select('*')
      .eq('user_id', user.id)
      .eq('card_id', card_id)
      .single();

    let review;

    if (existingReview) {
      // Update existing review
      const updatedReview = sm2(existingReview, rating);

      const { data, error } = await supabase
        .from('reviews')
        .update(updatedReview)
        .eq('id', existingReview.id)
        .select()
        .single();

      if (error) {
        return NextResponse.json({ error: error.message }, { status: 400 });
      }

      review = data;
    } else {
      // Create new review
      const initialReview = createInitialReview(user.id, card_id);
      const updatedReview = sm2(initialReview, rating);

      const { data, error } = await supabase
        .from('reviews')
        .insert(updatedReview)
        .select()
        .single();

      if (error) {
        return NextResponse.json({ error: error.message }, { status: 400 });
      }

      review = data;
    }

    return NextResponse.json({ review }, { status: 200 });
  } catch (error) {
    console.error('Submit review error:', error);
    return NextResponse.json(
      { error: 'An unexpected error occurred' },
      { status: 500 }
    );
  }
}

/**
 * GET /api/reviews/due
 * Get all due cards across all user's decks
 */
export async function GET(request: Request) {
  try {
    const user = await getCurrentUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const supabase = await createClient();
    const today = new Date().toISOString();

    // Get all user's decks
    const { data: decks } = await supabase
      .from('decks')
      .select('id, title, cards(id)')
      .eq('user_id', user.id);

    if (!decks || decks.length === 0) {
      return NextResponse.json({ cards: [] }, { status: 200 });
    }

    // Get all card IDs from user's decks
    const allCardIds = decks.flatMap((deck: any) =>
      deck.cards.map((card: any) => card.id)
    );

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

    // Combine due and new cards
    const cardIdsToStudy = [...new Set([...dueCardIds, ...newCardIds])];

    if (cardIdsToStudy.length === 0) {
      return NextResponse.json({ cards: [] }, { status: 200 });
    }

    // Fetch the actual cards with deck info
    const { data: cards } = await supabase
      .from('cards')
      .select('*, decks(id, title)')
      .in('id', cardIdsToStudy);

    return NextResponse.json({ cards: cards || [] }, { status: 200 });
  } catch (error) {
    console.error('Get due reviews error:', error);
    return NextResponse.json(
      { error: 'An unexpected error occurred' },
      { status: 500 }
    );
  }
}
