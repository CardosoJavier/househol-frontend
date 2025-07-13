import { supabase } from "../../utils";

export async function getProfilePicture(userId: string): Promise<boolean> {
  try {
    const { data } = supabase.storage
      .from("profile-photos")
      .getPublicUrl(userId + ".png");
    if (!data?.publicUrl) {
      return false;
    }
    return true;
  } catch (error) {
    console.error(error);
    return false;
  }
}
