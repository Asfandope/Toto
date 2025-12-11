'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { useAuth } from '@/hooks/useAuth';
import { signUpSchema } from '@/lib/auth/validation';
import OAuthButtons from './OAuthButtons';

export default function SignUpForm() {
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const { signUp, closeAuthModal, openAuthModal } = useAuth();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});
    setLoading(true);

    try {
      // Validate form
      const result = signUpSchema.safeParse({ email, username, password });

      if (!result.success) {
        const fieldErrors: Record<string, string> = {};
        result.error.errors.forEach((err) => {
          if (err.path[0]) {
            fieldErrors[err.path[0] as string] = err.message;
          }
        });
        setErrors(fieldErrors);
        setLoading(false);
        return;
      }

      // Call API
      const response = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, username, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        toast.error(data.error || 'Failed to sign up');
        setLoading(false);
        return;
      }

      // Success
      toast.success('Account created successfully!');
      closeAuthModal();
      router.refresh();
    } catch (error) {
      console.error('Signup error:', error);
      toast.error('An unexpected error occurred');
      setLoading(false);
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-bold text-ink-900 mb-2">Create account</h2>
      <p className="text-ink-600 mb-6">Start your learning journey with Toto</p>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Email */}
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-ink-700 mb-1">
            Email
          </label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="input w-full"
            placeholder="you@example.com"
            disabled={loading}
          />
          {errors.email && (
            <p className="text-sm text-red-600 mt-1">{errors.email}</p>
          )}
        </div>

        {/* Username */}
        <div>
          <label htmlFor="username" className="block text-sm font-medium text-ink-700 mb-1">
            Username
          </label>
          <input
            type="text"
            id="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="input w-full"
            placeholder="your_username"
            disabled={loading}
          />
          {errors.username && (
            <p className="text-sm text-red-600 mt-1">{errors.username}</p>
          )}
        </div>

        {/* Password */}
        <div>
          <label htmlFor="password" className="block text-sm font-medium text-ink-700 mb-1">
            Password
          </label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="input w-full"
            placeholder="••••••••"
            disabled={loading}
          />
          {errors.password && (
            <p className="text-sm text-red-600 mt-1">{errors.password}</p>
          )}
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={loading}
          className="btn btn-primary w-full"
        >
          {loading ? 'Creating account...' : 'Sign up'}
        </button>
      </form>

      {/* Divider */}
      <div className="relative my-6">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-ink-200" />
        </div>
        <div className="relative flex justify-center text-sm">
          <span className="px-2 bg-white text-ink-500">Or continue with</span>
        </div>
      </div>

      {/* OAuth */}
      <OAuthButtons disabled={loading} />

      {/* Switch to login */}
      <p className="text-center text-sm text-ink-600 mt-6">
        Already have an account?{' '}
        <button
          onClick={() => openAuthModal('login')}
          className="text-toto-600 hover:text-toto-700 font-medium"
          disabled={loading}
        >
          Log in
        </button>
      </p>
    </div>
  );
}
