import { z } from "zod";

// Password validation schema with strong security requirements
export const passwordSchema = z
  .string()
  .min(8, "Password must be at least 8 characters")
  .max(128, "Password cannot exceed 128 characters")
  .refine((password) => {
    const maliciousPatterns = [
      /<script/i, // Script tags
      /javascript:/i, // JavaScript protocols
      /on\w+\s*=/i, // Event handlers (onmouseover, onclick, etc.)
      /data:/i, // Data URIs
      /vbscript:/i, // VBScript protocols
      /document\./i, // Document object access
      /window\./i, // Window object access
      /location\./i, // Location object access
      /alert\s*\(/i, // Alert function calls
      /eval\s*\(/i, // Eval function calls
      /confirm\s*\(/i, // Confirm function calls
      /prompt\s*\(/i, // Prompt function calls
    ];

    const containsMaliciousContent = maliciousPatterns.some((pattern) =>
      pattern.test(password)
    );

    return !containsMaliciousContent;
  }, "Invalid password format")
  .refine((password) => {
    return (
      /\d/.test(password) &&
      /[!@#$%^&*(),.?":{}|<>]/.test(password) &&
      /[A-Z]/.test(password)
    );
  }, "Password must contain at least 1 number, 1 special character, and 1 uppercase letter");

// Email validation - REJECT malicious input, don't sanitize
export const emailSchema = z
  .string()
  .trim()
  .toLowerCase()
  .min(1, "Email is required")
  .max(254, "Email is too long")
  .email("Invalid email address")
  .refine((email) => {
    // SECURITY: Reject emails containing malicious patterns
    const maliciousPatterns = [
      /<script/i, // Script tags
      /<[^>]*>/, // Any HTML tags
      /javascript:/i, // JavaScript protocols
      /on\w+\s*=/i, // Event handlers
      /data:/i, // Data URIs
      /alert\s*\(/i, // Alert function calls
      /eval\s*\(/i, // Eval function calls
    ];

    const containsMaliciousContent = maliciousPatterns.some((pattern) =>
      pattern.test(email)
    );

    return !containsMaliciousContent;
  }, "Invalid email format")
  .refine((email) => {
    // Additional validation for email format after malicious check
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return emailRegex.test(email);
  }, "Invalid email format");

// Name validation - REJECT malicious input, don't sanitize
export const nameSchema = z
  .string()
  .trim()
  .min(1, "Name is required")
  .max(50, "Name cannot exceed 50 characters")
  .refine((name) => {
    // SECURITY: Reject names containing malicious patterns
    const maliciousPatterns = [
      /<script/i, // Script tags
      /<[^>]*>/, // Any HTML tags
      /javascript:/i, // JavaScript protocols
      /on\w+\s*=/i, // Event handlers
      /data:/i, // Data URIs
      /alert\s*\(/i, // Alert function calls
      /eval\s*\(/i, // Eval function calls
    ];

    const containsMaliciousContent = maliciousPatterns.some((pattern) =>
      pattern.test(name)
    );

    return !containsMaliciousContent;
  }, "Invalid name format")
  .regex(
    /^[a-zA-Z\s'-]+$/,
    "Name can only contain letters, spaces, hyphens, and apostrophes"
  )
  .refine((name) => {
    // Remove extra whitespace and validate
    const cleanName = name.replace(/\s+/g, " ");
    return cleanName.length >= 1 && cleanName.length <= 50;
  }, "Invalid name format");

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
