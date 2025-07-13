import React, { ChangeEvent, FormEvent, useState } from "react";
import CustomButton from "./customButton";
import { createNewTask, updateTaskById } from "../../api";
import { TaskInput } from "../../models";
import { useColumns } from "../../context";
import { useSearchParams } from "react-router";

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
    alert("Invalid project id");
    return false;
  }

  // Form state
  const [description, setDescription] = useState<string>(
    taskData?.description ? taskData.description : ""
  );
  const [priority, setPriority] = useState<string>(
    taskData?.priority ? taskData.priority : ""
  );
  const [dueDate, setDueDate] = useState<string>(
    taskData?.dueDate ? taskData.dueDate.toString() : ""
  );
  const [dueTime, setDueTime] = useState<string>(
    taskData?.dueTime ? taskData.dueTime.slice(0, 8) : ""
  );
  const [loading, setLoading] = useState<boolean>(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();

    try {
      setLoading(true);

      const date = new Date(dueDate);
      const task: TaskInput = {
        id: taskData?.id ?? "",
        description,
        dueDate: date,
        dueTime,
        priority,
        projectId: projectId as string,
      };

      switch (type) {
        case "create":
          await createNewTask(task);
          break;
        case "update":
          await updateTaskById(task);
          break;
      }
    } catch (error) {
      console.error(error);
    } finally {
      invalidateCache();
      fetchColumns(true);
      setLoading(false);
      onClickCancel();
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
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setDueDate(e.target.value)
            }
          />
        </div>
        {/* Time */}
        <div className="grid grid-cols-3 items-center">
          <label htmlFor="task-time">At Time</label>
          <input
            id="task-time"
            type="time"
            className="col-span-2 px-4 py-2 border rounded-md focus:outline-accent"
            value={dueTime}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setDueTime(e.target.value)
            }
          />
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
