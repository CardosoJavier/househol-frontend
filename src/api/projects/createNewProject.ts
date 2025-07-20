import { dbOperationWrapper } from "../apiWrapper";
import {
  GENERIC_ERROR_MESSAGES,
  GENERIC_SUCCESS_MESSAGES,
} from "../../constants";
import { supabase } from "../../utils/supabase/component";

export async function createNewProject(projectName: string): Promise<boolean> {
  return await dbOperationWrapper(
    async () => {
      const userId = (await supabase.auth.getSession()).data.session?.user.id;

      if (!userId) {
        throw new Error("No user session");
      }

      const { error } = await supabase.from("projects").insert([
        {
          name: projectName,
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
