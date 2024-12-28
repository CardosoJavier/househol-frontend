import { Clock } from "react-bootstrap-icons";
import { useDraggable } from "@dnd-kit/core";
import { CSS } from "@dnd-kit/utilities";
import { DTaskProps } from "./DTask.types";
import RelevanceTag from "../tags/relevanceTag";

export default function DTask({
  id,
  task,
  type,
  columnId,
  assignee,
  completionDate,
}: DTaskProps) {
  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id: id,
    data: {
      id: id,
      task: task,
      type: type,
      assignee: assignee,
      completionDate: completionDate,
      columnId: columnId,
    },
  });

  return (
    <div
      ref={setNodeRef}
      {...listeners}
      {...attributes}
      style={{
        touchAction: "none",
        transform: CSS.Translate.toString(transform),
      }}
      className={`flex flex-col border border-b-2 rounded-lg bg-white`}
    >
      <h1 className=" p-3 font-bold">{task}</h1>
      <div className="p-3 flex flex-row justify-between">
        <RelevanceTag />
        <div className="flex flex-row gap-2 items-center">
          <Clock size={14} color="black" />
          <p className=" text-xs text-gray-600">{completionDate}</p>
        </div>
      </div>
      <div className="flex flex-row gap-3 p-1 bg-[#F9FAFB] items-center justify-start rounded-b-lg border-t">
        <div className="flex items-center justify-center w-5 h-5 mx-2 border border-black rounded-full">
          <p className=" text-xs">{assignee.charAt(0)}</p>
        </div>
        <p>{assignee}</p>
      </div>
    </div>
  );
}
