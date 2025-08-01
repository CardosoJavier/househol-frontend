export const GENERIC_ERROR_MESSAGES = {
  // Authentication Errors
  AUTH_SIGNIN_FAILED: "Invalid email or password. Please try again.",
  AUTH_SIGNUP_FAILED: "Unable to create account. Please try again later.",
  AUTH_SESSION_EXPIRED: "Your session has expired. Please sign in again.",
  AUTH_EMAIL_VERIFICATION_REQUIRED:
    "Please verify your email address to continue.",

  // Database/API Errors
  DATABASE_ERROR: "Something went wrong. Please try again later.",
  NETWORK_ERROR: "Unable to connect. Please check your internet connection.",
  SERVER_ERROR: "Service temporarily unavailable. Please try again later.",

  // Task Management Errors
  TASK_CREATE_FAILED: "Unable to create task. Please try again.",
  TASK_UPDATE_FAILED: "Unable to update task. Please try again.",
  TASK_DELETE_FAILED: "Unable to delete task. Please try again.",
  TASK_LOAD_FAILED: "Unable to load tasks. Please refresh the page.",

  // Column Management Errors
  COLUMN_CREATE_FAILED: "Unable to create column. Please try again.",
  COLUMN_LOAD_FAILED: "Unable to load columns. Please refresh the page.",

  // Project Management Errors
  PROJECT_LOAD_FAILED: "Unable to load projects. Please refresh the page.",
  PROJECT_CREATE_FAILED: "Unable to create project. Please try again.",
  PROJECT_UPDATE_FAILED: "Unable to update project. Please try again.",
  PROJECT_DELETE_FAILED: "Unable to delete project. Please try again.",
  PROJECT_ACCESS_DENIED: "You don't have permission to access this project.",

  // Project Members Errors
  MEMBER_ADD_FAILED: "Unable to add team member. Please try again.",
  MEMBER_REMOVE_FAILED: "Unable to remove team member. Please try again.",
  MEMBER_NOT_FOUND: "User not found or email not verified.",

  // User Profile Errors
  PROFILE_LOAD_FAILED:
    "Unable to load profile information. Please refresh the page.",
  PROFILE_UPDATE_FAILED: "Unable to update profile. Please try again.",
  UPLOAD_FAILED: "Unable to upload file. Please try again.",
  USER_DELETE_FAILED: "Unable to delete account. Please try again.",

  // Validation Errors
  INVALID_INPUT: "Please check your input and try again.",
  REQUIRED_FIELDS_MISSING: "Please fill in all required fields.",

  // General Errors
  UNEXPECTED_ERROR: "An unexpected error occurred. Please try again.",
  PERMISSION_DENIED: "You don't have permission to perform this action.",
} as const;

// Helper function to log detailed errors while showing generic messages to users
export function handleError(error: any, genericMessage: string): string {
  console.error(error?.message ?? genericMessage);
  return genericMessage;
}

// Helper function to handle errors with toast notification
export function handleErrorWithToast(
  error: any,
  genericMessage: string,
  showToastFn: (message: string, type: string) => void
): void {
  console.error(error);
  showToastFn(genericMessage, "error");
}
