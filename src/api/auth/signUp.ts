import { SignUpType } from "../../models";
import { supabase } from "../../utils";
import { apiWrapper } from "../apiWrapper";
import { GENERIC_ERROR_MESSAGES } from "../../constants";
import { authSignUpSchema } from "../../schemas";
import { sanitizeInput } from "../../utils/inputSanitization";
import { showToast } from "../../components/notifications/CustomToast";

export async function signUp({ userInfo }: { userInfo: SignUpType }) {
  // Sanitize and validate input
  const sanitizationResult = sanitizeInput(authSignUpSchema, userInfo);

  if (!sanitizationResult.success) {
    // Show validation error toast and return early - no HTTP request
    showToast(sanitizationResult.error, "error");
    return { message: sanitizationResult.error };
  }

  const {
    email,
    password,
    name: firstName,
    lastName,
  } = sanitizationResult.data;

  const result = await apiWrapper(
    async () => {
      const response = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            first_name: firstName,
            last_name: lastName,
          },
        },
      });
      return {
        data: response.data,
        error: response.error,
      };
    },
    {
      showErrorToast: false, // Let the calling component handle toast
      errorMessage: GENERIC_ERROR_MESSAGES.AUTH_SIGNUP_FAILED,
      logErrors: true,
    }
  );

  if (result.error) {
    return result.error;
  }
  // Return undefined on success (matches original behavior)
  return undefined;
}
