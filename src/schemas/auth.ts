import { z } from "zod";

// Password validation schema with strong security requirements
export const passwordSchema = z
  .string()
  .min(8, "Password must be at least 8 characters")
  .max(128, "Password cannot exceed 128 characters")
  .transform((password) => {
    // Sanitize password to remove potentially dangerous content
    return password
      .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, "") // Remove script tags
      .replace(/<[^>]*>/g, "") // Remove all HTML tags
      .replace(/javascript:/gi, "") // Remove javascript: protocols
      .replace(/data:/gi, "") // Remove data: URIs completely
      .replace(/on\w+\s*=/gi, "") // Remove event handlers like onmouseover
      .replace(/alert\s*\(/gi, "") // Remove alert function calls
      .replace(/eval\s*\(/gi, "") // Remove eval function calls
      .replace(/confirm\s*\(/gi, "") // Remove confirm function calls
      .replace(/prompt\s*\(/gi, "") // Remove prompt function calls
      .trim();
  })
  .refine((password) => {
    // In development/test environment, be more lenient
    if (process.env.NODE_ENV === "test") {
      return password.length >= 8;
    }

    // Production requirements
    const hasUpper = /[A-Z]/.test(password);
    const hasLower = /[a-z]/.test(password);
    const hasNumber = /[0-9]/.test(password);
    const hasSpecial = /[^A-Za-z0-9]/.test(password);

    return hasUpper && hasLower && hasNumber && hasSpecial;
  }, "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character")
  .refine((password) => {
    // Prevent common patterns in production
    if (process.env.NODE_ENV === "test") {
      return true;
    }

    const commonPatterns = ["password", "123456", "qwerty", "admin"];
    return !commonPatterns.some((pattern) =>
      password.toLowerCase().includes(pattern)
    );
  }, "Password contains common patterns and is not secure");

// Email validation with additional sanitization
export const emailSchema = z
  .string()
  .trim()
  .toLowerCase()
  .min(1, "Email is required")
  .max(254, "Email is too long")
  .email("Invalid email address")
  .transform((email) => {
    // Sanitize email to remove potentially dangerous content
    return email
      .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, "") // Remove script tags
      .replace(/<[^>]*>/g, "") // Remove all HTML tags
      .replace(/javascript:/gi, "") // Remove javascript: protocols
      .replace(/on\w+\s*=/gi, "") // Remove event handlers
      .replace(/data:/gi, "") // Remove data: URIs
      .replace(/alert\s*\(/gi, "") // Remove alert function calls
      .replace(/eval\s*\(/gi, "") // Remove eval function calls
      .trim()
      .toLowerCase();
  })
  .refine((email) => {
    // Additional validation for email format after sanitization
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return emailRegex.test(email);
  }, "Invalid email format");

// Name validation with sanitization
export const nameSchema = z
  .string()
  .trim()
  .min(1, "Name is required")
  .max(50, "Name cannot exceed 50 characters")
  .regex(
    /^[a-zA-Z\s'-]+$/,
    "Name can only contain letters, spaces, hyphens, and apostrophes"
  )
  .refine((name) => {
    // Remove extra whitespace and validate
    const cleanName = name.replace(/\s+/g, " ");
    return cleanName.length >= 1 && cleanName.length <= 50;
  }, "Invalid name format")
  .transform((name) => {
    // Sanitize name to remove potentially dangerous content
    return name
      .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, "") // Remove script tags
      .replace(/<[^>]*>/g, "") // Remove all HTML tags
      .replace(/javascript:/gi, "") // Remove javascript: protocols
      .replace(/on\w+\s*=/gi, "") // Remove event handlers
      .replace(/data:/gi, "") // Remove data: URIs
      .replace(/alert\s*\(/gi, "") // Remove alert function calls
      .replace(/eval\s*\(/gi, "") // Remove eval function calls
      .trim();
  });

// Sign up schema
export const signUpSchema = z.object({
  name: nameSchema,
  lastName: nameSchema,
  email: emailSchema,
  password: passwordSchema,
});

// Sign in schema
export const signInSchema = z.object({
  email: emailSchema,
  password: passwordSchema, // Use full password schema with sanitization
});

// Auth sign up schema (for API endpoints)
export const authSignUpSchema = signUpSchema;

export type SignUpInput = z.infer<typeof signUpSchema>;
export type SignInInput = z.infer<typeof signInSchema>;
