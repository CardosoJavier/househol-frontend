import { dbOperationWrapper } from "../apiWrapper";
import {
  GENERIC_ERROR_MESSAGES,
  GENERIC_SUCCESS_MESSAGES,
} from "../../constants";
import { supabase } from "../../utils/supabase/component";

export async function deleteTaskById(id: string): Promise<boolean> {
  return await dbOperationWrapper(
    async () => {
      const userId = (await supabase.auth.getSession()).data.session?.user.id;

      if (!userId) {
        throw new Error("No user session");
      }

      const { error } = await supabase
        .from("task")
        .delete()
        .eq("id", id)
        .eq("user_id", userId);

      return { error };
    },
    {
      showSuccessToast: true,
      showErrorToast: true,
      successMessage: GENERIC_SUCCESS_MESSAGES.TASK_DELETED,
      errorMessage: GENERIC_ERROR_MESSAGES.TASK_DELETE_FAILED,
    }
  );
}
