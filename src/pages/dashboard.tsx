import { monitorForElements } from "@atlaskit/pragmatic-drag-and-drop/element/adapter";
import { useEffect, useRef, useState } from "react";
import mock from "../api/mock.json";
import DColumnProps from "../components/board/DColumn.types";
import DTaskProps from "../components/board/DTicket.types";
import Navbar from "../components/navigation/navbar";
import Logo from "../components/tags/logo";
import DColumn from "../components/board/DColumn";
import verifyDTaskProps from "../util/verify/verifyDTicketProps";

/*
Takes an object, verify it's properties are of type DTaskProps, and returns a DTask component if the properties match
@param taskData: unknown - Potential DTaskProps object that will be used to build a DTask component.
*/
function buildTask(taskData: unknown) {
  if (verifyDTaskProps(taskData)) {
    const droppedTask = taskData as DTaskProps;
    return taskData;
  }
}

export default function Dashboard() {
  const [columnsData, setColumnsData] = useState<DColumnProps[]>(mock);
  const ref = useRef(null);

  /*
  useEffect(() => {
    console.log(columnsData);
  }, [columnsData]);
  */

  useEffect(() => {
    const elemt = ref.current;
    if (!elemt) return;

    return monitorForElements({
      onDrop: ({ source, location }) => {
        console.log(source);
        console.log(location);
        //console.log(location.current.dropTargets);
        setColumnsData((currentColumns: DColumnProps[]) => {
          return currentColumns.map((column: DColumnProps) => {
            // CASE: Empty column / no tickets
            // remove task from origin and add it into dropped column
            if (location.current.dropTargets.length === 1) {
              // remove task from origin column
              if (column.id === source.data.columnId) {
                return {
                  ...column,
                  tasks: column.tasks.filter(
                    (task) => task.id !== source.data.id
                  ),
                };
              }
              // add task to dropped column
              if (column.id === location.current.dropTargets[0].data.id) {
                let newTask: DTaskProps = source.data as unknown as DTaskProps;
                newTask.columnId = column.id;
                return {
                  ...column,
                  tasks: [...column.tasks, newTask],
                };
              }
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
