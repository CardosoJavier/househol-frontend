import { useEffect, useState } from "react";
import { getPersonalInfo } from "../../api";
import {
  CustomButton,
  Dialog,
  PageLayout,
  ProjectForm,
} from "../../components";
import { PersonalInfo, ProjectResponse } from "../../models";
import { getAllProjects } from "../../api/projects/getAllProjects";
import { formatMonthDay } from "../../utils";
import { NavLink } from "react-router";
import { GridLoader } from "react-spinners";

export default function Projects() {
  const [personalInfo, setPersonalInfo] = useState<PersonalInfo | null>(null);
  const [isFetching, setIsFetching] = useState<Boolean>(false);
  const [projects, setProjects] = useState<ProjectResponse[] | null>(null);
  const [isNewProjectExpanded, setIsNewProjectExpanded] =
    useState<boolean>(false);

  async function getUserInfo() {
    const personalInfoData: PersonalInfo | null = await getPersonalInfo();
    setPersonalInfo(personalInfoData);
  }

  async function getProjects() {
    try {
      setIsFetching(true);
      const fetchedProjects: ProjectResponse[] | null = await getAllProjects();
      setProjects(fetchedProjects);
    } finally {
      setIsFetching(false);
    }
  }

  useEffect(() => {
    getProjects();
  }, []);

  useEffect(() => {
    getUserInfo();
  }, []);

  function ProjectCard({ projectData }: { projectData: ProjectResponse }) {
    return (
      <NavLink
        to={`/board?projectId=${projectData.id}`}
        className={`flex flex-col w-full max-w-xs bg-primary rounded-lg outline outline-2 outline-secondary hover:outline-accent duration-200 hover:shadow-lg hover:bg-gray-50`}
      >
        <div className="flex w-full h-fit bg-accent rounded-t-md justify-center items-center">
          <span className="text-base text-secondary font-semibold p-2">
            {projectData.name}
          </span>
        </div>
        <div className="flex flex-col gap-2 justify-center items-center w-full h-16 px-5 py-2">
          <span className="text-gray-400 font-semibold">Coming soon...</span>
        </div>
        <div className="flex w-full h-8 bg-gray-100 rounded-b-md border-t-2 border-secondary justify-center items-center">
          <div className="flex justify-between items-center w-full px-5">
            <span className="text-xs">Last modified</span>
            <span className="text-xs">
              {formatMonthDay(projectData.updatedAt)}
            </span>
          </div>
        </div>
      </NavLink>
    );
  }

  return (
    <PageLayout>
      <div className="space-y-8">
        <div className="flex flex-col justify-between items-center gap-2 sm:flex-row">
          <h1 className="text-3xl font-semibold">
            Welcome back, {personalInfo?.firstName}
          </h1>
          <div className="w-72 sm:w-fit">
            <CustomButton
              label={"New Project"}
              onClick={() => setIsNewProjectExpanded(!isNewProjectExpanded)}
            />
            {isNewProjectExpanded && (
              <Dialog>
                <ProjectForm
                  onClickCancel={() =>
                    setIsNewProjectExpanded(!isNewProjectExpanded)
                  }
                />
              </Dialog>
            )}
          </div>
        </div>
        <div className="grid grid-cols-1 gap-4 w-full place-items-center md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {(projects === null || projects.length === 0) && !isFetching && (
            <div className="col-span-full justify-self-center text-xl text-gray-400 min-h-[120px] flex items-center">
              No projects
            </div>
          )}

          {isFetching && (
            <div className="col-span-full flex flex-col items-center gap-2 self-center mt-10 min-h-[120px]">
              <GridLoader size={10} />
              <span className="text-sm font-medium">loading projects</span>
            </div>
          )}

          {projects?.map((project: ProjectResponse) => (
            <ProjectCard key={project.id} projectData={project} />
          ))}
        </div>
      </div>
    </PageLayout>
  );
}
