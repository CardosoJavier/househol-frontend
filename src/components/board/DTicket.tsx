import {
  draggable,
  dropTargetForElements,
} from "@atlaskit/pragmatic-drag-and-drop/element/adapter";
import { combine } from "@atlaskit/pragmatic-drag-and-drop/combine";
import { useEffect, useState, useRef } from "react";
import { DTaskProps } from "./DTicket.types";
import RelevanceTag from "../tags/relevanceTag";
import { Clock } from "react-bootstrap-icons";

export default function DTicket({
  id,
  task,
  type,
  columnId,
  assignee,
  completionDate,
}: DTaskProps) {
  const ticketRef = useRef(null);
  const [dragging, setDragging] = useState<boolean>(false);

  useEffect(() => {
    const element = ticketRef.current;

    if (!element) return;

    return combine(
      // make ticket draggable
      draggable({
        element: element,
        getInitialData: () => ({
          type: type,
          id: id,
          task: task,
          columnId: columnId,
          assignee: assignee,
          completionDate: completionDate,
        }),
        onDragStart: () => setDragging(true),
        onDrop: () => setDragging(false),
      }),
      // make ticket a drop target
      dropTargetForElements({
        element: element,
        // make drop target sticky
        getIsSticky: () => true,
      })
    );
  }, [id]);

  return (
    <div
      ref={ticketRef}
      className={`flex flex-col border border-b-2 rounded-lg ${
        dragging ? " invisible" : " bg-white"
      }`}
      onTouchMove={() => {
        console.log("touched");
      }}
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
