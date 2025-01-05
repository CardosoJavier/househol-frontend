import { TaskProps } from "../../components/board/Task.types";
import { SERVER_URL } from "../../config";

export async function getAllTasks(): Promise<TaskProps[]> {
    try {
        const request = await fetch(`${SERVER_URL}/tasks/`, {
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