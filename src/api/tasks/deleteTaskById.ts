import { dbOperationWrapper } from "../apiWrapper";
import {
  GENERIC_ERROR_MESSAGES,
  GENERIC_SUCCESS_MESSAGES,
} from "../../constants";
import { supabase } from "../../utils/supabase/component";
import { taskUuidSchema } from "../../schemas/tasks";
import { sanitizeInput } from "../../utils/inputSanitization";

export async function deleteTaskById(id: string): Promise<boolean> {
  // Sanitize and validate ID
  const sanitizationResult = sanitizeInput(taskUuidSchema, id);

  if (!sanitizationResult.success) {
    throw new Error(sanitizationResult.error);
  }

  const sanitizedId = sanitizationResult.data;

  return await dbOperationWrapper(
    async () => {
      const userId = (await supabase.auth.getSession()).data.session?.user.id;

      if (!userId) {
        throw new Error("No user session");
      }

      const { error } = await supabase
        .from("task")
        .delete()
        .eq("id", sanitizedId)
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
