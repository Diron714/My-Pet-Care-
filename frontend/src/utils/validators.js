import { z } from 'zod';

// Registration schema
export const registerSchema = z.object({
  firstName: z.string().min(2, 'First name must be at least 2 characters'),
  lastName: z.string().min(2, 'Last name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  phone: z.string().regex(/^[0-9]{10,15}$/, 'Invalid phone number'),
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
    .regex(/[0-9]/, 'Password must contain at least one number')
    .regex(/[^A-Za-z0-9]/, 'Password must contain at least one special character'),
  confirmPassword: z.string(),
  role: z.enum(['customer', 'doctor', 'staff']),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ['confirmPassword'],
});

// Login schema
export const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
});

// OTP schema
export const otpSchema = z.object({
  otpCode: z.string().length(6, 'OTP must be 6 digits'),
});

// Forgot password schema
export const forgotPasswordSchema = z.object({
  email: z.string().email('Invalid email address'),
});

// Reset password schema
export const resetPasswordSchema = z.object({
  otpCode: z.string().length(6, 'OTP must be 6 digits'),
  newPassword: z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
    .regex(/[0-9]/, 'Password must contain at least one number')
    .regex(/[^A-Za-z0-9]/, 'Password must contain at least one special character'),
  confirmPassword: z.string(),
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: "Passwords don't match",
  path: ['confirmPassword'],
});

// Pet profile schema
export const petProfileSchema = z.object({
  name: z.string().min(1, 'Pet name is required'),
  species: z.string().min(1, 'Species is required'),
  breed: z.string().min(1, 'Breed is required'),
  age: z.number().min(1, 'Age must be at least 1 month'),
  gender: z.enum(['male', 'female', 'other']),
});

// Appointment booking schema
export const appointmentSchema = z.object({
  doctorId: z.number().min(1, 'Doctor selection is required'),
  customerPetId: z.number().min(1, 'Pet selection is required'),
  appointmentDate: z.string().min(1, 'Date is required'),
  appointmentTime: z.string().min(1, 'Time is required'),
});

// Exchange request schema
export const exchangeRequestSchema = z.object({
  orderId: z.number().min(1, 'Order selection is required'),
  petId: z.number().min(1, 'Pet selection is required'),
  reason: z.string().min(10, 'Reason must be at least 10 characters'),
});

// Feedback schema
export const feedbackSchema = z
  .object({
    feedbackType: z.enum(['product', 'service', 'doctor']),
    itemId: z
      .number({
        invalid_type_error: 'Item selection is required',
        required_error: 'Item selection is required',
      })
      .int()
      .nonnegative(),
    rating: z.number().min(1).max(5),
    comment: z.string().optional(),
  })
  .refine(
    (data) => data.feedbackType === 'service' || data.itemId >= 1,
    {
      path: ['itemId'],
      message: 'Item selection is required',
    }
  );

// Reminder schema
export const reminderSchema = z.object({
  reminderType: z.enum(['vaccination', 'medication', 'food', 'appointment']),
  title: z.string().min(1, 'Title is required'),
  description: z.string().optional(),
  reminderDate: z.string().min(1, 'Date is required'),
  reminderTime: z.string().optional(),
});

