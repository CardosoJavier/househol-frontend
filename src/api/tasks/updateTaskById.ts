import { TaskInput } from "../../models/board/Task";
import { dbOperationWrapper } from "../apiWrapper";
import {
  GENERIC_ERROR_MESSAGES,
  GENERIC_SUCCESS_MESSAGES,
} from "../../constants";
import { supabase } from "../../utils/supabase/component";
import { updateTaskSchema } from "../../schemas";
import { sanitizeInput } from "../../utils/inputSanitization";

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
    throw new Error(sanitizationResult.error);
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
          due_date: sanitizedTaskData.dueDate,
          due_time: sanitizedTaskData.dueTime,
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
