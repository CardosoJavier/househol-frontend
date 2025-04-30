import { PostgrestError } from "@supabase/supabase-js";
import { TaskInput } from "../../models/board/Task";
import { createClient } from "../../utils/supabase/component";
``

export async function updateTaskById(taskInput: TaskInput) : Promise<PostgrestError | boolean> {
    try {
        const supabase = createClient();
        const { error } = await supabase
            .from("task")
            .update({ 
                column_id: taskInput.columnId, 
                description: taskInput.description, 
                priority: taskInput.priority,
                due_date: taskInput.dueDate,
                due_time: taskInput.dueTime
            })
            .eq("id", taskInput.id);

        if (error) {
            console.error(error)
            return error;
        }

        return true;
    }

    catch (error) {
        console.error(error)
        return false;
    }
}