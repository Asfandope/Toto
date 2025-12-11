import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { signInSchema } from '@/lib/auth/validation';

export async function POST(request: Request) {
  try {
    const body = await request.json();

    // Validate request body
    const result = signInSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        { error: result.error.errors[0].message },
        { status: 400 }
      );
    }

    const { email, password } = result.data;
    const supabase = await createClient();

    // Sign in user
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      return NextResponse.json(
        { error: 'Invalid email or password' },
        { status: 401 }
      );
    }

    return NextResponse.json({ success: true, data }, { status: 200 });
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { error: 'An unexpected error occurred' },
      { status: 500 }
    );
  }
}
