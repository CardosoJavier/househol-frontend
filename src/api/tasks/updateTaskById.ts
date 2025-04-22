import { TaskInput } from "../../models/board/Task";
import { createClient } from "../../utils/supabase/component";


export async function updateTaskById(taskId: string, taskInput: TaskInput) {

    try {
        const supabase = createClient();
        const { error } = await supabase
            .from("task")
            .update({ column_id: taskInput.columnId, status: taskInput.status })
            .eq("id", taskId);

        if (error) {
            console.error(error)
        }
    }

    catch (error) {
        console.error(error)
    }
}