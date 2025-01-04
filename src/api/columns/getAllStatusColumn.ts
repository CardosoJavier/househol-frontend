import { StatusColumnProps } from "../../components/board/StatusColumn.types";

export async function getAllStatusColumns(): Promise<StatusColumnProps[]> {

    try {

        const request = await fetch("http://localhost:8080/api/v1/columns/", {
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