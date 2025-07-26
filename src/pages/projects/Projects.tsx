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
            {/* Only show edit button if current user is the project owner */}
            {personalInfo?.id === projectData.createdBy && (
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
            )}

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

            {/* Only show delete button if current user is the project owner */}
            {personalInfo?.id === projectData.createdBy && (
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
            )}
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
      <div className="relative w-full max-w-sm">
        <NavLink
          to={`/board?projectId=${projectData.id}`}
          className="group block"
        >
          <div className="bg-white rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-all duration-200 hover:border-gray-300 overflow-hidden">
            {/* Header */}
            <div className="p-4 border-b border-gray-200 bg-gray-50">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold text-lg text-gray-900 truncate pr-2">
                  {projectData.name}
                </h3>
                <ProjectActions />
              </div>
            </div>

            {/* Content */}
            <div className="p-4">
              <div className="space-y-3">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-500">Role</span>
                  <span
                    className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                      personalInfo?.id === projectData.createdBy
                        ? "bg-purple-100 text-purple-800"
                        : "bg-blue-100 text-blue-800"
                    }`}
                  >
                    {personalInfo?.id === projectData.createdBy
                      ? "Owner"
                      : "Member"}
                  </span>
                </div>

                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-500">Last updated</span>
                  <span className="text-gray-900 font-medium">
                    {formatMonthDay(projectData.updatedAt)}
                  </span>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="px-4 py-3 bg-gray-50 border-t border-gray-100">
              <div className="flex items-center justify-between">
                <span className="text-xs text-gray-500">
                  Click to open board
                </span>
                <svg
                  className="w-4 h-4 text-gray-400 group-hover:text-gray-600 transition-colors"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </div>
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
                Are you sure you want to{" "}
                <strong className="text-red-500">delete</strong>{" "}
                <strong>"{projectData.name}"</strong>? This action cannot be
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
      <div className="space-y-6">
        <div className="flex flex-col justify-between items-center gap-3 sm:flex-row">
          <h1 className="text-2xl font-semibold text-gray-900 w-full max-w-sm sm:w-auto sm:max-w-none">
            Welcome back, {personalInfo?.firstName}
          </h1>
          <div className="w-full max-w-sm sm:w-fit sm:max-w-none">
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
        <div className="space-y-4">
          <h2 className="text-lg font-semibold text-gray-900">Your Projects</h2>
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
      </div>
    </PageLayout>
  );
}
