import { TASK_TYPES } from "./taskTypes";

/**
 * Task type priority order for sorting.
 * Lower numbers = higher priority (sorted first)
 */
export const TASK_TYPE_SORT_ORDER: { [key: string]: number } = {
  [TASK_TYPES.BUG]: 1,
  [TASK_TYPES.FEATURE]: 2,
  [TASK_TYPES.REFACTOR]: 3,
  [TASK_TYPES.MAINTENANCE]: 4,
  [TASK_TYPES.TESTING]: 5,
  [TASK_TYPES.DOCUMENTATION]: 6,
  [TASK_TYPES.RESEARCH]: 7,
  [TASK_TYPES.DESIGN]: 8,
  [TASK_TYPES.OTHER]: 9,
};

/**
 * Task priority order for sorting.
 * Lower numbers = higher priority (sorted first)
 */
export const TASK_PRIORITY_SORT_ORDER: { [key: string]: number } = {
  high: 1,
  medium: 2,
  low: 3,
};
