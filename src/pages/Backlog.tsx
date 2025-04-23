import { ChangeEvent, FormEvent, useState } from "react";
import CustomButton from "../components/input/customButton";
import SearchAndFilter from "../components/input/SearchAndFilter";
import Header from "../components/navigation/Header";
import createNewTask from "../api/tasks/createNewTask";
import { TaskInput } from "../models/board/Task";

export default function Backlog() {
  const [isExpanded, setIsExpanded] = useState<boolean>(false);

  // Form state
  const [description, setDescription] = useState<string>("");
  const [priority, setPriority] = useState<string>("");
  const [dueDate, setDueDate] = useState<string>("");
  const [dueTime, setDueTime] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setLoading(true);

    const date = new Date(dueDate);
    const newTask: TaskInput = {
      description,
      dueDate: date,
      dueTime,
      priority,
    };
    await createNewTask(newTask);
    setLoading(false);
    setIsExpanded(false);
  }

  return (
    <div className="flex flex-col gap-5 lg:flex-row">
      <Header />
      <div className="flex flex-col gap-5 px-8">
        <h1 className="text-3xl font-bold">Backlog</h1>
        <SearchAndFilter />
        <CustomButton
          label={"Create Task"}
          onClick={() => setIsExpanded(!isExpanded)}
        />
      </div>
      <div className={`${isExpanded ? "" : "hidden"}`}>
        <div className="flex items-center justify-center">
          <div className="fixed bg-accent opacity-65 w-screen h-screen border z-0 top-0"></div>
          <div className="fixed bg-primary rounded-md z-10 p-5 w-5/6">
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
                  <option value="">Select task priority</option>
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
                  onClick={() => setIsExpanded(!isExpanded)}
                />
                <CustomButton
                  label={"Create"}
                  type="submit"
                  loading={loading}
                />
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
