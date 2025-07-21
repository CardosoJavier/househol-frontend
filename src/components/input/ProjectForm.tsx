import React, { FormEvent, useState } from "react";
import CustomButton from "./customButton";
import { createNewProject } from "../../api/projects/createNewProject";
import { useProjectContext } from "../../context/ProjectContext";
import { showToast } from "../notifications/CustomToast";
import { GENERIC_ERROR_MESSAGES, handleError } from "../../constants";

export default function ProjectForm({ onClickCancel }: { onClickCancel: any }) {
  // Form state
  const { refreshProjects } = useProjectContext();
  const [projectName, setProjectName] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();

    try {
      setLoading(true);
      const projectCreated: boolean = await createNewProject(projectName);
      if (projectCreated) refreshProjects();
    } catch (error) {
      const errorMessage = handleError(
        error,
        GENERIC_ERROR_MESSAGES.DATABASE_ERROR
      );
      showToast(errorMessage, "error");
    } finally {
      setLoading(false);
      onClickCancel();
    }
  }

  return (
    <>
      {/* Title, description, and close btn */}
      <div className="flex flex-col gap-3">
        <h3 className="font-medium text-2xl">New Project</h3>
        <p className="text-gray-500 text-sm">
          Create a new project. Fill out the details below.
        </p>
      </div>
      {/* New Task fields */}
      <form className="mt-5 flex flex-col gap-4" onSubmit={handleSubmit}>
        {/* Project Name */}
        <div className="grid grid-cols-3 items-center">
          <label htmlFor="project-name">Project Name</label>
          <input
            id="project-name"
            className="col-span-2 px-4 py-2 border rounded-md focus:outline-accent"
            placeholder="Househol"
            value={projectName}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setProjectName(e.target.value)
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
          <CustomButton label={"Create"} type="submit" loading={loading} />
        </div>
      </form>
    </>
  );
}
