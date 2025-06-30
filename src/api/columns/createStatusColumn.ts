import { createClient } from "../../utils/supabase/component";

export async function createStatusColumn({
  title,
  status,
  projectId,
}: {
  title: string;
  status: string;
  projectId: string;
}): Promise<boolean> {
  try {
    const supabase = createClient();
    const { error } = await supabase.from("statusColumn").insert([
      {
        title,
        status,
        project_id: projectId,
      },
    ]);
    if (error) {
      console.error(error);
      return false;
    }
    return true;
  } catch (error) {
    console.error(error);
    return false;
  }
}
