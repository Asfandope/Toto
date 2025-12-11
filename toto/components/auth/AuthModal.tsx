'use client';

import { useEffect } from 'react';
import { X } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import SignUpForm from './SignUpForm';
import LoginForm from './LoginForm';

export default function AuthModal() {
  const { authModalOpen, authModalMode, closeAuthModal } = useAuth();

  // Handle escape key to close modal
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        closeAuthModal();
      }
    };

    if (authModalOpen) {
      document.addEventListener('keydown', handleEscape);
      // Prevent body scroll when modal is open
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [authModalOpen, closeAuthModal]);

  if (!authModalOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={closeAuthModal}
      />

      {/* Modal */}
      <div className="relative z-10 w-full max-w-md mx-4">
        <div className="card bg-white">
          {/* Close button */}
          <button
            onClick={closeAuthModal}
            className="absolute top-4 right-4 p-2 text-ink-500 hover:text-ink-700 rounded-lg hover:bg-ink-100 transition-colors"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Content */}
          <div className="p-8">
            {authModalMode === 'signup' ? <SignUpForm /> : <LoginForm />}
          </div>
        </div>
      </div>
    </div>
  );
}
