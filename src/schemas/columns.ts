import { z } from "zod";

// Column title validation with comprehensive security and sanitization
export const columnTitleSchema = z
  .string()
  .trim()
  .min(1, "Column title is required")
  .max(50, "Column title cannot exceed 50 characters")
  .refine((title) => {
    // SECURITY: Reject any input containing potentially dangerous patterns
    // Don't sanitize - completely reject to prevent any malicious data storage
    
    const dangerousPatterns = [
      /<script/i, // Script tags
      /<\/script>/i, // Closing script tags
      /javascript:/i, // JavaScript protocols
      /on\w+\s*=/i, // Event handlers (onclick, onmouseover, etc.)
      /<[^>]*>/, // Any HTML tags
      /data:/i, // Data URIs
      /vbscript:/i, // VBScript protocols
      /alert\s*\(/i, // Alert function calls
      /eval\s*\(/i, // Eval function calls
      /confirm\s*\(/i, // Confirm function calls
      /prompt\s*\(/i, // Prompt function calls
      /document\./i, // Document object access
      /window\./i, // Window object access
      /location\./i, // Location object access
      /cookie/i, // Cookie access
      /localStorage/i, // LocalStorage access
      /sessionStorage/i, // SessionStorage access
      // SQL injection patterns
      /['"`;\\]/g, // SQL injection characters
      /--/g, // SQL comment syntax
      /\/\*/g, // SQL block comment start
      /\*\//g, // SQL block comment end
      // SQL keywords in suspicious contexts
      /;\s*(DROP|DELETE|INSERT|UPDATE|UNION|SELECT|EXEC|EXECUTE|TRUNCATE|ALTER|CREATE)\b/gi,
      /\b(DROP\s+TABLE|DELETE\s+FROM|INSERT\s+INTO|UNION\s+SELECT)\b/gi,
    ];

    // Check if input contains any dangerous patterns
    const containsDangerousContent = dangerousPatterns.some((pattern) =>
      pattern.test(title)
    );

    return !containsDangerousContent;
  }, "Invalid column title format")
  .regex(
    /^[a-zA-Z0-9\s\-_.]+$/,
    "Column title can only contain letters, numbers, spaces, hyphens, underscores, and periods"
  )
  .refine((title) => {
    const cleanTitle = title.replace(/\s+/g, " ");
    return cleanTitle.length >= 1 && cleanTitle.length <= 50;
  }, "Invalid column title format")
  .transform((title) => {
    return title.replace(/\s+/g, " ").trim();
  });

// Column status validation (should match task status)
export const columnStatusSchema = z
  .string()
  .trim()
  .min(1, "Column status is required")
  .max(30, "Column status cannot exceed 30 characters")
  .regex(
    /^[a-zA-Z0-9\-_]+$/,
    "Column status can only contain letters, numbers, hyphens, and underscores"
  )
  .transform((status) => status.toLowerCase());

// UUID validation
export const columnUuidSchema = z.string().uuid("Invalid column ID format");

// Column creation schema
export const createColumnSchema = z.object({
  title: columnTitleSchema,
  status: columnStatusSchema,
  projectId: columnUuidSchema,
});

// Column update schema
export const updateColumnSchema = z.object({
  id: columnUuidSchema,
  title: columnTitleSchema.optional(),
  status: columnStatusSchema.optional(),
});

export type CreateColumnInput = z.infer<typeof createColumnSchema>;
export type UpdateColumnInput = z.infer<typeof updateColumnSchema>;
