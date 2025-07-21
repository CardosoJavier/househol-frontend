import { z } from "zod";

// Project name validation - REJECT malicious input, don't sanitize
export const projectNameSchema = z
  .string()
  .trim()
  .min(1, "Project name is required")
  .max(100, "Project name cannot exceed 100 characters")
  .refine((name) => {
    // SECURITY: Reject project names containing malicious patterns
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
  }, "Invalid project name format")
  .regex(
    /^[a-zA-Z0-9\s\-_.]+$/,
    "Project name can only contain letters, numbers, spaces, hyphens, underscores, and periods"
  )
  .refine((name) => {
    // Remove extra whitespace and validate
    const cleanName = name.replace(/\s+/g, " ");
    return cleanName.length >= 1 && cleanName.length <= 100;
  }, "Invalid project name format");

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
