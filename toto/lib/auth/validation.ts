import { z } from 'zod';

/**
 * Validation schema for user signup
 * Includes email, password, and username
 */
export const signUpSchema = z.object({
  email: z
    .string()
    .min(1, 'Email is required')
    .email('Invalid email address'),

  password: z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .max(100, 'Password must be less than 100 characters'),

  username: z
    .string()
    .min(3, 'Username must be at least 3 characters')
    .max(20, 'Username must be less than 20 characters')
    .regex(
      /^[a-zA-Z0-9_-]+$/,
      'Username can only contain letters, numbers, hyphens, and underscores'
    ),
});

/**
 * Validation schema for user login
 * Only requires email and password
 */
export const signInSchema = z.object({
  email: z
    .string()
    .min(1, 'Email is required')
    .email('Invalid email address'),

  password: z
    .string()
    .min(1, 'Password is required'),
});

// Export types for TypeScript
export type SignUpInput = z.infer<typeof signUpSchema>;
export type SignInInput = z.infer<typeof signInSchema>;
