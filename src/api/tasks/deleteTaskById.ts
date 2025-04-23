import { createClient } from "../../utils/supabase/component"

export default async function deleteTaskById(id: string) {
    try {
        const supabase = createClient();
        const { error } = await supabase
            .from('task')
            .delete()
            .eq('id', id)
        
        if (error) {
            console.error(error)
        }
    }

    catch (error: unknown) {
        console.error(error)
    }
}