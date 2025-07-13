import { supabase } from "../../utils/supabase/component";

export async function deleteTaskById(id: string): Promise<Boolean> {
  try {
    const userId = (await supabase.auth.getSession()).data.session?.user.id;

    const { error } = await supabase
      .from("task")
      .delete()
      .eq("id", id)
      .eq("user_id", userId);

    if (error) {
      console.error(error);
      return false;
    }

    return true;
  } catch (error: unknown) {
    console.error(error);
    return false;
  }
}
