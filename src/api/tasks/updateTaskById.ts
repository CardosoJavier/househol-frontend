import { TaskInput } from "../../models/board/Task";
import { SERVER_URL } from "../../config";


export async function updateTaskById(taskId: string, taskInput: TaskInput) {

    const response = await fetch(`${SERVER_URL}/tasks/edit/${taskId}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(taskInput) 
    })

    if (!response.ok) {
        throw new Error("error updating task");
    }

    return await response.json();
}