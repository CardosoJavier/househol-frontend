import {
  DndContext,
  DragEndEvent,
  MouseSensor,
  TouchSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import { useState } from "react";
import { StatusColumnProps } from "../../models/board/StatusColumn";
import { TaskProps } from "../../models/board/Task";
import StatusColumn from "../../components/board/StatusColumn";
import verifyDTaskProps from "../../utils/tasks/verifyDTicketProps";
import capitalizeFirstLetters from "../../utils/strings/capitalizeFirstLetters";
import { getCurrentWeek } from "../../utils/time/monthTime";
import { updateTaskById } from "../../api/tasks/updateTaskById";
import Header from "../../components/navigation/Header";
import { GridLoader } from "react-spinners";
import GroupContainer from "../../components/containers/groupContainer";
import CustomButton from "../../components/input/customButton";
import TaskForm from "../../components/input/taskForm";
import Dialog from "../../components/containers/formDialog";
import { useColumns } from "../../context/ColumnsContext";

export default function Board() {
  const [isNewTaskExpanded, setIsNewTaskExpanded] = useState<boolean>(false);
  const { columns, isFetching, fetchColumns } = useColumns();

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
    const droppedTask: TaskProps | undefined = verifyDTaskProps(
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
        });

        if (!isTaskUpdated || typeof isTaskUpdated === "object") {
          alert("Failed to update task");
          return;
        }

        fetchColumns();
      }
    }
  }

  return (
    <DndContext sensors={sensors} onDragEnd={handleDragEnd}>
      <div className="lg:flex lg:flex-row">
        <Header />
        <div className="flex flex-col gap-4 px-8 mt-8 lg:w-full">
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
                  <input
                    className="w-full rounded-md border-2 bg-transparent px-3 py-2 focus-visible:outline-accent"
                    type="text"
                    placeholder="Search tasks..."
                  />
                </div>
                <div className="flex-1">
                  <select className="w-full bg-transparent border-2 rounded-md px-3 py-2 focus:outline-accent">
                    <option>Filter by...</option>
                    <option>Low</option>
                    <option>Medium</option>
                    <option>High</option>
                  </select>
                </div>
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
                      />
                    </Dialog>
                  )}
                </div>
              </div>
            </GroupContainer>
          </div>

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
              {columns.map((colData: StatusColumnProps, index: number) => {
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
        </div>
      </div>
    </DndContext>
  );
}
