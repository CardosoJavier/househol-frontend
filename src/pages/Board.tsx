import { DndContext, DragEndEvent } from "@dnd-kit/core";
import { useEffect, useState } from "react";
import { StatusColumnProps } from "../components/board/StatusColumn.types";
import { TaskProps } from "../components/board/Task.types";
import Navbar from "../components/navigation/navbar";
import Logo from "../components/tags/logo";
import StatusColumn from "../components/board/StatusColumn";
import verifyDTaskProps from "../util/tasks/verifyDTicketProps";
import isTaskPresent from "../util/tasks/isTaskPresent";
import capitalizeFirstLetters from "../util/strings/capitalizeFirstLetters";
import { getCurrentWeek } from "../util/time/monthTime";
import { getAllStatusColumns } from "../api/tasks/getAllStatusColumn";
export default function Board() {
  const [columnsData, setColumnsData] = useState<StatusColumnProps[]>([]);

  // Get columns data
  useEffect(() => {
    const cols = getAllStatusColumns();
    cols.then((data) => {
      console.log(data);
      setColumnsData(data);
    });
  }, []);

  function handleDragEnd(event: DragEndEvent) {
    const droppedTask = verifyDTaskProps(event.active.data.current);

    setColumnsData((columnData: StatusColumnProps[]) => {
      return columnData.map((column: StatusColumnProps) => {
        if (droppedTask !== undefined && event.over?.id) {
          // remove task from origin column
          if (
            column.id === droppedTask.columnId &&
            column.id !== event.over.id
          ) {
            return {
              ...column,
              tasks: [
                ...column.tasks.filter(
                  (task: TaskProps) => task.id !== droppedTask.id
                ),
              ],
            };
          }

          // add task into dropped column
          if (
            column.id === event.over.id &&
            !isTaskPresent(droppedTask, column.tasks)
          ) {
            return {
              ...column,
              tasks: [
                ...column.tasks,
                {
                  ...droppedTask,
                  columnId: column.id,
                },
              ],
            };
          }
        }

        return column;
      });
    });
  }

  return (
    <DndContext /*sensors={sensors}*/ onDragEnd={handleDragEnd}>
      <div className="flex flex-row justify-between items-center mb-3 p-4 bg-white border-b-2">
        <Logo size={38} />
        <Navbar />
      </div>
      <div className="flex flex-col gap-4 p-8">
        {/* Title */}
        <div>
          <h1 className="text-base font-semibold">Current week</h1>
          <h1 className="text-3xl font-bold">{getCurrentWeek()}</h1>
        </div>
        {/* Search bar and filter options*/}
        <div className="grid grid-cols-3 grid-rows-1 gap-2">
          <input
            className="col-span-2 rounded-md border-2 bg-transparent px-3 py-2 focus-visible:outline-black"
            type="text"
            placeholder="Search tasks..."
          />
          <select className="bg-transparent border-2 rounded-md p-1 focus:outline-black">
            <option>All priorities</option>
            <option>Low</option>
            <option>Medium</option>
            <option>High</option>
          </select>
        </div>

        {/* board */}
        {columnsData.map((colData: StatusColumnProps, index: number) => {
          return (
            <div key={index}>
              <StatusColumn
                key={index}
                id={colData.id}
                title={capitalizeFirstLetters(colData.title)}
                status={colData.status}
                updatedAt={colData.updatedAt}
                tasks={colData.tasks}
              />
            </div>
          );
        })}
      </div>
    </DndContext>
  );
}
