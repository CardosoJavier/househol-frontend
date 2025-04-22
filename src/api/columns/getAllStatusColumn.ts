import { StatusColumnProps } from "../../models/board/StatusColumn";
import { createClient } from "../../utils/supabase/component";

export async function getAllStatusColumns(): Promise<StatusColumnProps[]> {
    try {

        const supabase = createClient();
        
        const { data: statusColumns, error } = await supabase
            .from("statusColumn")
            .select(`
                *,
                task (
                id,
                description,
                dueDate:due_date,
                dueTime:due_time,
                priority,
                status,
                createdAt:created_at,
                updatedAt:updated_at,
                columnId:column_id,
                userAccount:users (
                    id,
                    email,
                    firstName:first_name,
                    lastName:last_name
                )
                )
            `);




        if (error) {
            console.error(error.message)
            return [];
        }
        
        return statusColumns as unknown as StatusColumnProps[]
        
    } catch (error) {
        console.error(error)
        return [];
    }
    
}