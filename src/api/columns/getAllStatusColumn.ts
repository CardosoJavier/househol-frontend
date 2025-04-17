import { StatusColumnProps } from "../../models/board/StatusColumn";
import { SERVER_URL } from "../../config";

export async function getAllStatusColumns(): Promise<StatusColumnProps[]> {
    try {
        const request = await fetch(`${SERVER_URL}/columns/`, {
            method: "GET"
        })

        if (!request.ok) {
            throw new Error("error getting status columns");
        }

        return await request.json();
        
    } catch (error) {
        console.error(error)
        return [];
    }
    
}