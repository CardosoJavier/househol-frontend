import { useEffect, useState, useRef } from "react";
import RelevanceTag from "../tags/relevanceTag";
import {
  draggable,
  dropTargetForElements,
} from "@atlaskit/pragmatic-drag-and-drop/element/adapter";
import { attachClosestEdge } from "@atlaskit/pragmatic-drag-and-drop-hitbox/closest-edge";
import { combine } from "@atlaskit/pragmatic-drag-and-drop/combine"; // NEW

interface TaskTicketProps {
  id: number;
  task: string;
}

export default function DTicket({ id, task }: TaskTicketProps) {
  const ticketRef = useRef(null);
  const [dragging, setDragging] = useState<boolean>(false);

  useEffect(() => {
    const task = ticketRef.current;

    if (!task) return;

    return combine(
      // make ticket draggable
      draggable({
        element: task,
        getInitialData: () => ({ type: "ticket", id: id }),
        onDragStart: () => setDragging(true),
        onDrop: () => setDragging(false),
      }),
      // make ticket a drop target
      dropTargetForElements({
        element: task,
        getData: ({ input, element }: { input: any; element: any }) => {
          // attach card data to target zone
          const data = { type: "ticket", id: id };

          return attachClosestEdge(data, {
            input,
            element,
            allowedEdges: ["top", "bottom"],
          });
        },
        // make drop target sticky
        getIsSticky: () => true,
        onDragEnter: (args) => {
          if (args.source.data.id !== id) {
            console.log("onDragEnter", args);
          }
        },
      })
    );
  }, [id]);

  return (
    <div
      ref={ticketRef}
      className={`flex flex-col border border-b-2 rounded-lg ${
        dragging ? " invisible" : "bg-white"
      }`}
    >
      <h1 className=" p-3 font-bold">{task}</h1>
      <div className="p-3 flex flex-row justify-between">
        <RelevanceTag />
        <p className=" text-xs text-gray-600">2024-06-15</p>
      </div>
      <div className="flex flex-row gap-3 p-1 bg-[#F9FAFB] items-center rounded-lg">
        <div className="flex items-center justify-center w-5 h-5 mx-2 border border-black rounded-full">
          <p className=" text-xs">J</p>
        </div>
        <p>John</p>
      </div>
    </div>
  );
}
