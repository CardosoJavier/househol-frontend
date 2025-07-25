export const TASK_TYPES = {
  FEATURE: "feature",
  BUG: "bug",
  REFACTOR: "refactor",
  MAINTENANCE: "maintenance",
  DOCUMENTATION: "documentation",
  TESTING: "testing",
  RESEARCH: "research",
  DESIGN: "design",
  OTHER: "other",
} as const;

export const TASK_TYPE_OPTIONS = [
  { value: TASK_TYPES.FEATURE, label: "Feature" },
  { value: TASK_TYPES.BUG, label: "Bug" },
  { value: TASK_TYPES.REFACTOR, label: "Refactor" },
  { value: TASK_TYPES.MAINTENANCE, label: "Maintenance" },
  { value: TASK_TYPES.DOCUMENTATION, label: "Documentation" },
  { value: TASK_TYPES.TESTING, label: "Testing" },
  { value: TASK_TYPES.RESEARCH, label: "Research" },
  { value: TASK_TYPES.DESIGN, label: "Design" },
  { value: TASK_TYPES.OTHER, label: "Other" },
];

export type TaskType = (typeof TASK_TYPES)[keyof typeof TASK_TYPES];
