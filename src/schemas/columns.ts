import { z } from "zod";

// Column title validation with sanitization
export const columnTitleSchema = z
  .string()
  .trim()
  .min(1, "Column title is required")
  .max(50, "Column title cannot exceed 50 characters")
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
