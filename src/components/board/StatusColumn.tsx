import { useDroppable } from "@dnd-kit/core";
import Task from "./Task";
import { TaskProps, StatusColumnProps } from "../../models";
import { statusColors } from "../../constants";

export default function StatusColumn({
  id,
  title,
  task,
  status,
}: StatusColumnProps) {
  const { setNodeRef, isOver } = useDroppable({
    id: id,
    data: {
      title: title,
      status: status,
    },
  });

  return (
    <div
      ref={setNodeRef}
      className={`flex flex-col bg-white rounded-lg shadow-sm transition-all ${
        isOver
          ? "outline outline-2 outline-black shadow-xl"
          : "outline outline-gray-200"
      }`}
    >
      <header
        className={`text-accent w-full text-sm font-bold p-3 rounded-t-lg ${statusColors.get(
          status
        )}`}
      >
        {title}
      </header>
      <div className="flex flex-col">
        {task?.map((task: TaskProps, index: number) => {
          return (
            <div className="px-3 my-2" key={index}>
              <Task
                id={task.id}
                description={task.description}
                priority={task.priority}
                type={task.type}
                status={task.status}
                userAccount={task.userAccount}
                dueDate={task.dueDate}
                createdAt={task.createdAt}
                updatedAt={task.updatedAt}
                columnId={task.columnId}
                projectId={task.projectId}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
}
