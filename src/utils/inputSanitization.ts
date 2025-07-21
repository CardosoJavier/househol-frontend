import { z } from "zod";

/**
 * Utility function to sanitize and validate input using Zod schemas
 * @param schema - The Zod schema to validate against
 * @param input - The input data to validate
 * @returns Object with success status, data (if valid), or error (if invalid)
 */
export function sanitizeInput<T>(
  schema: z.ZodSchema<T>,
  input: unknown
): { success: true; data: T } | { success: false; error: string } {
  try {
    const result = schema.parse(input);
    return { success: true, data: result };
  } catch (error) {
    if (error instanceof z.ZodError) {
      // Extract the first error message for user-friendly feedback
      const firstError = error.issues[0];
      return {
        success: false,
        error: firstError?.message || "Invalid input format",
      };
    }
    return {
      success: false,
      error: "Invalid input format",
    };
  }
}

/**
 * Utility function to sanitize and validate input using Zod schemas (async version)
 * @param schema - The Zod schema to validate against
 * @param input - The input data to validate
 * @returns Promise with success status, data (if valid), or error (if invalid)
 */
export async function sanitizeInputAsync<T>(
  schema: z.ZodSchema<T>,
  input: unknown
): Promise<{ success: true; data: T } | { success: false; error: string }> {
  try {
    const result = await schema.parseAsync(input);
    return { success: true, data: result };
  } catch (error) {
    if (error instanceof z.ZodError) {
      const firstError = error.issues[0];
      return {
        success: false,
        error: firstError?.message || "Invalid input format",
      };
    }
    return {
      success: false,
      error: "Invalid input format",
    };
  }
}

/**
 * HTML sanitization utility to prevent XSS attacks
 * @param input - The string to sanitize
 * @returns Sanitized string with HTML tags removed
 */
export function sanitizeHtml(input: string): string {
  return input
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, "") // Remove script tags
    .replace(/<[^>]*>/g, "") // Remove all HTML tags
    .replace(/javascript:/gi, "") // Remove javascript: protocols
    .replace(/on\w+\s*=/gi, "") // Remove event handlers
    .trim();
}

/**
 * Sanitize object properties recursively
 * @param obj - Object to sanitize
 * @returns Sanitized object
 */
export function sanitizeObject(obj: Record<string, any>): Record<string, any> {
  const sanitized: Record<string, any> = {};

  for (const [key, value] of Object.entries(obj)) {
    if (typeof value === "string") {
      sanitized[key] = sanitizeHtml(value);
    } else if (
      typeof value === "object" &&
      value !== null &&
      !Array.isArray(value)
    ) {
      sanitized[key] = sanitizeObject(value);
    } else {
      sanitized[key] = value;
    }
  }

  return sanitized;
}
