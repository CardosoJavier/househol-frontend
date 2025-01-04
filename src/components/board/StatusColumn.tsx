import { StatusColumnProps } from "./StatusColumn.types";
import Task from "./Task";
import { TaskProps } from "./Task.types";
import { useDroppable } from "@dnd-kit/core";
import { statusColors } from "../../constants/statusColors";

export default function StatusColumn({
  id,
  title,
  tasks,
  status,
}: StatusColumnProps) {
  const { setNodeRef, isOver } = useDroppable({
    id: id,
    data: {
      title: title,
    },
  });

  return (
    <div
      ref={setNodeRef}
      className={`flex flex-col bg-white rounded-lg outline outline-2  ${
        isOver ? "outline-black" : "outline-gray-200"
      }`}
    >
      <header
        className={`text-black w-full text-lg font-bold p-4 ${statusColors.get(
          status
        )}`}
      >
        {title}
      </header>
      <div className="flex flex-col">
        {tasks.map((task: TaskProps, index: number) => {
          return (
            <div className="px-4 my-2" key={index}>
              <Task
                id={task.id}
                description={task.description}
                priority={task.priority}
                status={task.status}
                userAccount={task.userAccount}
                dueDate={task.dueDate}
                createdAt={task.createdAt}
                columnId={task.columnId}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
}
