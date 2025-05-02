import { PersonalInfo } from "../../models";
import { createClient } from "../../utils";
import { decryptData, encryptData } from "../../utils/encrypt/encryption";

export async function getPersonalInfo() : Promise<PersonalInfo | null> {

    try {
        // Check for encrypyed data
        const cachedPersonalInfo: string | null = sessionStorage.getItem("personalInfo");
        if (cachedPersonalInfo) {
            return decryptData(cachedPersonalInfo) as PersonalInfo;
        }

        // fetch user data if cache is null
        const supabase = createClient();
        const userId = (await supabase.auth.getSession()).data.session?.user.id

        let { data, error } = await supabase
        .from('users')
        .select('firstName:first_name, lastName:last_name, email')
        .eq("id", userId);

        if (error) {
            console.error(error);
            return null;
        }
        
        sessionStorage.setItem("personalInfo", await encryptData(data));
        return data as unknown as PersonalInfo;
    }

    catch (error) {
        console.error(error);;
        return null
    }
}