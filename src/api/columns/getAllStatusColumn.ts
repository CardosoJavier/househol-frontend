import { StatusColumnProps } from "../../models/board/StatusColumn";
import { createClient } from "../../utils/supabase/component";

export async function getAllStatusColumns(): Promise<StatusColumnProps[]> {
    try {

        const supabase = createClient();
        
        let { data: statusColumn, error } = await supabase
        .from('statusColumn')
        .select('*')

        if (error) {
            console.log(error.message)
            return [];
        }
        
        console.log(statusColumn)
        return statusColumn as StatusColumnProps[]
        
    } catch (error) {
        console.error(error)
        return [];
    }
    
}