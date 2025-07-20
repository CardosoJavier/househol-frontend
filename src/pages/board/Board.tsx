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
  capitalizeFirstLetters,
  getCurrentWeek,
} from "../../utils";
import {
  PageLayout,
  Dialog,
  TaskForm,
  CustomButton,
  GroupContainer,
  StatusColumn,
  CustomInput,
} from "../../components";
import { updateTaskById } from "../../api";
import { GridLoader } from "react-spinners";
import { useColumns } from "../../context";
import { useSearchParams } from "react-router";
import {
  CustomToastContainer,
  showToast,
} from "../../components/notifications/CustomToast";

export default function Board() {
  const [searchParams] = useSearchParams();
  const projectId = searchParams.get("projectId");

  const [columnsData, setColumnsData] = useState<StatusColumnProps[]>([]);
  const [isNewTaskExpanded, setIsNewTaskExpanded] = useState<boolean>(false);

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

  useEffect(() => {
    if (projectId) {
      setProjectId(projectId);
    }
  }, [projectId, setProjectId]);

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
        const isTaskUpdated = await updateTaskById({
          id: droppedTask.id as string,
          columnId: droppedColumn.id as number,
          status: droppedColumn.data.current.status as string,
          projectId: projectId as string,
        });

        if (!isTaskUpdated || typeof isTaskUpdated === "object") {
          alert("Failed to update task");
          return;
        }

        // Invalidate cache and refetch columns after column update
        invalidateCache();
        await fetchColumns(true);
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
    const priorityOrder: { [key: string]: number } = {
      high: 1,
      medium: 2,
      low: 3,
    };

    const sortedColumns = columns.map((column: StatusColumnProps) => {
      let sortedTasks = [...column.task];

      if (sortInput === "priority") {
        sortedTasks = sortedTasks.sort((a: TaskProps, b: TaskProps) => {
          return (
            (priorityOrder[a.priority] || 4) - (priorityOrder[b.priority] || 4)
          );
        });
      }

      if (sortInput === "dueDate") {
        sortedTasks = sortedTasks.sort((a: TaskProps, b: TaskProps) => {
          const dueDateA = new Date(a.dueDate).getTime();
          const dueDateB = new Date(b.dueDate).getTime();
          return dueDateA - dueDateB;
        });
      }

      return {
        ...column,
        task: sortedTasks,
      };
    });

    setColumnsData(sortedColumns);
  }

  return (
    <PageLayout>
      <DndContext sensors={sensors} onDragEnd={handleDragEnd}>
        <div className="flex flex-col gap-4 lg:w-full">
          <div className="flex flex-col gap-4">
            {/* Title */}
            <div>
              <h1 className="text-base font-semibold">Current week</h1>
              <h1 className="text-3xl font-bold">{getCurrentWeek()}</h1>
            </div>
            {/* Search bar and filter options*/}
            <GroupContainer>
              <div className="flex flex-col gap-4 p-4 md:flex-row">
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
                    className="w-full bg-transparent border-2 rounded-md px-3 py-2 focus:outline-accent"
                  >
                    <option value="">Sort by...</option>
                    <option value="priority">Priority</option>
                    <option value="dueDate">Due Date</option>
                  </select>
                </div>
                {/* New Task */}
                <div className="flex-2">
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
              </div>
            </GroupContainer>
          </div>

          {/* Error display */}
          {error && (
            <div className="text-red-500 text-sm font-medium mb-2">{error}</div>
          )}

          {/* Loading animation */}
          {isFetching && (
            <div className="flex flex-col items-center gap-2 self-center mt-10">
              <GridLoader size={10} />
              <span className="text-sm font-medium">loading task</span>
            </div>
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
                      title={capitalizeFirstLetters(colData.title)}
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
          <CustomToastContainer />
        </div>
      </DndContext>
    </PageLayout>
  );
}
