import { PersonalInfo } from "../../models";
import { supabase } from "../../utils";
import { decryptData, encryptData } from "../../utils/encrypt/encryption";

export async function getPersonalInfo(): Promise<PersonalInfo | null> {
  try {
    // Check for encrypyed data
    const cachedPersonalInfo: string | null =
      sessionStorage.getItem("personalInfo");
    if (cachedPersonalInfo) {
      return decryptData(cachedPersonalInfo) as PersonalInfo;
    }

    // fetch user data if cache is null
    const userId = (await supabase.auth.getSession()).data.session?.user.id;

    let { data, error } = await supabase
      .from("users")
      .select(
        "id, firstName:first_name, lastName:last_name, email, profilePictureUrl:profile_picture"
      )
      .eq("id", userId);

    console.log(data);

    if (error) {
      console.error(error);
      return null;
    }

    sessionStorage.setItem("personalInfo", await encryptData(data));
    if (data) {
      return data[0] as unknown as PersonalInfo;
    } else {
      throw new Error("Error getting user information");
    }
  } catch (error) {
    console.error(error);
    return null;
  }
}
