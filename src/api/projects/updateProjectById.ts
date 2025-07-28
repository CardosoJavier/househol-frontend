import { dbOperationWrapper } from "../apiWrapper";
import {
  GENERIC_ERROR_MESSAGES,
  GENERIC_SUCCESS_MESSAGES,
} from "../../constants";
import { supabase } from "../../utils/supabase/component";
import { updateProjectSchema, UpdateProjectInput } from "../../schemas";
import { sanitizeInput } from "../../utils/inputSanitization";
import { showToast } from "../../components/notifications/CustomToast";

export async function updateProjectById(
  projectInput: UpdateProjectInput,
  options?: {
    successMessage?: string;
    showSuccessToast?: boolean;
    showErrorToast?: boolean;
  }
): Promise<boolean> {
  // Sanitize and validate input
  const sanitizationResult = sanitizeInput(updateProjectSchema, projectInput);

  if (!sanitizationResult.success) {
    // Show validation error toast and return early - no HTTP request
    showToast(sanitizationResult.error, "error");
    return false;
  }

  const sanitizedProjectData = sanitizationResult.data;

  return await dbOperationWrapper(
    async () => {
      const userId = (await supabase.auth.getSession()).data.session?.user.id;

      if (!userId) {
        throw new Error("No user session");
      }

      const { error } = await supabase
        .from("projects")
        .update({
          name: sanitizedProjectData.name,
          updated_at: new Date().toISOString(),
        })
        .eq("id", sanitizedProjectData.id);

      return { error };
    },
    {
      showSuccessToast: options?.showSuccessToast ?? true,
      showErrorToast: options?.showErrorToast ?? true,
      successMessage:
        options?.successMessage ?? GENERIC_SUCCESS_MESSAGES.PROJECT_UPDATED,
      errorMessage: GENERIC_ERROR_MESSAGES.PROJECT_UPDATE_FAILED,
    }
  );
}
