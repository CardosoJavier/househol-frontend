import { showToast } from "../../components/notifications/CustomToast";
import { TaskInput } from "../../models/board/Task";
import { supabase } from "../../utils/supabase/component";
import {
  GENERIC_ERROR_MESSAGES as errorMsgs,
  GENERIC_SUCCESS_MESSAGES as successMsgs,
} from "../../constants";

export async function createNewTask(newTaskData: TaskInput): Promise<boolean> {
  try {
    const userId = (await supabase.auth.getSession()).data.session?.user.id;

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

    if (error) {
      showToast(errorMsgs.TASK_CREATE_FAILED, "error");
      return false;
    }
    showToast(successMsgs.TASK_CREATED, "success");
    return true;
  } catch (error: unknown) {
    console.error(error);
    return false;
  }
}
