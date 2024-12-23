import { dropTargetForElements } from "@atlaskit/pragmatic-drag-and-drop/element/adapter";
import { ReactNode, useEffect, useRef, useState } from "react";

interface TaskColumnPropsProps {
  title: String;
  children: ReactNode;
}

export default function TaskColumn({ title, children }: TaskColumnPropsProps) {
  const ref = useRef(null);
  const [isDraggedOver, setIsDraggedOver] = useState<boolean>(false);

  useEffect(() => {
    const container = ref.current;
    if (!container) return;

    return dropTargetForElements({
      element: container,
      onDragEnter: () => setIsDraggedOver(true),
      onDragLeave: () => setIsDraggedOver(false),
      onDrop: () => setIsDraggedOver(false),
    });
  }, []);

  return (
    <div ref={ref} className={`flex flex-col gap-5 bg-white p-4 rounded-lg`}>
      <header className={`text-black text-lg font-bold `}>{title}</header>
      <div className="flex flex-col gap-4">{children}</div>
    </div>
  );
}
