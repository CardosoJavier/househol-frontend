import { supabase } from "../../utils/supabase/component";
import {
  GENERIC_ERROR_MESSAGES as errorMsgs,
  GENERIC_SUCCESS_MESSAGES as successMsgs,
  handleError,
} from "../../constants";
import { showToast } from "../../components/notifications/CustomToast";

export async function deleteTaskById(id: string): Promise<Boolean> {
  try {
    const userId = (await supabase.auth.getSession()).data.session?.user.id;

    const { error } = await supabase
      .from("task")
      .delete()
      .eq("id", id)
      .eq("user_id", userId);

    if (error) {
      showToast(errorMsgs.TASK_DELETE_FAILED, "error");
      return false;
    }
    showToast(successMsgs.TASK_DELETED, "success");
    return true;
  } catch (error: unknown) {
    showToast(errorMsgs.UNEXPECTED_ERROR, "error");
    handleError(error, errorMsgs.UNEXPECTED_ERROR);
    return false;
  }
}
