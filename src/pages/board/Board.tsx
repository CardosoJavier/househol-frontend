import {
  DndContext,
  DragEndEvent,
  MouseSensor,
  TouchSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import { useEffect, useState } from "react";
import { useDebounce } from "use-debounce";
import { StatusColumnProps, TaskProps } from "../../models";
import {
  verifyTaskProps,
  getCurrentWeek,
  capitalizeFirstLetter,
  parseLocalDate,
} from "../../utils";
import {
  PageLayout,
  Dialog,
  TaskForm,
  CustomButton,
  GroupContainer,
  StatusColumn,
  CustomInput,
  showToast,
  ProjectMembers,
} from "../../components";
import { updateTaskById, checkUserProjectMembership } from "../../api";
import Skeleton, { SkeletonTheme } from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import { useColumns } from "../../context";
import { useProjectContext } from "../../context/ProjectContext";
import { useSearchParams, useNavigate } from "react-router";
import {
  GENERIC_ERROR_MESSAGES,
  GENERIC_SUCCESS_MESSAGES,
  handleError,
  TASK_PRIORITY_SORT_ORDER,
  TASK_TYPE_SORT_ORDER,
} from "../../constants";
import { MdGroup } from "react-icons/md";

export default function Board() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const projectId = searchParams.get("projectId") || "";

  const [columnsData, setColumnsData] = useState<StatusColumnProps[]>([]);
  const [isNewTaskExpanded, setIsNewTaskExpanded] = useState<boolean>(false);
  const [isMembersModalOpen, setIsMembersModalOpen] = useState<boolean>(false);
  const [isCheckingMembership, setIsCheckingMembership] = useState<boolean>(true);

  const [searchInput, setSearchInput] = useState<string>("");
  const [debouncedSearchInput] = useDebounce(searchInput, 600);

  const [sortInput, setSortInput] = useState<string>("");

  const {
    columns,
    isFetching,
    fetchColumns,
    setProjectId,
    invalidateCache,
    error,
  } = useColumns();

  const { projects } = useProjectContext();

  // Get current project data
  const currentProject = projects?.find((project) => project.id === projectId);

  useEffect(() => {
    if (projectId) {
      setProjectId(projectId);
    }
  }, [projectId, setProjectId]);

  // Check project membership
  useEffect(() => {
    const checkMembership = async () => {
      if (!projectId) {
        setIsCheckingMembership(false);
        return;
      }

      try {
        const isMember = await checkUserProjectMembership(projectId);
         if (!isMember) {
           showToast("You don't have access to this project", "error");
           navigate("/");
           return;
         }
       } catch (error) {
         const errorMessage = handleError(
           error,
           "Failed to verify project membership"
         );
         showToast(errorMessage, "error");
         navigate("/");
        return;
      }

      setIsCheckingMembership(false);
    };

    checkMembership();
  }, [projectId, navigate]);

  useEffect(() => {
    setColumnsData(columns);
  }, [columns]);

  useEffect(() => {
    searchTask();
  }, [debouncedSearchInput]);

  useEffect(() => {
    sortTasks();
  }, [sortInput]);

  const mouseSensor = useSensor(MouseSensor, {
    activationConstraint: {
      delay: 200,
      tolerance: 5,
    },
  });
  const touchSensor = useSensor(TouchSensor, {
    activationConstraint: {
      delay: 200,
      tolerance: 5,
    },
  });
  const sensors = useSensors(mouseSensor, touchSensor);

  async function handleDragEnd(event: DragEndEvent) {
    const droppedTask: TaskProps | undefined = verifyTaskProps(
      event.active.data.current
    );
    const droppedColumn = event.over;

    if (
      droppedTask !== undefined &&
      droppedColumn?.data.current &&
      droppedColumn?.id
    ) {
      if (droppedColumn.id !== droppedTask.columnId) {
        try {
          const isTaskUpdated = await updateTaskById(
            {
              id: droppedTask.id as string,
              columnId: droppedColumn.id as number,
              status: droppedColumn.data.current.status as string,
              projectId: projectId as string,
            },
            {
              successMessage: GENERIC_SUCCESS_MESSAGES.TASK_MOVED,
            }
          );

          if (!isTaskUpdated || typeof isTaskUpdated === "object") {
            return;
          }

          // Invalidate cache and refetch columns after column update
          invalidateCache();
          await fetchColumns(true);
        } catch (error) {
          const errorMessage = handleError(
            error,
            GENERIC_ERROR_MESSAGES.TASK_UPDATE_FAILED
          );
          showToast(errorMessage, "error");
        }
      }
    }
  }

  function searchTask() {
    if (searchInput.trim() && searchInput.length >= 3) {
      let filteredColumns: StatusColumnProps[] = columns.map(
        (column: StatusColumnProps) => {
          let filteredTasks: TaskProps[] = column.task.filter(
            (task: TaskProps) =>
              task.description
                .toLocaleLowerCase()
                .includes(searchInput.toLocaleLowerCase())
          );
          return {
            ...column,
            task: filteredTasks,
          };
        }
      );
      setColumnsData(filteredColumns);
    } else {
      setColumnsData(columns);
    }
  }

  function sortTasks() {
    const sortedColumns = columns.map((column: StatusColumnProps) => {
      let sortedTasks = [...column.task];

      if (sortInput === "priority") {
        sortedTasks = sortedTasks.sort((a: TaskProps, b: TaskProps) => {
          return (
            (TASK_PRIORITY_SORT_ORDER[a.priority] || 4) -
            (TASK_PRIORITY_SORT_ORDER[b.priority] || 4)
          );
        });
      }

      if (sortInput === "dueDate") {
        sortedTasks = sortedTasks.sort((a: TaskProps, b: TaskProps) => {
          const dueDateA = parseLocalDate(a.dueDate).getTime();
          const dueDateB = parseLocalDate(b.dueDate).getTime();
          return dueDateA - dueDateB;
        });
      }

      if (sortInput === "type") {
        sortedTasks = sortedTasks.sort((a: TaskProps, b: TaskProps) => {
          return (
            (TASK_TYPE_SORT_ORDER[a.type || "other"] || 10) -
            (TASK_TYPE_SORT_ORDER[b.type || "other"] || 10)
          );
        });
      }

      return {
        ...column,
        task: sortedTasks,
      };
    });

    setColumnsData(sortedColumns);
  }

  // Show loading state while checking membership
  if (isCheckingMembership) {
    return (
      <PageLayout>
        <div className="flex flex-col items-center justify-center h-64 gap-4">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <p className="text-gray-600">Verifying project access...</p>
        </div>
      </PageLayout>
    );
  }

  return (
    <PageLayout>
      <DndContext sensors={sensors} onDragEnd={handleDragEnd}>
        <div className="flex flex-col gap-4 lg:w-full">
          <div className="flex flex-col gap-4">
            {/* Title */}
            <div className="flex justify-between items-center">
              {isFetching ? (
                <SkeletonTheme baseColor="#f3f4f6" highlightColor="#e5e7eb">
                  <div>
                    <Skeleton height={16} width={80} className="mb-1" />
                    <Skeleton height={24} width={120} />
                  </div>
                </SkeletonTheme>
              ) : (
                <div>
                  <p className="text-sm text-gray-600 font-medium">Current week</p>
                  <h1 className="text-xl font-semibold text-gray-900">{getCurrentWeek()}</h1>
                </div>
              )}

              {/* Group Members Icon */}
              {projectId && (
                isFetching ? (
                  <SkeletonTheme baseColor="#f3f4f6" highlightColor="#e5e7eb">
                    <Skeleton height={36} width={80} />
                  </SkeletonTheme>
                ) : (
                  <button
                    onClick={() => setIsMembersModalOpen(true)}
                    className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-200 rounded-md hover:bg-gray-50 transition-colors"
                    title="View Project Members"
                  >
                    <MdGroup size={16} className="text-gray-600" />
                    <span className="hidden sm:inline">
                      Members
                    </span>
                  </button>
                )
              )}
            </div>
            {/* Search bar and filter options*/}
            <GroupContainer>
              <div className="flex flex-col gap-3 p-3 md:flex-row">
                {isFetching ? (
                  <SkeletonTheme baseColor="#f3f4f6" highlightColor="#e5e7eb">
                    <div className="flex-1">
                      <Skeleton height={40} />
                    </div>
                    <div className="flex-1">
                      <Skeleton height={40} />
                    </div>
                    <div className="flex-shrink-0">
                      <Skeleton height={40} width={100} />
                    </div>
                  </SkeletonTheme>
                ) : (
                  <>
                    <div className="flex-1">
                      <CustomInput
                        id="searchTask"
                        name="searchTask"
                        type="text"
                        placeholder="Search tasks..."
                        value={searchInput}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                          setSearchInput(e.target.value)
                        }
                      />
                    </div>
                    <div className="flex-1">
                      <select
                        value={sortInput}
                        onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
                          setSortInput(e.target.value)
                        }
                        className="h-10 w-full outline outline-secondary rounded-md px-2 py-3 text-accent text-sm focus-visible:outline-none duration-200 ease-linear focus-visible:ring-2 focus-within:ring-accent bg-transparent"
                      >
                        <option value="">Sort by...</option>
                        <option value="priority">Priority</option>
                        <option value="dueDate">Due Date</option>
                        <option value="type">Type</option>
                      </select>
                    </div>
                    {/* New Task */}
                    <div className="flex-shrink-0">
                      <CustomButton
                        label={"New Task"}
                        onClick={() => setIsNewTaskExpanded(!isNewTaskExpanded)}
                      />
                      {isNewTaskExpanded && (
                        <Dialog>
                          <TaskForm
                            type="create"
                            onClickCancel={() =>
                              setIsNewTaskExpanded(!isNewTaskExpanded)
                            }
                            // onSuccess={handleTaskCreated} // Uncomment and implement in TaskForm
                          />
                        </Dialog>
                      )}
                    </div>
                  </>
                )}
              </div>
            </GroupContainer>
          </div>

          {/* Error display */}
          {error && (
            <div className="text-red-500 text-sm font-medium mb-2">{error}</div>
          )}

          {/* Loading skeletons */}
          {isFetching && (
            <SkeletonTheme baseColor="#f3f4f6" highlightColor="#e5e7eb">
              <div className="grid grid-cols-1 gap-5 mb-4 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-4">
                {[...Array(4)].map((_, index) => (
                  <div key={index} className="bg-white rounded-lg border border-gray-200 p-4">
                    {/* Column header */}
                    <div className="flex items-center justify-between mb-4">
                      <Skeleton height={20} width={80} />
                      <Skeleton height={20} width={20} circle />
                    </div>
                    
                    {/* Task cards */}
                    <div className="space-y-3">
                      {[...Array(2)].map((_, taskIndex) => (
                        <div key={taskIndex} className="bg-gray-50 rounded-lg p-3 border">
                          <Skeleton height={16} width="80%" className="mb-2" />
                          <Skeleton height={12} width="60%" className="mb-2" />
                          <div className="flex justify-between items-center">
                            <Skeleton height={20} width={60} />
                            <Skeleton height={20} width={20} circle />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </SkeletonTheme>
          )}

          {/* board */}
          {!isFetching && columns.length >= 1 && (
            <div className="grid grid-cols-1 gap-5 mb-4 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-4">
              {columnsData.map((colData: StatusColumnProps, index: number) => {
                return (
                  <div key={index}>
                    <StatusColumn
                      key={index}
                      id={colData.id}
                      title={capitalizeFirstLetter(colData.title)}
                      status={colData.status}
                      createdAt={colData.createdAt}
                      updatedAt={colData.updatedAt}
                      task={colData.task}
                    />
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Project Members Modal */}
        {isMembersModalOpen && projectId && currentProject && (
          <Dialog>
            <ProjectMembers
              projectId={projectId}
              projectOwnerId={currentProject.createdBy}
              onClose={() => setIsMembersModalOpen(false)}
            />
          </Dialog>
        )}
      </DndContext>
    </PageLayout>
  );
}
