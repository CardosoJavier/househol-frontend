import { TaskInput } from "../../models/board/Task";
import { dbOperationWrapper } from "../apiWrapper";
import {
  GENERIC_ERROR_MESSAGES,
  GENERIC_SUCCESS_MESSAGES,
} from "../../constants";
import { supabase } from "../../utils/supabase/component";
import { updateTaskSchema } from "../../schemas";
import { sanitizeInput } from "../../utils/inputSanitization";
import { showToast } from "../../components/notifications/CustomToast";

export async function updateTaskById(
  taskInput: TaskInput,
  options?: {
    successMessage?: string;
    showSuccessToast?: boolean;
    showErrorToast?: boolean;
  }
): Promise<boolean> {
  // Sanitize and validate input
  const sanitizationResult = sanitizeInput(updateTaskSchema, taskInput);

  if (!sanitizationResult.success) {
    // Show validation error toast and return early - no HTTP request
    showToast(sanitizationResult.error, "error");
    return false;
  }

  const sanitizedTaskData = sanitizationResult.data;

  return await dbOperationWrapper(
    async () => {
      const { error } = await supabase
        .from("task")
        .update({
          column_id: sanitizedTaskData.columnId,
          description: sanitizedTaskData.description,
          priority: sanitizedTaskData.priority,
          type: sanitizedTaskData.type,
          due_date: sanitizedTaskData.dueDate,
          status: sanitizedTaskData.status,
        })
        .eq("id", sanitizedTaskData.id);

      return { error };
    },
    {
      showSuccessToast: options?.showSuccessToast ?? true,
      showErrorToast: options?.showErrorToast ?? true,
      successMessage:
        options?.successMessage ?? GENERIC_SUCCESS_MESSAGES.TASK_UPDATED,
      errorMessage: GENERIC_ERROR_MESSAGES.TASK_UPDATE_FAILED,
    }
  );
}
