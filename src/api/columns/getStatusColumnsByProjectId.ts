import { StatusColumnProps } from "../../models";
import { createClient } from "../../utils/supabase/component";

export async function getColumnsByProjectId(
  projectId: string
): Promise<StatusColumnProps[]> {
  try {
    const supabase = createClient();
    const userId = (await supabase.auth.getSession()).data.session?.user.id;

    if (!userId) {
      console.error("Empty user id");
      return [];
    }

    const { data: statusColumns, error } = await supabase
      .from("statusColumn")
      .select(
        `
                  *,
                  task (
                      id,
                      description,
                      dueDate:due_date,
                      dueTime:due_time,
                      priority,
                      status,
                      createdAt:created_at,
                      updatedAt:updated_at,
                      columnId:column_id,
                      userAccount:users (
                          id,
                          email,
                          firstName:first_name,
                          lastName:last_name
                      )
                  )
              `
      )
      .eq("task.project_id", projectId)
      .eq("task.user_id", userId);

    if (error) {
      console.error(error.message);
      return [];
    }

    return statusColumns as unknown as StatusColumnProps[];
  } catch (error) {
    console.error(error);
    return [];
  }
}
