import { Clock } from "react-bootstrap-icons";
import { useDraggable } from "@dnd-kit/core";
import { CSS } from "@dnd-kit/utilities";
import { BsThreeDots } from "react-icons/bs";
import { MdEdit } from "react-icons/md";
import { MdDelete } from "react-icons/md";
import { useState } from "react";
import { TaskProps } from "../../models/board/Task";
import RelevanceTag from "../tags/relevanceTag";
import capitalizeFirstLetters from "../../utils/strings/capitalizeFirstLetters";
import { formatMonthDay } from "../../utils/time/formatMonthDay";
import deleteTaskById from "../../api/tasks/deleteTaskById";
import TaskForm from "../input/taskForm";
import Dialog from "../containers/formDialog";
import CustomButton from "../input/customButton";
import { useColumns } from "../../context/ColumnsContext";

export default function Task({
  id,
  description,
  dueDate,
  dueTime,
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
      dueTime: dueTime,
      createdAt: createdAt,
      userAccount: userAccount,
      columnId: columnId,
    },
  });

  const { fetchColumns } = useColumns();
  const [isEditTaskExpanded, setIsEditTaskExpanded] = useState<boolean>(false);
  const [isDeleteTaskExpanded, setIsDeleteTaskExpanded] =
    useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  function TaskActions() {
    const [areTaskActionsExpanded, setareTaskActionsExpanded] =
      useState<boolean>(false);
    return (
      <div>
        <button
          onClick={() => setareTaskActionsExpanded(!areTaskActionsExpanded)}
          className="flex flex-col items-center justify-center border border-b-2 rounded-md p-1 hover:bg-gray-100"
        >
          <BsThreeDots size={15} />
        </button>

        <div
          className={
            areTaskActionsExpanded
              ? "flex flex-col gap-2 absolute bg-white border border-b-2 rounded-md p-1"
              : "hidden"
          }
        >
          <button
            className="flex gap-1 p-1 hover:bg-gray-100"
            onClick={() => setIsEditTaskExpanded(!isEditTaskExpanded)}
          >
            <MdEdit color="#1d4ed8" size={16} />
            <span className="text-xs text-blue-700">Edit</span>
          </button>

          <button
            className="flex gap-1 p-1 hover:bg-gray-100"
            onClick={() => setIsDeleteTaskExpanded(!isDeleteTaskExpanded)}
          >
            <MdDelete color="#b91c1c" size={16} />
            <span className="text-xs text-red-700">Delete</span>
          </button>
        </div>
      </div>
    );
  }

  function handleTaskDelete() {
    try {
      setIsLoading(true);
      deleteTaskById(id);
    } catch (error) {
      console.error(error);
    } finally {
      setTimeout(() => {
        fetchColumns();
        setIsLoading(false);
        setIsDeleteTaskExpanded(!isDeleteTaskExpanded);
      }, 90);
    }
  }

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
      <div className="flex justify-between items-center p-3 w-full">
        <h1 className="font-bold">{capitalizeFirstLetters(description)}</h1>
        <TaskActions />
        {isEditTaskExpanded && (
          <Dialog>
            <TaskForm
              type="update"
              taskData={{
                id: id,
                description: description,
                priority: priority,
                dueDate: dueDate,
                dueTime: dueTime,
              }}
              onClickCancel={() => setIsEditTaskExpanded(!isEditTaskExpanded)}
            />
          </Dialog>
        )}

        {isDeleteTaskExpanded && (
          <Dialog>
            <div className="flex flex-col gap-4">
              <div className="flex flex-col gap-3">
                <h3 className="font-medium text-2xl text-red-600">
                  Delete <span className="italic">'{description}'</span> ?
                </h3>
                <p className="text-gray-500 text-sm">
                  Deleting a task is <strong>not reversible</strong>. Are you
                  sure you want to proceed?
                </p>
              </div>

              <div className="flex flex-row gap-4">
                <CustomButton
                  label={"Cancel"}
                  type="button"
                  onClick={() => setIsDeleteTaskExpanded(!isDeleteTaskExpanded)}
                />
                <CustomButton
                  label={"Delete"}
                  type="button"
                  onClick={() => handleTaskDelete()}
                  loading={isLoading}
                />
              </div>
            </div>
          </Dialog>
        )}
      </div>
      <div className="p-3 flex flex-row justify-between">
        <RelevanceTag priority={priority} />
        <div className="flex flex-row gap-2 items-center">
          <Clock size={14} color="black" />
          <p className=" text-xs text-gray-600">
            {formatMonthDay(new Date(dueDate))} at {dueTime.slice(0, 5)}
          </p>
        </div>
      </div>
      <div className="flex flex-row gap-3 p-1 bg-[#F9FAFB] items-center justify-start rounded-b-lg border-t">
        <div className="flex items-center justify-center w-5 h-5 mx-2 border border-accent rounded-full">
          <p className=" text-xs">{`${userAccount.firstName.charAt(0)}`}</p>
        </div>
        <p>
          {userAccount.firstName} {userAccount.lastName}
        </p>
      </div>
    </div>
  );
}
