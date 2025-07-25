import { dbOperationWrapper } from "../apiWrapper";
import {
  GENERIC_ERROR_MESSAGES,
  GENERIC_SUCCESS_MESSAGES,
} from "../../constants";
import { supabase } from "../../utils/supabase/component";
import { addProjectMemberSchema, AddProjectMemberInput } from "../../schemas";
import { sanitizeInput } from "../../utils/inputSanitization";
import { showToast } from "../../components/notifications/CustomToast";

export async function addProjectMemberByEmail(
  memberInput: AddProjectMemberInput,
  options?: {
    successMessage?: string;
    showSuccessToast?: boolean;
    showErrorToast?: boolean;
  }
): Promise<boolean> {
  // Sanitize and validate input
  const sanitizationResult = sanitizeInput(addProjectMemberSchema, memberInput);

  if (!sanitizationResult.success) {
    // Show validation error toast and return early - no HTTP request
    showToast(sanitizationResult.error, "error");
    return false;
  }

  const sanitizedMemberData = sanitizationResult.data;

  return await dbOperationWrapper(
    async () => {
      const currentUserId = (await supabase.auth.getSession()).data.session
        ?.user.id;

      if (!currentUserId) {
        throw new Error("No user session");
      }

      // Step 1: Check if email exists and is verified
      const { data: userData, error: userError } = await supabase
        .from("users")
        .select("id, email")
        .eq("email", sanitizedMemberData.email)
        .single();

      if (userError || !userData) {
        throw new Error("User with this email does not exist");
      }

      // Step 2: Check if email is verified
      if (!userData.email) {
        throw new Error(
          "User email is not verified. The user must verify their email before being added to projects."
        );
      }

      // Step 3: Check if user is already a member of the project
      const { data: existingMember } = await supabase
        .from("users_projects")
        .select("id")
        .eq("user_id", userData.id)
        .eq("project_id", sanitizedMemberData.projectId)
        .single();

      if (existingMember) {
        throw new Error("User is already a member of this project");
      }

      // Step 4: Add user to project
      const { error: insertError } = await supabase
        .from("users_projects")
        .insert([
          {
            user_id: userData.id,
            project_id: sanitizedMemberData.projectId,
          },
        ]);

      return { error: insertError };
    },
    {
      showSuccessToast: options?.showSuccessToast ?? true,
      showErrorToast: options?.showErrorToast ?? true,
      successMessage:
        options?.successMessage ?? GENERIC_SUCCESS_MESSAGES.MEMBER_ADDED,
      errorMessage: GENERIC_ERROR_MESSAGES.MEMBER_ADD_FAILED,
    }
  );
}
