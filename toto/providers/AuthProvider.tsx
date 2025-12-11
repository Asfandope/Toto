'use client';

import { createContext, useEffect, useState, ReactNode } from 'react';
import { User } from '@supabase/supabase-js';
import { createClient } from '@/lib/supabase/client';
import { clientAuth } from '@/lib/auth/helpers';

export type AuthMode = 'login' | 'signup';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  isAuthenticated: boolean;
  signIn: typeof clientAuth.signIn;
  signUp: typeof clientAuth.signUp;
  signOut: typeof clientAuth.signOut;
  signInWithOAuth: typeof clientAuth.signInWithOAuth;
  // Auth modal state
  authModalOpen: boolean;
  authModalMode: AuthMode;
  openAuthModal: (mode: AuthMode) => void;
  closeAuthModal: () => void;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authModalMode, setAuthModalMode] = useState<AuthMode>('login');

  const supabase = createClient();

  useEffect(() => {
    // Get initial session
    const getInitialSession = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        setUser(session?.user ?? null);
      } catch (error) {
        console.error('Error getting initial session:', error);
      } finally {
        setLoading(false);
      }
    };

    getInitialSession();

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      setLoading(false);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [supabase.auth]);

  const openAuthModal = (mode: AuthMode) => {
    setAuthModalMode(mode);
    setAuthModalOpen(true);
  };

  const closeAuthModal = () => {
    setAuthModalOpen(false);
  };

  const handleSignOut = async () => {
    try {
      await clientAuth.signOut();
      closeAuthModal();
    } catch (error) {
      console.error('Error signing out:', error);
      throw error;
    }
  };

  const value = {
    user,
    loading,
    isAuthenticated: !!user,
    signIn: clientAuth.signIn,
    signUp: clientAuth.signUp,
    signOut: handleSignOut,
    signInWithOAuth: clientAuth.signInWithOAuth,
    authModalOpen,
    authModalMode,
    openAuthModal,
    closeAuthModal,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
