import { useState } from "react";
import {
  CustomButton,
  Dialog,
  PageLayout,
  ProjectForm,
  AddMemberForm,
} from "../../components";
import { ProjectResponse } from "../../models";
import { formatMonthDay } from "../../utils";
import { NavLink } from "react-router";
import { GridLoader } from "react-spinners";
import { useProjectContext } from "../../context/ProjectContext";
import { useAuth } from "../../context";
import { deleteProjectById } from "../../api";
import { showToast } from "../../components/notifications/CustomToast";
import { GENERIC_ERROR_MESSAGES, handleError } from "../../constants";
import { MdEdit, MdDelete, MdPersonAdd } from "react-icons/md";
import { BsThreeDots } from "react-icons/bs";

export default function Projects() {
  const [isNewProjectExpanded, setIsNewProjectExpanded] =
    useState<boolean>(false);

  // Use context for projects and fetching state
  const { projects, isFetching, refreshProjects } = useProjectContext();
  const { personalInfo } = useAuth();

  function ProjectCard({ projectData }: { projectData: ProjectResponse }) {
    const [isEditProjectExpanded, setIsEditProjectExpanded] =
      useState<boolean>(false);
    const [isDeleteProjectExpanded, setIsDeleteProjectExpanded] =
      useState<boolean>(false);
    const [isAddMemberExpanded, setIsAddMemberExpanded] =
      useState<boolean>(false);
    const [isLoading, setIsLoading] = useState<boolean>(false);

    function ProjectActions() {
      const [areProjectActionsExpanded, setAreProjectActionsExpanded] =
        useState<boolean>(false);

      return (
        <div className="relative">
          <button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              setAreProjectActionsExpanded(!areProjectActionsExpanded);
            }}
            className="flex flex-col items-center justify-center border border-gray-300 rounded-md p-1 hover:bg-gray-100 bg-white shadow-sm"
          >
            <BsThreeDots size={15} />
          </button>

          <div
            className={
              areProjectActionsExpanded
                ? "flex flex-col gap-1 absolute bg-white border border-gray-300 rounded-md p-2 z-10 right-0 shadow-lg min-w-[80px]"
                : "hidden"
            }
          >
            <button
              className="flex gap-2 p-2 hover:bg-gray-100 rounded whitespace-nowrap"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                setIsEditProjectExpanded(!isEditProjectExpanded);
                setAreProjectActionsExpanded(false);
              }}
            >
              <MdEdit color="#1d4ed8" size={16} />
              <span className="text-xs text-blue-700">Edit</span>
            </button>

            <button
              className="flex gap-2 p-2 hover:bg-gray-100 rounded whitespace-nowrap"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                setIsAddMemberExpanded(!isAddMemberExpanded);
                setAreProjectActionsExpanded(false);
              }}
            >
              <MdPersonAdd color="#059669" size={16} />
              <span className="text-xs text-emerald-600">Add Member</span>
            </button>

            <button
              className="flex gap-2 p-2 hover:bg-gray-100 rounded whitespace-nowrap"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                setIsDeleteProjectExpanded(!isDeleteProjectExpanded);
                setAreProjectActionsExpanded(false);
              }}
            >
              <MdDelete color="#b91c1c" size={16} />
              <span className="text-xs text-red-700">Delete</span>
            </button>
          </div>
        </div>
      );
    }

    async function handleProjectDelete() {
      try {
        setIsLoading(true);
        await deleteProjectById(projectData.id);
        refreshProjects();
      } catch (error) {
        const errorMessage = handleError(
          error,
          GENERIC_ERROR_MESSAGES.PROJECT_DELETE_FAILED
        );
        showToast(errorMessage, "error");
      } finally {
        setTimeout(() => {
          setIsLoading(false);
          setIsDeleteProjectExpanded(!isDeleteProjectExpanded);
        }, 90);
      }
    }
    return (
      <div className="relative w-full max-w-xs">
        <NavLink
          to={`/board?projectId=${projectData.id}`}
          className={`flex flex-col w-full bg-primary rounded-lg outline outline-2 outline-secondary hover:outline-accent duration-200 hover:shadow-lg hover:bg-gray-50`}
        >
          <div className="flex w-full h-fit bg-accent rounded-t-md justify-between items-center px-4 py-2">
            <span className="text-base text-secondary font-semibold">
              {projectData.name}
            </span>
            <ProjectActions />
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

        {/* Edit Project Dialog */}
        {isEditProjectExpanded && (
          <Dialog>
            <ProjectForm
              type="update"
              projectData={projectData}
              onClickCancel={() =>
                setIsEditProjectExpanded(!isEditProjectExpanded)
              }
            />
          </Dialog>
        )}

        {/* Delete Project Dialog */}
        {isDeleteProjectExpanded && (
          <Dialog>
            <div className="flex flex-col gap-3">
              <h3 className="font-medium text-2xl">Delete Project</h3>
              <p className="text-gray-500 text-sm">
                Are you sure you want to delete "
                <strong>{projectData.name}</strong>"? This action cannot be
                undone.
              </p>
              <div className="grid grid-cols-2 gap-10 mt-5">
                <CustomButton
                  label="Cancel"
                  type="button"
                  onClick={() =>
                    setIsDeleteProjectExpanded(!isDeleteProjectExpanded)
                  }
                />
                <CustomButton
                  label="Delete"
                  type="button"
                  loading={isLoading}
                  onClick={handleProjectDelete}
                />
              </div>
            </div>
          </Dialog>
        )}

        {/* Add Member Dialog */}
        {isAddMemberExpanded && (
          <Dialog>
            <AddMemberForm
              projectId={projectData.id}
              onClickCancel={() => setIsAddMemberExpanded(!isAddMemberExpanded)}
            />
          </Dialog>
        )}
      </div>
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
