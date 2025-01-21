import { Clock } from "react-bootstrap-icons";
import { useDraggable } from "@dnd-kit/core";
import { CSS } from "@dnd-kit/utilities";
import { TaskProps } from "./Task.types";
import RelevanceTag from "../tags/relevanceTag";
import capitalizeFirstLetters from "../../util/strings/capitalizeFirstLetters";
import { formatMonthDay } from "../../util/time/formatMonthDay";

export default function Task({
  id,
  description,
  dueDate,
  priority,
  status,
  createdAt,
  userAccount,
  columnId,
}: TaskProps) {
  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id: id,
    data: {
      id: id,
      description: description,
      priority: priority,
      status: status,
      dueDate: dueDate,
      createdAt: createdAt,
      userAccount: userAccount,
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
      className={`flex flex-col border border-b-2 rounded-lg bg-primary`}
    >
      <h1 className=" p-3 font-bold">{capitalizeFirstLetters(description)}</h1>
      <div className="p-3 flex flex-row justify-between">
        <RelevanceTag />
        <div className="flex flex-row gap-2 items-center">
          <Clock size={14} color="black" />
          <p className=" text-xs text-gray-600">
            {formatMonthDay(new Date(dueDate))}
          </p>
        </div>
      </div>
      <div className="flex flex-row gap-3 p-1 bg-[#F9FAFB] items-center justify-start rounded-b-lg border-t">
        <div className="flex items-center justify-center w-5 h-5 mx-2 border border-accent rounded-full">
          <p className=" text-xs">{`${userAccount.name.charAt(0)}`}</p>
        </div>
        <p>
          {userAccount.name} {userAccount.lastName}
        </p>
      </div>
    </div>
  );
}
