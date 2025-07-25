import React, { FormEvent, useState } from "react";
import CustomButton from "./customButton";
import { createNewProject } from "../../api/projects/createNewProject";
import { updateProjectById } from "../../api/projects/updateProjectById";
import { useProjectContext } from "../../context/ProjectContext";
import { showToast } from "../notifications/CustomToast";
import {
  GENERIC_ERROR_MESSAGES,
  GENERIC_SUCCESS_MESSAGES,
  handleError,
} from "../../constants";
import { ProjectResponse } from "../../models";

interface ProjectFormProps {
  onClickCancel: () => void;
  type?: "create" | "update";
  projectData?: ProjectResponse;
}

export default function ProjectForm({
  onClickCancel,
  type = "create",
  projectData,
}: ProjectFormProps) {
  // Form state
  const { refreshProjects } = useProjectContext();
  const [projectName, setProjectName] = useState<string>(
    projectData?.name || ""
  );
  const [loading, setLoading] = useState<boolean>(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();

    try {
      setLoading(true);
      let success: boolean = false;

      if (type === "create") {
        success = await createNewProject(projectName);
      } else if (type === "update" && projectData) {
        // Check if the name has actually changed
        if (projectName.trim() === projectData.name.trim()) {
          showToast(GENERIC_SUCCESS_MESSAGES.NO_CHANGES_DETECTED, "info");
          return;
        }

        success = await updateProjectById({
          id: projectData.id,
          name: projectName,
        });
      }

      if (success) refreshProjects();
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

  const isCreate = type === "create";
  const title = isCreate ? "New Project" : "Edit Project";
  const description = isCreate
    ? "Create a new project. Fill out the details below."
    : "Update project details below.";
  const submitLabel = isCreate ? "Create" : "Update";

  return (
    <>
      {/* Title, description, and close btn */}
      <div className="flex flex-col gap-3">
        <h3 className="font-medium text-2xl">{title}</h3>
        <p className="text-gray-500 text-sm">{description}</p>
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
          <CustomButton label={submitLabel} type="submit" loading={loading} />
        </div>
      </form>
    </>
  );
}
