import { MdCheckBox, MdDelete } from "react-icons/md";
import { useState } from "react";
import { Clock } from "react-bootstrap-icons";
import { useDraggable } from "@dnd-kit/core";
import { CSS } from "@dnd-kit/utilities";
import { BsThreeDots } from "react-icons/bs";
import { MdEdit } from "react-icons/md";

import RelevanceTag from "../tags/relevanceTag";
import TaskForm from "../input/taskForm";
import Dialog from "../containers/Dialog";
import CustomButton from "../input/customButton";

import { useColumns } from "../../context";
import { deleteTaskById, updateTaskById } from "../../api";
import { TaskInput, TaskProps } from "../../models";
import { capitalizeFirstLetters, formatMonthDay } from "../../utils";
import { COLUMN_STATUS } from "../../constants";

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
  projectId,
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
      projectId: projectId,
    },
  });

  const { fetchColumns, invalidateCache } = useColumns();
  const [isEditTaskExpanded, setIsEditTaskExpanded] = useState<boolean>(false);
  const [isDeleteTaskExpanded, setIsDeleteTaskExpanded] =
    useState<boolean>(false);

  const [isCloseTaskExpanded, setIsCloseTaskExpanded] =
    useState<Boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  function TaskActions() {
    const [areTaskActionsExpanded, setAreTaskActionsExpanded] =
      useState<boolean>(false);
    return (
      <div>
        <button
          onClick={() => setAreTaskActionsExpanded(!areTaskActionsExpanded)}
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

          {columnId === COLUMN_STATUS.COMPLETED && (
            <button
              className="flex gap-1 p-1 hover:bg-gray-100"
              onClick={() => setIsCloseTaskExpanded(!isCloseTaskExpanded)}
            >
              <MdCheckBox color="green" size={16} />
              <span className="text-xs text-green-700">Close</span>
            </button>
          )}

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

  async function handleTaskDelete() {
    try {
      setIsLoading(true);
      let res: Boolean = await deleteTaskById(id);
      if (res) {
        invalidateCache();
      }
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

  async function handleCloseTask() {
    try {
      setIsLoading(true);
      let res: Boolean = await updateTaskById({
        id: id,
        columnId: COLUMN_STATUS.CLOSED,
      } as TaskInput);
      if (res) {
        invalidateCache();
      }
    } catch (error) {
      console.error(error);
      alert(error);
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
                projectId: projectId,
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

        {isCloseTaskExpanded && (
          <Dialog>
            <div className="flex flex-col gap-4">
              <div className="flex flex-col gap-3">
                <h3 className="font-medium text-2xl text-green-600">
                  Close <span className="italic">'{description}'</span> ?
                </h3>
                <p className="text-gray-500 text-sm">
                  Are you sure this task is really <strong>done</strong>?
                </p>
              </div>

              <div className="flex flex-row gap-4">
                <CustomButton
                  label={"Cancel"}
                  type="button"
                  onClick={() => setIsCloseTaskExpanded(!isCloseTaskExpanded)}
                />
                <CustomButton
                  label={"Close"}
                  type="button"
                  onClick={() => handleCloseTask()}
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
          <p className=" text-xs">{`${userAccount?.firstName.charAt(0)}`}</p>
        </div>
        <p>
          {userAccount?.firstName} {userAccount?.lastName}
        </p>
      </div>
    </div>
  );
}
