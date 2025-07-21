import { z } from "zod";

// Search query validation with sanitization
export const searchQuerySchema = z
  .string()
  .trim()
  .max(100, "Search query cannot exceed 100 characters")
  .refine((query) => {
    // Remove potential SQL injection attempts and HTML
    const cleaned = query.replace(/<[^>]*>/g, "").replace(/['"`;\\]/g, "");
    return cleaned.length >= 0;
  }, "Invalid search query")
  .transform((query) => {
    // Sanitize the search query
    return query
      .replace(/<[^>]*>/g, "")
      .replace(/['"`;\\]/g, "")
      .trim();
  })
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
