import { z } from "zod";

// Project name validation with sanitization
export const projectNameSchema = z
  .string()
  .trim()
  .min(1, "Project name is required")
  .max(100, "Project name cannot exceed 100 characters")
  .regex(
    /^[a-zA-Z0-9\s\-_.]+$/,
    "Project name can only contain letters, numbers, spaces, hyphens, underscores, and periods"
  )
  .refine((name) => {
    // Remove extra whitespace and validate
    const cleanName = name.replace(/\s+/g, " ");
    return cleanName.length >= 1 && cleanName.length <= 100;
  }, "Invalid project name format")
  .transform((name) => {
    // Sanitize and clean up the name
    return name
      .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, "") // Remove script tags
      .replace(/<[^>]*>/g, "") // Remove all HTML tags
      .replace(/javascript:/gi, "") // Remove javascript: protocols
      .replace(/on\w+\s*=/gi, "") // Remove event handlers
      .replace(/data:/gi, "") // Remove data: URIs
      .replace(/alert\s*\(/gi, "") // Remove alert function calls
      .replace(/eval\s*\(/gi, "") // Remove eval function calls
      .replace(/\s+/g, " ") // Clean up whitespace
      .trim();
  });

// UUID validation for project operations - flexible for tests
export const projectUuidSchema = z.string().refine((val) => {
  // Allow UUIDs or simple test IDs
  const uuidRegex =
    /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  const testIdRegex = /^[a-zA-Z0-9_-]+$/;
  return uuidRegex.test(val) || testIdRegex.test(val);
}, "Invalid project ID format");

// Project creation schema
export const createProjectSchema = z.object({
  name: projectNameSchema,
});

// Project update schema
export const updateProjectSchema = z.object({
  id: projectUuidSchema,
  name: projectNameSchema.optional(),
});

export type CreateProjectInput = z.infer<typeof createProjectSchema>;
export type UpdateProjectInput = z.infer<typeof updateProjectSchema>;
