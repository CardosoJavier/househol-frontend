import { AuthError } from "@supabase/supabase-js";
import { SuccessfulSignInResponse } from "../../models";
import { supabase } from "../../utils";
import { apiWrapper } from "../apiWrapper";
import { GENERIC_ERROR_MESSAGES } from "../../constants";

export async function signIn(email: string, password: string) {
  const result = await apiWrapper(
    async () => {
      const response = await supabase.auth.signInWithPassword({
        email,
        password,
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
    return result.error as AuthError;
  }
}
