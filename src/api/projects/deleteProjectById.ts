import { dbOperationWrapper } from "../apiWrapper";
import {
  GENERIC_ERROR_MESSAGES,
  GENERIC_SUCCESS_MESSAGES,
} from "../../constants";
import { supabase } from "../../utils/supabase/component";
import { projectUuidSchema } from "../../schemas/projects";
import { sanitizeInput } from "../../utils/inputSanitization";
import { showToast } from "../../components/notifications/CustomToast";

export async function deleteProjectById(id: string): Promise<boolean> {
  // Sanitize and validate ID
  const sanitizationResult = sanitizeInput(projectUuidSchema, id);

  if (!sanitizationResult.success) {
    // Show validation error toast and return early - no HTTP request
    showToast(sanitizationResult.error, "error");
    return false;
  }

  const sanitizedId = sanitizationResult.data;

  return await dbOperationWrapper(
    async () => {
      const userId = (await supabase.auth.getSession()).data.session?.user.id;

      if (!userId) {
        throw new Error("No user session");
      }

      const { error } = await supabase
        .from("projects")
        .delete()
        .eq("id", sanitizedId);

      return { error };
    },
    {
      showSuccessToast: true,
      showErrorToast: true,
      successMessage: GENERIC_SUCCESS_MESSAGES.PROJECT_DELETED,
      errorMessage: GENERIC_ERROR_MESSAGES.PROJECT_DELETE_FAILED,
    }
  );
}
