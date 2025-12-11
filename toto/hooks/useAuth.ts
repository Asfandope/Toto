'use client';

import { useContext } from 'react';
import { AuthContext } from '@/providers/AuthProvider';

/**
 * Hook to access authentication state and functions
 * Must be used within AuthProvider
 */
export function useAuth() {
  const context = useContext(AuthContext);

  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }

  return context;
}
