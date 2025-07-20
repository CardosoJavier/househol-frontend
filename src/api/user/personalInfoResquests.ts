import { PersonalInfo } from "../../models";
import { supabase } from "../../utils";
import { apiWrapper } from "../apiWrapper";
import { GENERIC_ERROR_MESSAGES } from "../../constants";

export async function getPersonalInfo(): Promise<PersonalInfo | null> {
  const result = await apiWrapper(
    async () => {
      const userId = (await supabase.auth.getSession()).data.session?.user.id;

      if (!userId) {
        throw new Error("No user session found");
      }

      const { data, error } = await supabase
        .from("users")
        .select(
          "id, firstName:first_name, lastName:last_name, email, profilePictureUrl:profile_picture"
        )
        .eq("id", userId);

      const personalInfo = (
        data && data.length > 0 ? data[0] : null
      ) as PersonalInfo | null;

      return { data: personalInfo, error };
    },
    {
      showErrorToast: false, // Don't show toast for data fetching errors
      errorMessage: GENERIC_ERROR_MESSAGES.PROFILE_LOAD_FAILED,
      logErrors: true,
    }
  );

  return result.success ? result.data || null : null;
}
