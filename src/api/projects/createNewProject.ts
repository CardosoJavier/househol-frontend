import { createClient } from "../../utils/supabase/component";

export async function createNewProject(projectName: string): Promise<Boolean> {
  try {
    const supabase = createClient();
    const userId = (await supabase.auth.getSession()).data.session?.user.id;

    if (!userId) return false;

    const { error } = await supabase.from("projects").insert([
      {
        name: projectName,
      },
    ]);

    if (error) return false;
    return true;
  } catch (error: unknown) {
    console.error(error);
    return false;
  }
}
