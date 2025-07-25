import { TaskInput } from "../../models/board/Task";
import { supabase } from "../../utils/supabase/component";
import { apiWrapper } from "../apiWrapper";
import {
  COLUMN_STATUS,
  GENERIC_ERROR_MESSAGES,
  GENERIC_SUCCESS_MESSAGES,
  TASK_STATUS,
} from "../../constants";
import { createTaskSchema } from "../../schemas";
import { sanitizeInput } from "../../utils/inputSanitization";
import { showToast } from "../../components/notifications/CustomToast";

export async function createNewTask(newTaskData: TaskInput): Promise<boolean> {
  // Sanitize and validate input
  const sanitizationResult = sanitizeInput(createTaskSchema, newTaskData);

  if (!sanitizationResult.success) {
    showToast(sanitizationResult.error, "error");
    return false;
  }

  const sanitizedTaskData = sanitizationResult.data;

  const result = await apiWrapper(
    async () => {
      const userId = (await supabase.auth.getSession()).data.session?.user.id;

      if (!userId) {
        throw new Error("Please sign in to create tasks.");
      }

      const { error } = await supabase
        .from("task")
        .insert([
          {
            description: sanitizedTaskData.description,
            due_date: sanitizedTaskData.dueDate,
            priority: sanitizedTaskData.priority,
            type: sanitizedTaskData.type,
            status: TASK_STATUS.IN_PROGRESS,
            column_id: COLUMN_STATUS.TODO,
            user_id: userId,
            project_id: sanitizedTaskData.projectId,
          },
        ])
        .select();

      return { data: true, error };
    },
    {
      showSuccessToast: true,
      successMessage: GENERIC_SUCCESS_MESSAGES.TASK_CREATED,
      errorMessage: GENERIC_ERROR_MESSAGES.TASK_CREATE_FAILED,
      showErrorToast: true,
    }
  );

  return result.success;
}
