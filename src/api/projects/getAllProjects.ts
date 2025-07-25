import { ProjectResponse, RawProjectResponse } from "../../models";
import { apiWrapper } from "../apiWrapper";
import { GENERIC_ERROR_MESSAGES } from "../../constants";
import { supabase } from "../../utils/supabase/component";

export async function getAllProjects(): Promise<ProjectResponse[] | null> {
  const result = await apiWrapper(
    async () => {
      const userId = (await supabase.auth.getSession()).data.session?.user.id;

      if (!userId) {
        throw new Error("No user session");
      }

      const { data: projectsData, error } = await supabase
        .from("users_projects")
        .select(
          `projects (id, name, updatedAt:updated_at, createdBy:created_by)`
        )
        .eq("user_id", userId);

      return { data: projectsData, error };
    },
    {
      showErrorToast: false,
      errorMessage: GENERIC_ERROR_MESSAGES.PROJECT_LOAD_FAILED,
    }
  );

  if (!result.success || !result.data) {
    return null;
  }

  const projects: ProjectResponse[] = (result.data as any).map(
    (project: RawProjectResponse) => ({
      id: project.projects.id,
      name: project.projects.name,
      updatedAt: new Date(project.projects.updatedAt),
      createdBy: project.projects.createdBy,
    })
  );

  return projects;
}
