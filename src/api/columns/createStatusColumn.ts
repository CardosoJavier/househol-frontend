import { dbOperationWrapper } from "../apiWrapper";
import {
  GENERIC_ERROR_MESSAGES,
  GENERIC_SUCCESS_MESSAGES,
} from "../../constants";
import { supabase } from "../../utils/supabase/component";
import { createColumnSchema } from "../../schemas";
import { sanitizeInput } from "../../utils/inputSanitization";

export async function createStatusColumn({
  title,
  status,
  projectId,
}: {
  title: string;
  status: string;
  projectId: string;
}): Promise<boolean> {
  // Sanitize and validate input
  const sanitizationResult = sanitizeInput(createColumnSchema, {
    title,
    status,
    projectId,
  });

  if (!sanitizationResult.success) {
    throw new Error(sanitizationResult.error);
  }

  const sanitizedColumnData = sanitizationResult.data;

  return await dbOperationWrapper(
    async () => {
      const { error } = await supabase.from("status_columns").insert([
        {
          title: sanitizedColumnData.title,
          status: sanitizedColumnData.status,
          project_id: sanitizedColumnData.projectId,
        },
      ]);

      return { error };
    },
    {
      showSuccessToast: true,
      showErrorToast: true,
      successMessage: GENERIC_SUCCESS_MESSAGES.COLUMN_CREATED,
      errorMessage: GENERIC_ERROR_MESSAGES.COLUMN_CREATE_FAILED,
    }
  );
}
