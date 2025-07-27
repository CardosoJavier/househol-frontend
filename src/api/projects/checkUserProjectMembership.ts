import { dbOperationWrapper } from "../apiWrapper";
import { GENERIC_ERROR_MESSAGES } from "../../constants";
import { supabase } from "../../utils/supabase/component";
import { sanitizeInput } from "../../utils/inputSanitization";
import { projectUuidSchema } from "../../schemas/projects";
import { showToast } from "../../components/notifications/CustomToast";

export async function checkUserProjectMembership(
  projectId: string
): Promise<boolean> {
  // Sanitize and validate project ID
  const sanitizationResult = sanitizeInput(projectUuidSchema, projectId);

  if (!sanitizationResult.success) {
    // Show validation error toast and return early - no HTTP request
    showToast(sanitizationResult.error, "error");
    return false;
  }

  const sanitizedProjectId = sanitizationResult.data;

  return await dbOperationWrapper(
    async () => {
      const userId = (await supabase.auth.getSession()).data.session?.user.id;

      if (!userId) {
        throw new Error("No user session");
      }

      // Check if user is a member of the project
      const { data: membership, error } = await supabase
        .from("users_projects")
        .select("user_id")
        .eq("user_id", userId)
        .eq("project_id", sanitizedProjectId)
        .single();

      return { membership, error };
    },
    {
      showSuccessToast: false,
      showErrorToast: true,
      errorMessage: GENERIC_ERROR_MESSAGES.PROJECT_ACCESS_DENIED,
    }
  );
}
