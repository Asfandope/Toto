import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { getCurrentUser } from '@/lib/auth/helpers';

/**
 * GET /api/decks
 * List user's decks or public decks
 */
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const publicOnly = searchParams.get('public') === 'true';

    const supabase = await createClient();
    const user = await getCurrentUser();

    let query = supabase
      .from('decks')
      .select('*, cards(count)')
      .order('updated_at', { ascending: false });

    if (publicOnly) {
      // Get all public decks
      query = query.eq('is_public', true);
    } else if (user) {
      // Get user's own decks (both public and private)
      query = query.eq('user_id', user.id);
    } else {
      // Not authenticated and not requesting public decks
      return NextResponse.json({ decks: [] }, { status: 200 });
    }

    const { data: decks, error } = await query;

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json({ decks }, { status: 200 });
  } catch (error) {
    console.error('Get decks error:', error);
    return NextResponse.json(
      { error: 'An unexpected error occurred' },
      { status: 500 }
    );
  }
}

/**
 * POST /api/decks
 * Create a new deck
 */
export async function POST(request: Request) {
  try {
    const user = await getCurrentUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { title, description, is_public = false, cards, source_url } = body;

    if (!title) {
      return NextResponse.json(
        { error: 'Title is required' },
        { status: 400 }
      );
    }

    const supabase = await createClient();

    // Create deck
    const { data: deck, error: deckError } = await supabase
      .from('decks')
      .insert({
        user_id: user.id,
        title,
        description,
        is_public,
        source_url,
      })
      .select()
      .single();

    if (deckError) {
      return NextResponse.json({ error: deckError.message }, { status: 400 });
    }

    // Add cards if provided
    if (cards && Array.isArray(cards) && cards.length > 0) {
      const cardsToInsert = cards.map((card: any, index: number) => ({
        deck_id: deck.id,
        front: card.front,
        back: card.back,
        is_reversible: card.reversible || false,
        position: index,
      }));

      const { error: cardsError } = await supabase
        .from('cards')
        .insert(cardsToInsert);

      if (cardsError) {
        // If card insertion fails, we should still return the deck
        console.error('Error inserting cards:', cardsError);
      }
    }

    return NextResponse.json({ deck }, { status: 201 });
  } catch (error) {
    console.error('Create deck error:', error);
    return NextResponse.json(
      { error: 'An unexpected error occurred' },
      { status: 500 }
    );
  }
}
