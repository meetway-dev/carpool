import { isValidPakistaniPhone, normalizePakistaniPhone } from "@/lib/phone";
import { z } from "zod";

export const emailSchema = z
  .string()
  .email("Enter a valid email address")
  .trim()
  .transform((value) => value.toLowerCase());

export const passwordSchema = z
  .string()
  .min(8, "Password must be at least 8 characters")
  .max(128, "Password is too long");

export const nameSchema = z
  .string()
  .min(2, "Name is too short")
  .max(60, "Name is too long")
  .trim()
  .optional();

export const signupSchema = z.object({
  email: emailSchema,
  password: passwordSchema,
  name: nameSchema,
  phone: z
    .string()
    .min(6, "Enter a valid WhatsApp phone number")
    .refine((v) => isValidPakistaniPhone(v), { message: "Enter a valid Pakistani mobile number" })
    .transform((v) => normalizePakistaniPhone(v) as string),
});

export const loginSchema = z.object({
  email: emailSchema,
  password: z.string().min(1, "Enter your password"),
});

export type SignupInput = z.infer<typeof signupSchema>;
export type LoginInput = z.infer<typeof loginSchema>;

export const forgotPasswordSchema = z.object({
  email: emailSchema,
});

export const resetPasswordSchema = z.object({
  token: z.string().min(8, "Invalid token"),
  password: passwordSchema,
});

export type ForgotPasswordInput = z.infer<typeof forgotPasswordSchema>;
export type ResetPasswordInput = z.infer<typeof resetPasswordSchema>;
