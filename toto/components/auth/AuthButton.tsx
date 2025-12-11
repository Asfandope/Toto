'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { User, Settings, LogOut, LayoutDashboard } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';

export default function AuthButton() {
  const { user, isAuthenticated, openAuthModal, signOut, loading } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setMenuOpen(false);
      }
    };

    if (menuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [menuOpen]);

  const handleSignOut = async () => {
    try {
      await signOut();
      toast.success('Logged out successfully');
      router.push('/');
    } catch (error) {
      toast.error('Failed to log out');
    }
    setMenuOpen(false);
  };

  if (loading) {
    return (
      <div className="flex gap-2">
        <div className="w-20 h-10 bg-ink-200 rounded-lg animate-pulse" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="flex gap-2">
        <button
          onClick={() => openAuthModal('login')}
          className="btn btn-ghost"
        >
          Log in
        </button>
        <button
          onClick={() => openAuthModal('signup')}
          className="btn btn-primary"
        >
          Sign up
        </button>
      </div>
    );
  }

  return (
    <div className="relative" ref={menuRef}>
      <button
        onClick={() => setMenuOpen(!menuOpen)}
        className="flex items-center gap-2 p-2 rounded-lg hover:bg-ink-100 transition-colors"
      >
        <div className="w-8 h-8 rounded-full bg-toto-500 flex items-center justify-center text-white font-medium">
          {user?.email?.[0].toUpperCase()}
        </div>
      </button>

      {menuOpen && (
        <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg border border-ink-200 py-1 z-50">
          <div className="px-4 py-2 border-b border-ink-200">
            <p className="text-sm font-medium text-ink-900">{user?.email}</p>
          </div>

          <Link
            href="/dashboard"
            className="flex items-center gap-3 px-4 py-2 text-sm text-ink-700 hover:bg-ink-50 transition-colors"
            onClick={() => setMenuOpen(false)}
          >
            <LayoutDashboard className="w-4 h-4" />
            Dashboard
          </Link>

          <Link
            href="/settings"
            className="flex items-center gap-3 px-4 py-2 text-sm text-ink-700 hover:bg-ink-50 transition-colors"
            onClick={() => setMenuOpen(false)}
          >
            <Settings className="w-4 h-4" />
            Settings
          </Link>

          <div className="border-t border-ink-200 mt-1 pt-1">
            <button
              onClick={handleSignOut}
              className="flex items-center gap-3 px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors w-full text-left"
            >
              <LogOut className="w-4 h-4" />
              Log out
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
