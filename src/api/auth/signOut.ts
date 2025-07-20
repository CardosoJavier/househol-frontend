import { supabase } from "../../utils";
import { authApiWrapper } from "../apiWrapper";
import {
  GENERIC_SUCCESS_MESSAGES,
  GENERIC_ERROR_MESSAGES,
} from "../../constants";

export async function signOut(): Promise<boolean> {
  const result = await authApiWrapper(
    async () => {
      const response = await supabase.auth.signOut();
      return {
        data: undefined, // signOut doesn't return data, just potential error
        error: response.error,
      };
    },
    {
      showSuccessToast: true,
      showErrorToast: true,
      successMessage: GENERIC_SUCCESS_MESSAGES.AUTH_SIGNOUT_SUCCESS,
      errorMessage: GENERIC_ERROR_MESSAGES.UNEXPECTED_ERROR,
    }
  );

  return result.success;
}
