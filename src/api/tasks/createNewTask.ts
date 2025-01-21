import { SERVER_URL } from "../../config";
import { TaskInput, TaskProps } from "../../components/board/Task.types";

export default async function createNewTask(newTaskData: TaskInput) : Promise<TaskProps | null> {

    try {
        const request = await fetch(`${SERVER_URL}/tasks/creat"`, {
            method: "POST",
            headers: {
                "Content-Type" : "application/json"
            },
            body: JSON.stringify(newTaskData)
        });

        if (!request.ok) {
            throw new Error("Error creating new task");
        }

        return await request.json();
    }

    catch (error: any) {
        return null;
    }
}