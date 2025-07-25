import React, { ChangeEvent, FormEvent, useState } from "react";
import CustomButton from "./customButton";
import { createNewTask, updateTaskById } from "../../api";
import { TaskInput } from "../../models";
import { useColumns } from "../../context";
import { useSearchParams } from "react-router";
import { showToast } from "../notifications/CustomToast";
import {
  GENERIC_ERROR_MESSAGES,
  GENERIC_SUCCESS_MESSAGES,
  handleError,
  TASK_TYPE_OPTIONS,
} from "../../constants";

export default function TaskForm({
  taskData,
  type,
  onClickCancel,
}: {
  taskData?: TaskInput;
  type: "create" | "update";
  onClickCancel: any;
}) {
  // Context
  const { fetchColumns, invalidateCache } = useColumns();

  const [searchParams] = useSearchParams();
  const projectId = searchParams.get("projectId");

  if (!projectId) {
    showToast(GENERIC_ERROR_MESSAGES.PROJECT_ACCESS_DENIED, "error");
    return false;
  }

  // Form state
  const [description, setDescription] = useState<string>(
    taskData?.description ? taskData.description : ""
  );
  const [priority, setPriority] = useState<string>(
    taskData?.priority ? taskData.priority : ""
  );
  const [taskType, setTaskType] = useState<string>(
    taskData?.type ? taskData.type : ""
  );
  const [dueDate, setDueDate] = useState<string>(
    taskData?.dueDate
      ? new Date(taskData.dueDate).toISOString().split("T")[0]
      : ""
  );
  const [loading, setLoading] = useState<boolean>(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    let res: boolean = false;

    try {
      setLoading(true);

      // Create date in local timezone to avoid UTC conversion issues
      const [year, month, day] = dueDate.split("-").map(Number);
      const date = new Date(year, month - 1, day); // month is 0-indexed

      const task: TaskInput = {
        id: taskData?.id ?? "",
        description,
        dueDate: date,
        priority,
        type: taskType,
        projectId: projectId as string,
      };

      switch (type) {
        case "create":
          res = await createNewTask(task);
          break;
        case "update":
          // Check if any data has actually changed
          if (taskData && taskData.dueDate) {
            // Parse original date consistently (handle both string and Date types)
            let originalDate: Date;
            // Note: API might return dueDate as string despite TypeScript expecting Date
            const dueDateValue = taskData.dueDate as any; // Type assertion needed due to API/type mismatch

            if (typeof dueDateValue === "string") {
              // If it's a string like "2025-07-26", parse it in local timezone
              const [year, month, day] = dueDateValue.split("-").map(Number);
              originalDate = new Date(year, month - 1, day);
            } else {
              // If it's already a Date object, create a new Date in local timezone
              const dateStr = dueDateValue.toISOString().split("T")[0];
              const [year, month, day] = dateStr.split("-").map(Number);
              originalDate = new Date(year, month - 1, day);
            }

            const hasChanged =
              description.trim() !== (taskData.description || "").trim() ||
              priority !== (taskData.priority || "") ||
              taskType !== (taskData.type || "") ||
              date.toDateString() !== originalDate.toDateString();

            if (!hasChanged) {
              showToast(GENERIC_SUCCESS_MESSAGES.NO_CHANGES_DETECTED, "info");
              return; // Return early to prevent HTTP request
            }
          }

          res = await updateTaskById(task);
          break;
      }
    } catch (error) {
      const errorMessage = handleError(
        error,
        GENERIC_ERROR_MESSAGES.UNEXPECTED_ERROR
      );
      showToast(errorMessage, "error");
    } finally {
      if (res) {
        invalidateCache();
        fetchColumns(true);
      }
      onClickCancel();
      setLoading(false);
    }
  }

  return (
    <>
      {/* Title, description, and close btn */}
      <div className="flex flex-col gap-3">
        <h3 className="font-medium text-2xl">New Task</h3>
        <p className="text-gray-500 text-sm">
          Create a new task for the backlog. Fill out the details below.
        </p>
      </div>
      {/* New Task fields */}
      <form className="mt-5 flex flex-col gap-4" onSubmit={handleSubmit}>
        {/* Task Description */}
        <div className="grid grid-cols-3 items-center">
          <label htmlFor="task-description">Description</label>
          <input
            id="task-description"
            className="col-span-2 px-4 py-2 border rounded-md focus:outline-accent"
            placeholder="Do laundry..."
            value={description}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setDescription(e.target.value)
            }
          />
        </div>
        {/* Task Priority */}
        <div className="grid grid-cols-3 items-center">
          <label htmlFor="task-priority">Priority</label>
          <select
            className="col-span-2 px-4 py-2 border rounded-md focus:outline-accent"
            id="task-priority"
            value={priority}
            onChange={(e: ChangeEvent<HTMLSelectElement>) =>
              setPriority(e.target.value)
            }
          >
            <option value="">Select priority</option>
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>
        </div>
        {/* Due Date */}
        <div className="grid grid-cols-3 items-center">
          <label htmlFor="task-due-date">Due Date</label>
          <input
            id="task-due-date"
            type="date"
            className="col-span-2 px-4 py-2 border rounded-md focus:outline-accent"
            value={dueDate}
            min={new Date().toISOString().split("T")[0]}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setDueDate(e.target.value)
            }
          />
        </div>
        {/* Task Type */}
        <div className="grid grid-cols-3 items-center">
          <label htmlFor="task-type">Type</label>
          <select
            className="col-span-2 px-4 py-2 border rounded-md focus:outline-accent"
            id="task-type"
            value={taskType}
            onChange={(e: ChangeEvent<HTMLSelectElement>) =>
              setTaskType(e.target.value)
            }
          >
            <option value="">Select type</option>
            {TASK_TYPE_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        {/* Submit buttons */}
        <div className="grid grid-cols-2 gap-10">
          <CustomButton
            label={"Cancel"}
            type="button"
            onClick={onClickCancel}
          />
          <CustomButton
            label={type[0].toUpperCase() + type.slice(1)}
            type="submit"
            loading={loading}
          />
        </div>
      </form>
    </>
  );
}
