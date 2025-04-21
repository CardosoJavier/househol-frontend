import { DndContext, DragEndEvent } from "@dnd-kit/core";
import { useEffect, useState } from "react";
import { StatusColumnProps } from "../models/board/StatusColumn";
import { TaskProps } from "../models/board/Task";
import StatusColumn from "../components/board/StatusColumn";
import verifyDTaskProps from "../utils/tasks/verifyDTicketProps";
import capitalizeFirstLetters from "../utils/strings/capitalizeFirstLetters";
import { getCurrentWeek } from "../utils/time/monthTime";
import { getAllStatusColumns } from "../api/columns/getAllStatusColumn";
import { updateTaskById } from "../api/tasks/updateTaskById";
import Header from "../components/navigation/Header";
import SearchAndFilter from "../components/input/SearchAndFilter";
import { createClient } from "../utils/supabase/component";

export default function Board() {
  const [columnsData, setColumnsData] = useState<StatusColumnProps[]>([]);
  const [isTaskUpdated, setIsTaskUpdated] = useState<TaskProps>();

  const supabase = createClient();
  useEffect(() => {
    console.log(supabase.auth.getSession());
  }, []);

  // Fetch columns data
  useEffect(() => {
    const cols = getAllStatusColumns();
    cols.then((data: StatusColumnProps[]) => {
      setColumnsData(data);
    });
  }, [isTaskUpdated]);

  function handleDragEnd(event: DragEndEvent) {
    const droppedTask = verifyDTaskProps(event.active.data.current);
    const droppedColumn = event.over;

    if (
      droppedTask !== undefined &&
      droppedColumn?.data.current &&
      droppedColumn.id
    ) {
      if (droppedColumn.id !== droppedTask.columnId) {
        updateTaskById(droppedTask.id, {
          columnId: droppedColumn.id as number,
        }).then((updatedTask: TaskProps) => {
          setIsTaskUpdated(updatedTask);
        });
      }
    }
  }

  return (
    <DndContext onDragEnd={handleDragEnd}>
      <div className="mb-10 lg:flex lg:flex-row lg:m-0">
        <Header />

        <div className="flex flex-col gap-4 px-8 mt-8 lg:w-full">
          <div className="flex flex-col gap-4">
            {/* Title */}
            <div>
              <h1 className="text-base font-semibold">Current week</h1>
              <h1 className="text-3xl font-bold">{getCurrentWeek()}</h1>
            </div>
            {/* Search bar and filter options*/}
            <SearchAndFilter />
          </div>

          {/* board */}
          <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-4">
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
                    tasks={[]}
                  />
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </DndContext>
  );
}
