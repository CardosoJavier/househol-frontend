import { TaskInput } from "../../models/board/Task";
import { supabase } from "../../utils/supabase/component";
``;

export async function updateTaskById(taskInput: TaskInput): Promise<boolean> {
  try {
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

    if (error) {
      console.error(error);
      return false;
    }

    return true;
  } catch (error) {
    console.error(error);
    return false;
  }
}
