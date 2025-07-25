import { apiWrapper } from "../apiWrapper";
import { GENERIC_ERROR_MESSAGES } from "../../constants";
import { supabase } from "../../utils/supabase/component";

export interface ProjectMember {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
}

interface RawProjectMemberResponse {
  users: {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
  };
}

export async function getProjectMembers(
  projectId: string
): Promise<ProjectMember[] | null> {
  const result = await apiWrapper(
    async () => {
      const { data: membersData, error } = await supabase
        .from("users_projects")
        .select(
          `
          users (
            id,
            email,
            firstName:first_name,
            lastName:last_name
          )
        `
        )
        .eq("project_id", projectId);

      return { data: membersData, error };
    },
    {
      showErrorToast: false,
      errorMessage: GENERIC_ERROR_MESSAGES.PROJECT_LOAD_FAILED,
    }
  );

  if (!result.success || !result.data) {
    return null;
  }

  const members: ProjectMember[] = (
    result.data as unknown as RawProjectMemberResponse[]
  ).map((member: RawProjectMemberResponse) => ({
    id: member.users.id,
    email: member.users.email,
    firstName: member.users.firstName,
    lastName: member.users.lastName,
  }));

  return members;
}
