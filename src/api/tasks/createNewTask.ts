import { TaskInput } from "../../models/board/Task";
import { supabase } from "../../utils/supabase/component";

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

    if (error) return false;
    return true;
  } catch (error: unknown) {
    console.error(error);
    return false;
  }
}
