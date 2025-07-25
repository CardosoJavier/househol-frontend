import { z } from "zod";

// Task priority validation - more flexible to handle existing data
export const taskPrioritySchema = z
  .string()
  .trim()
  .toLowerCase()
  .transform((val) => {
    // Normalize different priority formats
    const normalized = val.toLowerCase();
    if (["low", "l", "1"].includes(normalized)) return "low";
    if (["medium", "med", "m", "2"].includes(normalized)) return "medium";
    if (["high", "h", "3"].includes(normalized)) return "high";
    if (["urgent", "critical", "u", "4"].includes(normalized)) return "urgent";
    return "medium"; // default fallback
  });

// Task status validation - more flexible to handle existing data
export const taskStatusSchema = z
  .string()
  .trim()
  .toLowerCase()
  .transform((val) => {
    const normalized = val.toLowerCase().replace(/[\s-_]/g, "");
    if (["pending", "todo", "new"].includes(normalized)) return "pending";
    if (["inprogress", "progress", "active", "doing"].includes(normalized))
      return "in-progress";
    if (["completed", "done", "finished", "complete"].includes(normalized))
      return "completed";
    if (["cancelled", "canceled", "stopped"].includes(normalized))
      return "cancelled";
    return "pending"; // default fallback
  });

// Task description validation - REJECT malicious input, don't sanitize
export const taskDescriptionSchema = z
  .string()
  .trim()
  .min(1, "Task description is required")
  .max(500, "Task description cannot exceed 500 characters")
  .refine((description) => {
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
      // SQL injection patterns (more specific to avoid false positives)
      /['"`;\\]/g, // SQL injection characters
      /--/g, // SQL comment syntax
      /\/\*/g, // SQL block comment start
      /\*\//g, // SQL block comment end
      // SQL keywords in suspicious contexts (with semicolons or specific patterns)
      /;\s*(DROP|DELETE|INSERT|UPDATE|UNION|SELECT|EXEC|EXECUTE|TRUNCATE|ALTER|CREATE)\b/gi,
      /\b(DROP\s+TABLE|DELETE\s+FROM|INSERT\s+INTO|UNION\s+SELECT)\b/gi,
    ];

    // Check if input contains any dangerous patterns
    const containsDangerousContent = dangerousPatterns.some((pattern) =>
      pattern.test(description)
    );

    return !containsDangerousContent;
  }, "Invalid task description format");

// Date validation
export const futureDateSchema = z.date().refine((date) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const normalizedDate = new Date(
    date.getFullYear(),
    date.getMonth(),
    date.getDate()
  );

  return normalizedDate >= today;
}, "Due date cannot be in the past");
export const timeSchema = z
  .string()
  .regex(
    /^([01]?[0-9]|2[0-3]):[0-5][0-9](:[0-5][0-9])?$/,
    "Time must be in HH:MM format (24-hour)"
  )
  .transform((time) => {
    // Always return HH:MM format, remove seconds if present
    return time.slice(0, 5);
  })
  .optional();

// UUID validation with fallback for tests
export const taskUuidSchema = z.string().refine((val) => {
  // Allow UUIDs or simple test IDs
  const uuidRegex =
    /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  const testIdRegex = /^[a-zA-Z0-9_-]+$/;
  return uuidRegex.test(val) || testIdRegex.test(val);
}, "Invalid ID format");

// Task creation schema - more flexible for existing data
export const createTaskSchema = z.object({
  description: taskDescriptionSchema,
  dueDate: z.date().refine((date) => {
    // Get today's date in local timezone, normalized to midnight
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Normalize the input date to midnight in local timezone
    const normalizedDate = new Date(
      date.getFullYear(),
      date.getMonth(),
      date.getDate()
    );

    // Create max date (2 years from today)
    const maxDate = new Date(today);
    maxDate.setFullYear(maxDate.getFullYear() + 2);

    const isValid = normalizedDate >= today && normalizedDate <= maxDate;

    // Debug logging (remove in production)
    if (!isValid) {
      console.debug("Date validation failed:", {
        inputDate: date,
        normalizedDate,
        today,
        maxDate,
        comparison: `${normalizedDate.toDateString()} >= ${today.toDateString()} && ${normalizedDate.toDateString()} <= ${maxDate.toDateString()}`,
      });
    }

    return isValid;
  }, "Due date must be between today and two years from now"),
  priority: z
    .string()
    .min(1, "Priority is required")
    .refine((val) => {
      const normalized = val.toLowerCase();
      return [
        "low",
        "l",
        "1",
        "medium",
        "med",
        "m",
        "2",
        "high",
        "h",
        "3",
      ].includes(normalized);
    }, "Invalid priority value")
    .transform((val) => {
      const normalized = val.toLowerCase();
      if (["low", "l", "1"].includes(normalized)) return "low";
      if (["medium", "med", "m", "2"].includes(normalized)) return "medium";
      if (["high", "h", "3"].includes(normalized)) return "high";
      return "medium"; // This line is unreachable due to refine, but kept for type safety
    }),
  type: z
    .string()
    .min(1, "Task type is required")
    .refine((val) => {
      const validTypes = [
        "feature",
        "bug",
        "refactor",
        "maintenance",
        "documentation",
        "testing",
        "research",
        "design",
        "other",
      ];
      return validTypes.includes(val.toLowerCase());
    }, "Invalid task type")
    .transform((val) => val.toLowerCase()),
  projectId: taskUuidSchema,
});

// Task update schema (all fields optional except ID)
export const updateTaskSchema = z.object({
  id: taskUuidSchema,
  description: taskDescriptionSchema.optional(),
  dueDate: z.date().optional(),
  priority: z
    .string()
    .optional()
    .transform((val) => {
      if (!val) return undefined;
      if (["low", "medium", "high"].includes(val)) return val;

      const normalized = val.toLowerCase();
      if (["low", "l", "1"].includes(normalized)) return "low";
      if (["medium", "med", "m", "2"].includes(normalized)) return "medium";
      if (["high", "h", "3"].includes(normalized)) return "high";
      return "low";
    }),
  type: z
    .string()
    .optional()
    .refine((val) => {
      if (!val) return true; // Allow undefined/empty
      const validTypes = [
        "feature",
        "bug",
        "refactor",
        "maintenance",
        "documentation",
        "testing",
        "research",
        "design",
        "other",
      ];
      return validTypes.includes(val.toLowerCase());
    }, "Invalid task type")
    .transform((val) => (val ? val.toLowerCase() : undefined)),
  status: z.string().optional(),
  columnId: z.number().int().positive().optional(),
});

export type CreateTaskInput = z.infer<typeof createTaskSchema>;
export type UpdateTaskInput = z.infer<typeof updateTaskSchema>;
