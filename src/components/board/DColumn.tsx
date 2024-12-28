import { dropTargetForElements } from "@atlaskit/pragmatic-drag-and-drop/element/adapter";
import { useEffect, useRef, useState } from "react";
import { DColumnProps } from "./DColumn.types";
import DTask from "./DTask";
import { DTaskProps } from "./DTask.types";
import { useDroppable } from "@dnd-kit/core";

export default function DColumn({ id, title, tasks }: DColumnProps) {
  const { setNodeRef, isOver } = useDroppable({
    id: id,
  });

  return (
    <div
      ref={setNodeRef}
      className={`flex flex-col gap-5 bg-white p-4 rounded-lg ${
        isOver ? "transition ease-in duration-200 border-black border-2" : ""
      }`}
    >
      <header className={`text-black text-lg font-bold `}>{title}</header>
      {tasks.map((ticket: DTaskProps, index: number) => {
        return (
          <div key={index}>
            <DTask
              id={ticket.id}
              task={ticket.task}
              type={ticket.type}
              columnId={ticket.columnId}
              assignee={ticket.assignee}
              completionDate={ticket.completionDate}
            />
          </div>
        );
      })}
    </div>
  );
}
