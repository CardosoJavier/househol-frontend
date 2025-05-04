import { createClient } from "../../utils";

export async function getProfilePicture(userId: string) {
    try {
        const supabase = createClient();
        const {data} = await supabase.storage.from('profile-photos').getPublicUrl(userId+".png");
        console.log(data)
    }
    
    catch (error: unknown) {
        if (error instanceof Error) {
            throw new Error(error.message)
        }

        else {
            console.error(error)
        }
    }
}