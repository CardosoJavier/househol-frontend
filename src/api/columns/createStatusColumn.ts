import { dbOperationWrapper } from "../apiWrapper";
import {
  GENERIC_ERROR_MESSAGES,
  GENERIC_SUCCESS_MESSAGES,
} from "../../constants";
import { supabase } from "../../utils/supabase/component";

export async function createStatusColumn({
  title,
  status,
  projectId,
}: {
  title: string;
  status: string;
  projectId: string;
}): Promise<boolean> {
  return await dbOperationWrapper(
    async () => {
      const { error } = await supabase.from("status_columns").insert([
        {
          title,
          status,
          project_id: projectId,
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
