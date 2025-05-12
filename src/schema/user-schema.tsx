import { z } from 'zod';

// Schema for user registration/creation
export const userRegistrationSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  phone: z.string().min(10, 'Phone number must be at least 10 digits'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  isAdmin: z.boolean().optional().default(false),
});

// Schema for user response
export const userResponseSchema = z.object({
  success: z.boolean(),
  token: z.string(),
  data: z.object({
    user: z.object({
      _id: z.string(),
      name: z.string(),
      email: z.string(),
      phone: z.string(),
      isAdmin: z.boolean(),
    }),
  }),
});


export const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
});

// Type inference from schemas
export type UserRegistration = z.infer<typeof userRegistrationSchema>;
export type UserResponse = z.infer<typeof userResponseSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
