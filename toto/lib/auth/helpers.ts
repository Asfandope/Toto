import { createClient as createServerClient } from '@/lib/supabase/server';
import { createClient as createBrowserClient } from '@/lib/supabase/client';
import type { Provider } from '@supabase/supabase-js';

/**
 * Get the current user session (server-side)
 */
export async function getSession() {
  const supabase = await createServerClient();
  const { data: { session }, error } = await supabase.auth.getSession();

  if (error) {
    console.error('Error getting session:', error);
    return null;
  }

  return session;
}

/**
 * Get the current user with profile data (server-side)
 */
export async function getCurrentUser() {
  const supabase = await createServerClient();

  // Get auth user
  const { data: { user }, error: authError } = await supabase.auth.getUser();

  if (authError || !user) {
    return null;
  }

  // Get profile data from public.users table
  const { data: profile, error: profileError } = await supabase
    .from('users')
    .select('*')
    .eq('id', user.id)
    .single();

  if (profileError) {
    console.error('Error fetching user profile:', profileError);
    return null;
  }

  return profile;
}

/**
 * Check if a user is authenticated (server-side)
 */
export async function isAuthenticated(): Promise<boolean> {
  const session = await getSession();
  return !!session;
}

/**
 * Client-side auth helpers
 * These are meant to be used in client components and hooks
 */
export const clientAuth = {
  /**
   * Sign up with email and password
   */
  async signUp(email: string, password: string, username: string) {
    const supabase = createBrowserClient();

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          username, // This will be available in the trigger
        },
      },
    });

    if (error) {
      throw error;
    }

    return data;
  },

  /**
   * Sign in with email and password
   */
  async signIn(email: string, password: string) {
    const supabase = createBrowserClient();

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      throw error;
    }

    return data;
  },

  /**
   * Sign out
   */
  async signOut() {
    const supabase = createBrowserClient();

    const { error } = await supabase.auth.signOut();

    if (error) {
      throw error;
    }
  },

  /**
   * Sign in with OAuth provider
   */
  async signInWithOAuth(provider: Provider) {
    const supabase = createBrowserClient();

    const { data, error } = await supabase.auth.signInWithOAuth({
      provider,
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    });

    if (error) {
      throw error;
    }

    return data;
  },

  /**
   * Get current session (client-side)
   */
  async getSession() {
    const supabase = createBrowserClient();
    const { data: { session }, error } = await supabase.auth.getSession();

    if (error) {
      console.error('Error getting session:', error);
      return null;
    }

    return session;
  },

  /**
   * Get current user (client-side)
   */
  async getUser() {
    const supabase = createBrowserClient();
    const { data: { user }, error } = await supabase.auth.getUser();

    if (error) {
      console.error('Error getting user:', error);
      return null;
    }

    return user;
  },
};
