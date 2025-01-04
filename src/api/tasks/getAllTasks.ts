import Task from "../../components/board/Task";
import { TaskProps } from "../../components/board/Task.types";

export async function getAllTasks(): Promise<TaskProps[]> {
    try {
        const request = await fetch("http://localhost:8080/api/v1/tasks/", {
            method: "GET"
        });

        if (!request.ok) {
            throw new Error(`Response status: ${request.status}`)
        }

        return await request.json();
        
    } catch (error: any) {
        console.error(error.message)
        return [];
    }
}