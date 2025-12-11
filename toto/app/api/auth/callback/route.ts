import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function GET(request: Request) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get('code');
  const origin = requestUrl.origin;

  if (code) {
    const supabase = await createClient();

    // Exchange code for session
    const { error } = await supabase.auth.exchangeCodeForSession(code);

    if (!error) {
      // Redirect to dashboard on successful authentication
      return NextResponse.redirect(`${origin}/dashboard`);
    }
  }

  // If there's an error or no code, redirect to home
  return NextResponse.redirect(`${origin}/`);
}
