import { PostgrestError, AuthError } from "@supabase/supabase-js";
import {
  GENERIC_ERROR_MESSAGES,
  GENERIC_SUCCESS_MESSAGES,
  handleError,
} from "../constants";
import { showToast } from "../components/notifications/CustomToast";

// Types for our API wrapper
export interface ApiResponse<T = any> {
  data?: T;
  error?: PostgrestError | AuthError | Error | null;
  success: boolean;
}

export interface ApiOptions {
  showSuccessToast?: boolean;
  showErrorToast?: boolean;
  successMessage?: string;
  errorMessage?: string;
  logErrors?: boolean;
}

// Default options for API calls
const DEFAULT_OPTIONS: Required<ApiOptions> = {
  showSuccessToast: false,
  showErrorToast: true,
  successMessage: GENERIC_SUCCESS_MESSAGES.ACTION_COMPLETED,
  errorMessage: GENERIC_ERROR_MESSAGES.UNEXPECTED_ERROR,
  logErrors: true,
};

/**
 * Centralized API wrapper that provides consistent error handling,
 * logging, and user feedback across all API operations.
 *
 * @param operation - The async operation to execute (usually a Supabase call)
 * @param options - Configuration for error handling, toasts, and logging
 * @returns Standardized API response with data, error, and success status
 */
export async function apiWrapper<T>(
  operation: () => Promise<{
    data?: T;
    error?: PostgrestError | AuthError | null;
  }>,
  options: ApiOptions = {}
): Promise<ApiResponse<T>> {
  const config = { ...DEFAULT_OPTIONS, ...options };

  try {
    const result = await operation();

    if (result.error) {
      // Handle Supabase errors (PostgrestError or AuthError)
      if (config.logErrors) {
        handleError(result.error, config.errorMessage);
      }

      if (config.showErrorToast) {
        const errorMessage = getErrorMessage(result.error, config.errorMessage);
        showToast(errorMessage, "error");
      }

      return {
        data: undefined,
        error: result.error,
        success: false,
      };
    }

    // Success case
    if (config.showSuccessToast) {
      showToast(config.successMessage, "success");
    }

    return {
      data: result.data,
      error: null,
      success: true,
    };
  } catch (error) {
    // Handle unexpected errors (network issues, etc.)
    if (config.logErrors) {
      handleError(error, config.errorMessage);
    }

    if (config.showErrorToast) {
      const errorMessage = getErrorMessage(error, config.errorMessage);
      showToast(errorMessage, "error");
    }

    return {
      data: undefined,
      error: error as Error,
      success: false,
    };
  }
}

/**
 * Enhanced API wrapper specifically for authentication operations
 */
export async function authApiWrapper<T>(
  operation: () => Promise<{ data?: T; error?: AuthError | null }>,
  options: ApiOptions = {}
): Promise<ApiResponse<T>> {
  const authOptions: ApiOptions = {
    errorMessage: GENERIC_ERROR_MESSAGES.AUTH_SIGNIN_FAILED,
    ...options,
  };

  // First, try the regular API wrapper
  const result = await apiWrapper(operation, {
    ...authOptions,
    showSuccessToast: false, // We'll handle this ourselves for special cases
    showErrorToast: false, // We'll handle this ourselves for special cases
  });

  // Handle special case: "Auth session missing" during logout should be treated as success
  if (!result.success && result.error) {
    const config = { ...DEFAULT_OPTIONS, ...authOptions };

    if (
      result.error.message === "Auth session missing!" &&
      config.successMessage?.includes("signed out")
    ) {
      // If we're trying to sign out and session is missing, treat as success
      if (config.showSuccessToast) {
        showToast(config.successMessage, "success");
      }

      return {
        data: undefined,
        error: null,
        success: true,
      };
    }

    // For other auth errors, show error toast if needed
    if (config.showErrorToast) {
      const errorMessage = getErrorMessage(result.error, config.errorMessage);
      showToast(errorMessage, "error");
    }
  } else if (result.success) {
    // Show success toast if needed
    const config = { ...DEFAULT_OPTIONS, ...authOptions };
    if (config.showSuccessToast) {
      showToast(config.successMessage, "success");
    }
  }

  return result;
}

/**
 * Enhanced API wrapper for database operations that return boolean success
 */
export async function dbOperationWrapper(
  operation: () => Promise<{ error?: PostgrestError | null }>,
  options: ApiOptions = {}
): Promise<boolean> {
  const result = await apiWrapper(operation, options);
  return result.success;
}

/**
 * Determines the appropriate error message to show to the user
 */
function getErrorMessage(error: any, fallbackMessage: string): string {
  // Handle specific Supabase auth errors with better messages
  if (error?.message) {
    switch (error.message) {
      case "Invalid login credentials":
        return GENERIC_ERROR_MESSAGES.AUTH_SIGNIN_FAILED;
      case "Email not confirmed":
        return GENERIC_ERROR_MESSAGES.AUTH_EMAIL_VERIFICATION_REQUIRED;
      case "User already registered":
        return "An account with this email already exists.";
      default:
        return fallbackMessage;
    }
  }

  return fallbackMessage;
}

/**
 * Utility function for operations that need session/user ID
 */
export async function withUserSession<T>(
  operation: (userId: string) => Promise<ApiResponse<T>>,
  options: ApiOptions = {}
): Promise<ApiResponse<T>> {
  const { supabase } = await import("../utils");

  try {
    const session = await supabase.auth.getSession();
    const userId = session.data.session?.user.id;

    if (!userId) {
      const errorMessage = "Please sign in to continue.";

      if (options.showErrorToast !== false) {
        showToast(errorMessage, "error");
      }

      if (options.logErrors !== false) {
        console.error("No user session found");
      }

      return {
        data: undefined,
        error: new Error("No user session"),
        success: false,
      };
    }

    return await operation(userId);
  } catch (error) {
    if (options.logErrors !== false) {
      handleError(error, GENERIC_ERROR_MESSAGES.AUTH_SESSION_EXPIRED);
    }

    if (options.showErrorToast !== false) {
      showToast(GENERIC_ERROR_MESSAGES.AUTH_SESSION_EXPIRED, "error");
    }

    return {
      data: undefined,
      error: error as Error,
      success: false,
    };
  }
}
