import { dbOperationWrapper } from "../apiWrapper";
import { GENERIC_ERROR_MESSAGES, GENERIC_SUCCESS_MESSAGES } from "../../constants";
import { supabase } from "../../utils/supabase/component";
import { projectUuidSchema } from "../../schemas/projects";
import { sanitizeInput } from "../../utils/inputSanitization";
import { showToast } from "../../components/notifications/CustomToast";

export async function transferProjectOwnership(
  projectId: string,
  newOwnerId: string
): Promise<boolean> {
  // Sanitize and validate project ID
  const sanitizationResult = sanitizeInput(projectUuidSchema, projectId);

  if (!sanitizationResult.success) {
    showToast(sanitizationResult.error, "error");
    return false;
  }

  const sanitizedProjectId = sanitizationResult.data;

  return await dbOperationWrapper(
    async () => {
      const { error } = await supabase
        .from("projects")
        .update({ created_by: newOwnerId })
        .eq("id", sanitizedProjectId);

      return { error };
    },
    {
      successMessage: GENERIC_SUCCESS_MESSAGES.PERMISSIONS_UPDATED,
      errorMessage: GENERIC_ERROR_MESSAGES.UNEXPECTED_ERROR,
      showSuccessToast: true,
      showErrorToast: true,
    }
  );
}