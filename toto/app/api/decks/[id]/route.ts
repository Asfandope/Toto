import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { getCurrentUser } from '@/lib/auth/helpers';

/**
 * GET /api/decks/:id
 * Get a single deck with its cards and review statistics
 */
export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const supabase = await createClient();
    const user = await getCurrentUser();

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

    if (deckError) {
      return NextResponse.json(
        { error: 'Deck not found' },
        { status: 404 }
      );
    }

    // Check access permissions
    // Public decks are visible to everyone
    // Private decks are only visible to the owner
    if (!deck.is_public && (!user || deck.user_id !== user.id)) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 403 }
      );
    }

    // Get review statistics if user is authenticated
    let reviewStats = null;
    if (user) {
      // Get due card count
      const { count: dueCount } = await supabase
        .from('reviews')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', user.id)
        .in('card_id', deck.cards.map((c: any) => c.id))
        .lte('next_review_date', new Date().toISOString());

      // Get total reviewed count
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

    return NextResponse.json({ deck, reviewStats }, { status: 200 });
  } catch (error) {
    console.error('Get deck error:', error);
    return NextResponse.json(
      { error: 'An unexpected error occurred' },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/decks/:id
 * Delete a deck (owner only)
 */
export async function DELETE(
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

    // Check ownership
    const { data: deck } = await supabase
      .from('decks')
      .select('user_id')
      .eq('id', id)
      .single();

    if (!deck || deck.user_id !== user.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    // Delete deck (cards will be cascade deleted)
    const { error } = await supabase.from('decks').delete().eq('id', id);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error('Delete deck error:', error);
    return NextResponse.json(
      { error: 'An unexpected error occurred' },
      { status: 500 }
    );
  }
}

/**
 * PUT /api/decks/:id
 * Update a deck (owner only)
 */
export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const user = await getCurrentUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { title, description, is_public } = body;

    const supabase = await createClient();

    // Check ownership
    const { data: deck } = await supabase
      .from('decks')
      .select('user_id')
      .eq('id', id)
      .single();

    if (!deck || deck.user_id !== user.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    // Update deck
    const { data: updatedDeck, error } = await supabase
      .from('decks')
      .update({
        title,
        description,
        is_public,
        updated_at: new Date().toISOString(),
      })
      .eq('id', id)
      .select()
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json({ deck: updatedDeck }, { status: 200 });
  } catch (error) {
    console.error('Update deck error:', error);
    return NextResponse.json(
      { error: 'An unexpected error occurred' },
      { status: 500 }
    );
  }
}
