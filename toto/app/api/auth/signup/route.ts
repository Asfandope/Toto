import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { signUpSchema } from '@/lib/auth/validation';

export async function POST(request: Request) {
  try {
    const body = await request.json();

    // Validate request body
    const result = signUpSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        { error: result.error.errors[0].message },
        { status: 400 }
      );
    }

    const { email, password, username } = result.data;
    const supabase = await createClient();

    // Check if username is already taken
    const { data: existingUser } = await supabase
      .from('users')
      .select('username')
      .eq('username', username)
      .single();

    if (existingUser) {
      return NextResponse.json(
        { error: 'Username is already taken' },
        { status: 400 }
      );
    }

    // Sign up user
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          username,
        },
      },
    });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json({ success: true, data }, { status: 200 });
  } catch (error) {
    console.error('Signup error:', error);
    return NextResponse.json(
      { error: 'An unexpected error occurred' },
      { status: 500 }
    );
  }
}
