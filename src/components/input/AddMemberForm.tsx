import { FormEvent, useState } from "react";
import CustomButton from "./customButton";
import { addProjectMemberByEmail } from "../../api";
import { useProjectContext } from "../../context/ProjectContext";
import { showToast } from "../notifications/CustomToast";
import { GENERIC_ERROR_MESSAGES, handleError } from "../../constants";

export default function AddMemberForm({
  projectId,
  onClickCancel,
}: {
  projectId: string;
  onClickCancel: () => void;
}) {
  // Form state
  const [email, setEmail] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  // Context
  const { refreshProjects, invalidateProjectMembersCache } =
    useProjectContext();

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();

    if (!email.trim()) {
      showToast("Please enter an email address", "error");
      return;
    }

    try {
      setLoading(true);

      const success = await addProjectMemberByEmail({
        projectId,
        email: email.trim(),
      });

      if (success) {
        refreshProjects();
        invalidateProjectMembersCache(projectId); // Invalidate members cache
        onClickCancel();
      }
    } catch (error) {
      const errorMessage = handleError(
        error,
        GENERIC_ERROR_MESSAGES.MEMBER_ADD_FAILED
      );
      showToast(errorMessage, "error");
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      {/* Title and description */}
      <div className="flex flex-col gap-3">
        <h3 className="font-medium text-2xl">Add Team Member</h3>
        <p className="text-gray-500 text-sm">
          Enter the email address of the user you want to add to this project.
          The user must have a verified account to be added.
        </p>
      </div>

      {/* Add Member form */}
      <form className="mt-5 flex flex-col gap-4" onSubmit={handleSubmit}>
        {/* Email Input */}
        <div className="grid grid-cols-3 items-center">
          <label htmlFor="member-email">Email</label>
          <input
            id="member-email"
            type="email"
            className="col-span-2 px-4 py-2 border rounded-md focus:outline-accent"
            placeholder="user@example.com"
            value={email}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setEmail(e.target.value)
            }
            required
          />
        </div>

        {/* Submit buttons */}
        <div className="grid grid-cols-2 gap-10">
          <CustomButton label="Cancel" type="button" onClick={onClickCancel} />
          <CustomButton label="Add" type="submit" loading={loading} />
        </div>
      </form>
    </>
  );
}
