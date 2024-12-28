import { monitorForElements } from "@atlaskit/pragmatic-drag-and-drop/element/adapter";
import { useEffect, useRef, useState } from "react";
import mock from "../api/mock.json";
import { DColumnProps } from "../components/board/DColumn.types";
import { DTaskProps } from "../components/board/DTicket.types";
import Navbar from "../components/navigation/navbar";
import Logo from "../components/tags/logo";
import DColumn from "../components/board/DColumn";
import isTaskPresent from "../util/tasks/isTaskPresent";

export default function Board() {
  const [columnsData, setColumnsData] = useState<DColumnProps[]>(mock);
  const ref = useRef(null);

  useEffect(() => {
    const elemt = ref.current;
    if (!elemt) return;

    return monitorForElements({
      // source: draggable component data
      // location: prev, initial, current drag operations data
      onDrop: ({ source, location }) => {
        // Origin column
        let originCol = location.initial.dropTargets.filter(
          (dropZone) => "tasks" in dropZone.data
        );
        //console.log("originCol", originCol);

        // Dropped column
        let currentCol = location.current.dropTargets.filter(
          (dropZone) => "tasks" in dropZone.data
        );
        //console.log("currentCol", currentCol);

        // original task
        const originalTask = source.data as unknown as DTaskProps;

        // Updated task
        const updatedTask = {
          ...source.data,
          columnId: currentCol[0].data.id,
        } as unknown as DTaskProps;
        //console.log("updatedTask", updatedTask);

        setColumnsData((currentColumns: DColumnProps[]) => {
          return currentColumns.map((column: DColumnProps) => {
            /* CASE: MOVE TASK TO EMPTY COLUMN */

            // remove task from origin column
            // if col.id === task.columnId
            if (
              originCol[0].data.id === column.id &&
              currentCol[0].data.id !== column.id
            ) {
              //console.log("originCol", originCol);

              // get tasks but the one being dropped into new column
              let updatedTasks = column.tasks.filter(
                (task: DTaskProps) => task.id !== originalTask.id
              );
              //console.log("updatedTasks", updatedTasks);

              // return column with task list witout removed task
              const updatedCol: DColumnProps = {
                ...column,
                tasks: updatedTasks,
              };

              //console.log("updatedCol", updatedCol);
              console.log(
                `removing "${originalTask.task}" task from column ${column.title}`
              );
              return updatedCol;
            }

            // add task to current column
            if (
              currentCol[0].data.id === column.id &&
              !isTaskPresent(updatedTask, column.tasks)
            ) {
              console.log(
                `adding "${updatedTask.task}" task to column ${column.title}`
              );
              return {
                ...column,
                tasks: [...column.tasks, updatedTask],
              };
            }

            return column;
          });
        });
      },
    });
  }, []);
  return (
    <>
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
            <div key={index} ref={ref}>
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
    </>
  );
}
