import { MdCheckBox, MdDelete } from "react-icons/md";
import { useState } from "react";
import { Clock } from "react-bootstrap-icons";
import { useDraggable } from "@dnd-kit/core";
import { CSS } from "@dnd-kit/utilities";
import { BsThreeDots } from "react-icons/bs";
import { MdEdit } from "react-icons/md";

import RelevanceTag from "../tags/relevanceTag";
import TypeTag from "../tags/typeTag";
import TaskForm from "../input/taskForm";
import Dialog from "../containers/Dialog";
import CustomButton from "../input/customButton";

import { useColumns } from "../../context";
import { deleteTaskById, updateTaskById } from "../../api";
import { TaskInput, TaskProps } from "../../models";
import {
  capitalizeFirstLetter,
  formatMonthDay,
  parseLocalDate,
} from "../../utils";
import { COLUMN_STATUS, TASK_STATUS } from "../../constants";
import { showToast } from "../notifications/CustomToast";
import { GENERIC_ERROR_MESSAGES, handleError } from "../../constants";

export default function Task({
  id,
  description,
  dueDate,
  priority,
  type,
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
      type: type,
      status: status,
      dueDate: dueDate,
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
      await deleteTaskById(id);
      invalidateCache();
    } catch (error) {
      const errorMessage = handleError(
        error,
        GENERIC_ERROR_MESSAGES.TASK_DELETE_FAILED
      );
      showToast(errorMessage, "error");
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
      await updateTaskById({
        id: id,
        columnId: COLUMN_STATUS.CLOSED,
        status: TASK_STATUS.CLOSED,
      } as TaskInput);
      invalidateCache();
    } catch (error) {
      const errorMessage = handleError(
        error,
        GENERIC_ERROR_MESSAGES.TASK_UPDATE_FAILED
      );
      showToast(errorMessage, "error");
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
        transform: CSS.Translate.toString(transform),
      }}
      className={`flex flex-col border border-gray-200 rounded-lg bg-white shadow-sm hover:shadow-md transition-shadow`}
    >
      <div className="flex justify-between items-center p-3 w-full">
        <h1 className="font-medium text-sm">
          {capitalizeFirstLetter(description)}
        </h1>
        <TaskActions />
        {isEditTaskExpanded && (
          <Dialog>
            <TaskForm
              type="update"
              taskData={{
                id: id,
                description: description,
                priority: priority,
                type: type,
                dueDate: dueDate,
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
                <h3 className="font-medium text-2xl">
                  Are you sure you want to delete this task?
                </h3>
                <p className="text-gray-500 text-sm">
                  Deleting a task is{" "}
                  <strong className="text-red-500">not reversible</strong>. Are
                  you sure you want to proceed?
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
                <h3 className="font-medium text-2xl">
                  Close <span className="italic">`{description}`</span> ?
                </h3>
                <p className="text-gray-500 text-sm">
                  Are you sure this task is really{" "}
                  <strong className="text-green-600">done</strong>?
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
      <div className="px-3 pb-2 flex flex-row justify-between">
        <div className="flex flex-row gap-2 items-center">
          <RelevanceTag priority={priority} />
          <TypeTag type={type} />
        </div>
        <div className="flex flex-row gap-2 items-center">
          <Clock size={14} color="black" />
          <p className=" text-xs text-gray-600">
            {formatMonthDay(parseLocalDate(dueDate))}
          </p>
        </div>
      </div>
      <div className="flex flex-row gap-2 p-2 bg-gray-50 items-center justify-start rounded-b-lg border-t border-gray-100">
        <div className="flex items-center justify-center w-6 h-6 border border-gray-300 rounded-full bg-white">
          <p className="text-xs font-medium">{`${userAccount?.firstName.charAt(
            0
          )}`}</p>
        </div>
        <p className="text-sm text-gray-700">
          {userAccount?.firstName} {userAccount?.lastName}
        </p>
      </div>
    </div>
  );
}
