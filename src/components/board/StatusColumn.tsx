import { StatusColumnProps } from "./StatusColumn.types";
import Task from "./Task";
import { TaskProps } from "./Task.types";
import { useDroppable } from "@dnd-kit/core";

export default function StatusColumn({
  id,
  title,
  status,
  updatedAt,
  tasks,
}: StatusColumnProps) {
  const { setNodeRef, isOver } = useDroppable({
    id: id,
  });

  return (
    <div
      ref={setNodeRef}
      className={`flex flex-col gap-5 bg-white p-4 rounded-lg ${
        isOver ? "transition ease-in duration-200 border-black border-2" : ""
      }`}
    >
      <header className={`text-black text-lg font-bold `}>{title}</header>
      {tasks.map((task: TaskProps, index: number) => {
        return (
          <div key={index}>
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
  );
}
