import { SignUpType } from "../../models";
import { supabase } from "../../utils";
import { apiWrapper } from "../apiWrapper";
import { GENERIC_ERROR_MESSAGES } from "../../constants";

export async function signUp({ userInfo }: { userInfo: SignUpType }) {
  const email = userInfo.email;
  const password = userInfo.password;
  const firstName = userInfo.name;
  const lastName = userInfo.lastName;

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
