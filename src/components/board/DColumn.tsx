import { dropTargetForElements } from "@atlaskit/pragmatic-drag-and-drop/element/adapter";
import { ReactElement, ReactNode, useEffect, useRef, useState } from "react";

interface TaskColumnPropsProps {
  columnId: number;
  title: String;
  tickets: ReactElement[];
}

export default function DColumn({
  columnId,
  title,
  tickets,
}: TaskColumnPropsProps) {
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
        console.log("enters drag column ", columnId);
        setIsDraggedOver(true);
      },
      // drag element leaves the drop zone
      onDragLeave: () => setIsDraggedOver(false),
      // drag element is dropped in the drop zone
      onDrop: () => {
        console.log(`item dropped in column ${columnId}`);
        setIsDraggedOver(false);
      },
      // attach data to dropped element
      getData: () => ({ columnId }),
      // hold onto section after drop
      getIsSticky: () => true,
    });
  }, [columnId]);

  return (
    <div
      ref={DColumnRef}
      className={`flex flex-col gap-5 bg-white p-4 rounded-lg ${
        isDraggedOver ? "bg-blue-100" : ""
      }`}
    >
      <header className={`text-black text-lg font-bold `}>{title}</header>
      <div className="flex flex-col gap-4">{tickets}</div>
    </div>
  );
}
