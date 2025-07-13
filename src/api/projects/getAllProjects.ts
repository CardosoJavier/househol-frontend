import { ProjectResponse, RawProjectResponse } from "../../models";
import { supabase } from "../../utils/supabase/component";

export async function getAllProjects(): Promise<ProjectResponse[] | null> {
  try {
    const userId = (await supabase.auth.getSession()).data.session?.user.id;

    if (!userId) {
      console.error("Empty user id");
      return [];
    }

    const { data: projectsData, error } = await supabase
      .from("users_projects")
      .select(`projects (id, name, updatedAt:updated_at)`)
      .eq("user_id", userId);

    if (error) {
      console.error(error.message);
      return [];
    }

    const projects: ProjectResponse[] = (projectsData as any).map(
      (project: RawProjectResponse) => ({
        id: project.projects.id,
        name: project.projects.name,
        updatedAt: new Date(project.projects.updatedAt),
      })
    );

    return projects;
  } catch (error) {
    console.error(error);
    return null;
  }
}
