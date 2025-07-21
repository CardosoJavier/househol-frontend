import { z } from "zod";

// Search query validation with malicious input rejection
export const searchQuerySchema = z
  .string()
  .trim()
  .max(100, "Search query cannot exceed 100 characters")
  .refine((query) => {
    // Check for malicious patterns and REJECT entirely if found
    const maliciousPatterns = [
      /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, // Script tags
      /<[^>]*>/g, // HTML tags
      /javascript:/gi, // javascript: protocols
      /on\w+\s*=/gi, // Event handlers
      /data:/gi, // data: URIs
      /alert\s*\(/gi, // alert function calls
      /eval\s*\(/gi, // eval function calls
      /['"`;\\]/g, // SQL injection characters
      /--/g, // SQL comment syntax
      /\/\*/g, // SQL block comment start
      /\*\//g, // SQL block comment end
      // Common SQL keywords (case insensitive)
      /\b(DROP|DELETE|INSERT|UPDATE|UNION|SELECT|EXEC|EXECUTE|TRUNCATE|ALTER|CREATE)\b/gi,
    ];

    // If ANY malicious pattern is found, REJECT the entire input
    return !maliciousPatterns.some((pattern) => pattern.test(query));
  }, "Search query contains invalid characters or patterns. Please use only alphanumeric characters, spaces, and basic punctuation.")
  .optional();

// Pagination parameters
export const paginationSchema = z.object({
  page: z.number().int().min(1, "Page must be at least 1").default(1),
  limit: z
    .number()
    .int()
    .min(1, "Limit must be at least 1")
    .max(100, "Limit cannot exceed 100")
    .default(10),
});

// Sorting parameters
export const sortSchema = z.object({
  field: z
    .enum(["createdAt", "updatedAt", "dueDate", "priority", "description"], {
      message: "Invalid sort field",
    })
    .optional(),
  direction: z
    .enum(["asc", "desc"], {
      message: "Sort direction must be 'asc' or 'desc'",
    })
    .default("desc"),
});

// Filter parameters for tasks
export const taskFilterSchema = z.object({
  search: searchQuerySchema,
  priority: z
    .enum(["low", "medium", "high", "urgent"], {
      message: "Invalid priority filter",
    })
    .optional(),
  status: z
    .enum(["pending", "in-progress", "completed", "cancelled"], {
      message: "Invalid status filter",
    })
    .optional(),
  projectId: z.string().uuid("Invalid project ID").optional(),
  dueDateFrom: z.date().optional(),
  dueDateTo: z.date().optional(),
  ...paginationSchema.shape,
  ...sortSchema.shape,
});

// Filter parameters for projects
export const projectFilterSchema = z.object({
  search: searchQuerySchema,
  ...paginationSchema.shape,
  ...sortSchema.shape,
});

export type SearchQuery = z.infer<typeof searchQuerySchema>;
export type PaginationParams = z.infer<typeof paginationSchema>;
export type SortParams = z.infer<typeof sortSchema>;
export type TaskFilterParams = z.infer<typeof taskFilterSchema>;
export type ProjectFilterParams = z.infer<typeof projectFilterSchema>;
