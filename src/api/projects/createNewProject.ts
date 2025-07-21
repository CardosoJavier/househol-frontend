import { dbOperationWrapper } from "../apiWrapper";
import {
  GENERIC_ERROR_MESSAGES,
  GENERIC_SUCCESS_MESSAGES,
} from "../../constants";
import { supabase } from "../../utils/supabase/component";
import { createProjectSchema } from "../../schemas";
import { sanitizeInput } from "../../utils/inputSanitization";

export async function createNewProject(projectName: string): Promise<boolean> {
  // Sanitize and validate input
  const sanitizationResult = sanitizeInput(createProjectSchema, {
    name: projectName,
  });

  if (!sanitizationResult.success) {
    throw new Error(sanitizationResult.error);
  }

  const { name: sanitizedProjectName } = sanitizationResult.data;

  return await dbOperationWrapper(
    async () => {
      const userId = (await supabase.auth.getSession()).data.session?.user.id;

      if (!userId) {
        throw new Error("No user session");
      }

      const { error } = await supabase.from("projects").insert([
        {
          name: sanitizedProjectName,
        },
      ]);

      return { error };
    },
    {
      showSuccessToast: true,
      showErrorToast: true,
      successMessage: GENERIC_SUCCESS_MESSAGES.PROJECT_CREATED,
      errorMessage: GENERIC_ERROR_MESSAGES.PROJECT_CREATE_FAILED,
    }
  );
}
