import { PersonalInfo } from "../../models";
import { supabase } from "../../utils";

export async function getPersonalInfo(): Promise<PersonalInfo | null> {
  try {
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

    return (data && data.length > 0 ? data[0] : null) as PersonalInfo | null;
  } catch (error) {
    console.error(error);
    return null;
  }
}
