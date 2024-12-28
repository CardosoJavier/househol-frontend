import {
  DndContext,
  useSensors,
  useSensor,
  TouchSensor,
  DragEndEvent,
  PointerSensor,
} from "@dnd-kit/core";
import { useEffect, useRef, useState } from "react";
import mock from "../api/mock.json";
import { DColumnProps } from "../components/board/DColumn.types";
import { DTaskProps } from "../components/board/DTask.types";
import Navbar from "../components/navigation/navbar";
import Logo from "../components/tags/logo";
import DColumn from "../components/board/DColumn";
import verifyDTaskProps from "../util/tasks/verifyDTicketProps";
import isTaskPresent from "../util/tasks/isTaskPresent";
export default function Board() {
  const [columnsData, setColumnsData] = useState<DColumnProps[]>(mock);

  // const sensors = useSensors(
  //   useSensor(TouchSensor, {
  //     activationConstraint: {
  //       distance: 1,
  //     },
  //   }),
  //   useSensor(PointerSensor, {
  //     activationConstraint: {
  //       distance: 1,
  //     },
  //   })
  // );

  function handleDragEnd(event: DragEndEvent) {
    const droppedTask = verifyDTaskProps(event.active.data.current);

    setColumnsData((columnData: DColumnProps[]) => {
      return columnData.map((column: DColumnProps) => {
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
                  (task: DTaskProps) => task.id !== droppedTask.id
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
    <div className="h-fit">
      <DndContext /*sensors={sensors}*/ onDragEnd={handleDragEnd}>
        <div className="flex flex-row justify-between items-center mb-3 px-4 py-2 bg-white border-b-2">
          <Logo size={38} />
          <Navbar />
        </div>
        <div className="flex flex-col gap-4 p-8">
          {/* Title */}
          <h1 className="text-3xl font-bold">Current week</h1>
          {/* Search bar and filter options*/}
          <div className="grid grid-cols-3 grid-rows-1 gap-2">
            <input
              className="col-span-2 rounded-md border-2 bg-page-bg px-3 py-2 focus-visible:outline-black"
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
          {columnsData.map((colData: DColumnProps, index: number) => {
            return (
              <div key={index}>
                <DColumn
                  key={index}
                  id={colData.id}
                  title={colData.title}
                  tasks={colData.tasks}
                />
              </div>
            );
          })}
        </div>
      </DndContext>
    </div>
  );
}
