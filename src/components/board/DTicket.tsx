import {
  draggable,
  dropTargetForElements,
} from "@atlaskit/pragmatic-drag-and-drop/element/adapter";
import { attachClosestEdge } from "@atlaskit/pragmatic-drag-and-drop-hitbox/closest-edge";
import { combine } from "@atlaskit/pragmatic-drag-and-drop/combine";
import { useEffect, useState, useRef } from "react";
import DTaskProps from "./DTicket.types";
import RelevanceTag from "../tags/relevanceTag";

export default function DTicket({ id, task, type, columnId }: DTaskProps) {
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
        }),
        onDragStart: () => setDragging(true),
        onDrop: () => setDragging(false),
      }),
      // make ticket a drop target
      dropTargetForElements({
        element: element,
        getData: ({ input, element }: { input: any; element: any }) => {
          // attach card data to target zone
          const data = { type: type, id: id, task: task, columnId: columnId };

          return attachClosestEdge(data, {
            input,
            element,
            allowedEdges: ["top", "bottom"],
          });
        },
        // make drop target sticky
        getIsSticky: () => true,
        onDragEnter: (args) => {},
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
      <div className="flex flex-row gap-3 p-1 bg-[#F9FAFB] items-center rounded-b-lg">
        <div className="flex items-center justify-center w-5 h-5 mx-2 border border-black rounded-full">
          <p className=" text-xs">J</p>
        </div>
        <p>John</p>
      </div>
    </div>
  );
}
