import { AuthError } from "@supabase/supabase-js";
import { SuccessfulSignInResponse } from "../../models";
import { supabase } from "../../utils";
import { apiWrapper } from "../apiWrapper";
import { GENERIC_ERROR_MESSAGES } from "../../constants";
import { signInSchema } from "../../schemas";
import { sanitizeInput } from "../../utils/inputSanitization";
import { showToast } from "../../components/notifications/CustomToast";

export async function signIn(email: string, password: string) {
  // Sanitize and validate input
  const sanitizationResult = sanitizeInput(signInSchema, { email, password });

  if (!sanitizationResult.success) {
    // For security reasons, show generic message on login (prevent user enumeration)
    showToast(GENERIC_ERROR_MESSAGES.AUTH_SIGNIN_FAILED, "error");
    return { message: "Invalid email or password" };
  }

  const { email: sanitizedEmail, password: sanitizedPassword } =
    sanitizationResult.data;

  const result = await apiWrapper(
    async () => {
      const response = await supabase.auth.signInWithPassword({
        email: sanitizedEmail,
        password: sanitizedPassword,
      });
      return {
        data: response.data,
        error: response.error,
      };
    },
    {
      showErrorToast: false,
      errorMessage: GENERIC_ERROR_MESSAGES.AUTH_SIGNIN_FAILED,
      logErrors: true,
    }
  );

  if (result.success) {
    return result.data as SuccessfulSignInResponse;
  } else {
    // If it's an error with status property (AuthError), return it; if it's a generic error, return undefined
    if (
      result.error &&
      typeof result.error === "object" &&
      "status" in result.error
    ) {
      return result.error as AuthError;
    }
    // Unexpected error (network, etc.)
    return undefined;
  }
}
