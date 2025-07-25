import { dbOperationWrapper } from "../apiWrapper";
import {
  GENERIC_ERROR_MESSAGES,
  GENERIC_SUCCESS_MESSAGES,
} from "../../constants";
import { supabase } from "../../utils/supabase/component";

export async function removeProjectMember(
  projectId: string,
  userId: string,
  options?: {
    successMessage?: string;
    showSuccessToast?: boolean;
    showErrorToast?: boolean;
  }
): Promise<boolean> {
  return await dbOperationWrapper(
    async () => {
      const currentUserId = (await supabase.auth.getSession()).data.session
        ?.user.id;

      if (!currentUserId) {
        throw new Error("No user session");
      }

      // Remove the user from the project
      const { error } = await supabase
        .from("users_projects")
        .delete()
        .eq("project_id", projectId)
        .eq("user_id", userId);

      return { error };
    },
    {
      successMessage:
        options?.successMessage || GENERIC_SUCCESS_MESSAGES.MEMBER_REMOVED,
      showSuccessToast: options?.showSuccessToast ?? true,
      showErrorToast: options?.showErrorToast ?? true,
      errorMessage: GENERIC_ERROR_MESSAGES.MEMBER_REMOVE_FAILED,
    }
  );
}
