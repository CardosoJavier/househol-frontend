import { dbOperationWrapper } from "../apiWrapper";
import {
  GENERIC_ERROR_MESSAGES,
  GENERIC_SUCCESS_MESSAGES,
} from "../../constants";
import { supabase } from "../../utils/supabase/component";

export async function deleteUser(): Promise<boolean> {
  return await dbOperationWrapper(
    async () => {
      const userId = (await supabase.auth.getSession()).data.session?.user.id;

      if (!userId) {
        throw new Error("No user session");
      }

      // Delete the user from the users table
      const { error } = await supabase
        .from("users")
        .delete()
        .eq("id", userId);

      return { error };
    },
    {
      showSuccessToast: true,
      showErrorToast: true,
      successMessage: GENERIC_SUCCESS_MESSAGES.USER_DELETED,
      errorMessage: GENERIC_ERROR_MESSAGES.USER_DELETE_FAILED,
    }
  );
}