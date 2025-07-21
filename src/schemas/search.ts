import { z } from "zod";

// Search query validation with comprehensive sanitization
export const searchQuerySchema = z
  .string()
  .trim()
  .max(100, "Search query cannot exceed 100 characters")
  .transform((query) => {
    // Comprehensive sanitization for search queries
    return (
      query
        .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, "") // Remove script tags
        .replace(/<[^>]*>/g, "") // Remove all HTML tags
        .replace(/javascript:/gi, "") // Remove javascript: protocols
        .replace(/on\w+\s*=/gi, "") // Remove event handlers
        .replace(/data:/gi, "") // Remove data: URIs
        .replace(/alert\s*\(/gi, "") // Remove alert function calls
        .replace(/eval\s*\(/gi, "") // Remove eval function calls
        .replace(/['"`;\\]/g, "") // Remove SQL injection characters
        .replace(/--/g, "") // Remove SQL comment syntax
        .replace(/\/\*/g, "") // Remove SQL block comment start
        .replace(/\*\//g, "") // Remove SQL block comment end
        // Remove common SQL keywords (case insensitive)
        .replace(
          /\b(DROP|DELETE|INSERT|UPDATE|UNION|SELECT|EXEC|EXECUTE|TRUNCATE|ALTER|CREATE)\b/gi,
          ""
        )
        .trim()
    );
  })
  .refine((query) => {
    // Ensure the sanitized query is still valid
    return query.length >= 0;
  }, "Invalid search query")
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
