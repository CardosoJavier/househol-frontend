import { FormEvent, useState } from "react";
import CustomButton from "../components/input/customButton";
import SearchAndFilter from "../components/input/SearchAndFilter";
import Header from "../components/navigation/Header";
import { X } from "react-bootstrap-icons";

export default function Backlog() {
  const [isExpanded, setIsExpanded] = useState<boolean>(false);

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
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
              <div className="flex flex-row justify-between items-center">
                <p className="text-2xl font-bold">Add New Task</p>
                <X />
              </div>
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
                />
              </div>
              {/* Task Priority */}
              <div className="grid grid-cols-3 items-center">
                <label htmlFor="task-priority">Priority</label>
                <select
                  className="col-span-2 px-4 py-2 border rounded-md focus:outline-accent"
                  name=""
                  id="task-priority"
                >
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
                />
              </div>
              {/* Time */}
              <div className="grid grid-cols-3 items-center">
                <label htmlFor="task-time">At Time</label>
                <input
                  id="task-time"
                  type="time"
                  className="col-span-2 px-4 py-2 border rounded-md focus:outline-accent"
                />
              </div>
              {/* Assignee */}
              <div className="grid grid-cols-3 items-center">
                <label htmlFor="task-owner">Assign to</label>
                <select
                  className="col-span-2 px-4 py-2 border rounded-md focus:outline-accent"
                  name=""
                  id="task-owner"
                >
                  <option value="low">Someone</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                </select>
              </div>
              {/* Submit buttons */}
              <div className="grid grid-cols-2 gap-10">
                <CustomButton label={"Create"} />
                <CustomButton
                  label={"Cancel"}
                  onClick={() => setIsExpanded(!isExpanded)}
                />
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
