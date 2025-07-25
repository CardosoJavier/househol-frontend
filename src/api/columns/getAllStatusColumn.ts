import { StatusColumnProps } from "../../models/board/StatusColumn";
import { apiWrapper } from "../apiWrapper";
import { GENERIC_ERROR_MESSAGES } from "../../constants";
import { supabase } from "../../utils/supabase/component";

export async function getAllStatusColumns(): Promise<StatusColumnProps[]> {
  const result = await apiWrapper(
    async () => {
      const userId = (await supabase.auth.getSession()).data.session?.user.id;

      if (!userId) {
        throw new Error("No user session");
      }

      const { data: statusColumns, error } = await supabase
        .from("status_columns")
        .select(
          `
                  *,
                  task (
                      id,
                      description,
                      dueDate:due_date,
                      priority,
                      type,
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
        .eq("task.user_id", userId);

      return { data: statusColumns, error };
    },
    {
      showErrorToast: false, // Background data fetching, don't spam user
      errorMessage: GENERIC_ERROR_MESSAGES.COLUMN_LOAD_FAILED,
    }
  );

  return result.success ? (result.data as StatusColumnProps[]) : [];
}
