import { TaskInput } from "../../models/board/Task";
import { dbOperationWrapper } from "../apiWrapper";
import {
  GENERIC_ERROR_MESSAGES,
  GENERIC_SUCCESS_MESSAGES,
} from "../../constants";
import { supabase } from "../../utils/supabase/component";

export async function updateTaskById(
  taskInput: TaskInput,
  options?: {
    successMessage?: string;
    showSuccessToast?: boolean;
    showErrorToast?: boolean;
  }
): Promise<boolean> {
  return await dbOperationWrapper(
    async () => {
      const { error } = await supabase
        .from("task")
        .update({
          column_id: taskInput.columnId,
          description: taskInput.description,
          priority: taskInput.priority,
          due_date: taskInput.dueDate,
          due_time: taskInput.dueTime,
        })
        .eq("id", taskInput.id);

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
