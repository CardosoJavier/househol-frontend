import { COLUMN_STATUS } from "../../constants";
import { StatusColumnProps } from "../../models";
import { apiWrapper } from "../apiWrapper";
import { GENERIC_ERROR_MESSAGES } from "../../constants";
import { supabase } from "../../utils/supabase/component";
import { projectUuidSchema } from "../../schemas/projects";
import { sanitizeInput } from "../../utils/inputSanitization";

export async function getColumnsByProjectId(
  projectId: string
): Promise<StatusColumnProps[]> {
  // Sanitize and validate project ID
  const sanitizationResult = sanitizeInput(projectUuidSchema, projectId);

  if (!sanitizationResult.success) {
    throw new Error(sanitizationResult.error);
  }

  const sanitizedProjectId = sanitizationResult.data;

  const result = await apiWrapper(
    async () => {
      const userId = (await supabase.auth.getSession()).data.session?.user.id;

      if (!userId) {
        throw new Error("No user session");
      }

      const { data: statusColumns, error } = await supabase
        .from("status_columns")
        .select(
          `
                    *,
                    task (
                        id,
                        description,
                        dueDate:due_date,
                        dueTime:due_time,
                        priority,
                        status,
                        createdAt:created_at,
                        updatedAt:updated_at,
                        columnId:column_id,
                        userAccount:users (
                            id,
                            email,
                            firstName:first_name,
                            lastName:last_name
                        )
                    )
                `
        )
        .in("id", [
          COLUMN_STATUS.TODO,
          COLUMN_STATUS.IN_PROGRESS,
          COLUMN_STATUS.BLOCKED,
          COLUMN_STATUS.COMPLETED,
        ])
        .eq("task.project_id", sanitizedProjectId);

      return { data: statusColumns, error };
    },
    {
      showErrorToast: false, // Background data fetching, don't spam user
      errorMessage: GENERIC_ERROR_MESSAGES.COLUMN_LOAD_FAILED,
    }
  );

  return result.success ? (result.data as StatusColumnProps[]) : [];
}
