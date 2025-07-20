import { TaskInput } from "../../models/board/Task";
import { supabase } from "../../utils/supabase/component";
import { apiWrapper } from "../apiWrapper";
import {
  GENERIC_ERROR_MESSAGES,
  GENERIC_SUCCESS_MESSAGES,
} from "../../constants";

export async function createNewTask(newTaskData: TaskInput): Promise<boolean> {
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
            description: newTaskData.description,
            due_date: newTaskData.dueDate,
            due_time: newTaskData.dueTime,
            priority: newTaskData.priority,
            status: "pending",
            column_id: 1,
            user_id: userId,
            project_id: newTaskData.projectId,
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
