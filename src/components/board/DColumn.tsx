import { dropTargetForElements } from "@atlaskit/pragmatic-drag-and-drop/element/adapter";
import { useEffect, useRef, useState } from "react";
import { DColumnProps } from "./DColumn.types";
import DTicket from "./DTicket";
import DTaskProps from "./DTicket.types";

export default function DColumn({ id, title, tasks }: DColumnProps) {
  const DColumnRef = useRef(null);
  const [isDraggedOver, setIsDraggedOver] = useState<boolean>(false);

  useEffect(() => {
    const columnElem = DColumnRef.current;
    if (!columnElem) return;

    return dropTargetForElements({
      element: columnElem,
      // drag element is dragged in drop zone
      onDragStart: () => setIsDraggedOver(true),
      // drag element enters the drop zone
      onDragEnter: () => {
        setIsDraggedOver(true);
      },
      // drag element leaves the drop zone
      onDragLeave: () => setIsDraggedOver(false),
      // drag element is dropped in the drop zone
      onDrop: () => {
        setIsDraggedOver(false);
      },
      // attach data to dropped element
      getData: () => ({ id, title, tasks }),
      // hold onto section after drop
      getIsSticky: () => true,
    });
  }, [id]);

  return (
    <div
      ref={DColumnRef}
      className={`flex flex-col gap-5 bg-white p-4 rounded-lg ${
        isDraggedOver
          ? "transition ease-in duration-200 border-black border-2"
          : ""
      }`}
    >
      <header className={`text-black text-lg font-bold `}>{title}</header>
      {tasks.map((ticket: DTaskProps, index: number) => {
        return (
          <div key={index}>
            <DTicket
              id={ticket.id}
              task={ticket.task}
              type={ticket.type}
              columnId={ticket.columnId}
            />
          </div>
        );
      })}
    </div>
  );
}
