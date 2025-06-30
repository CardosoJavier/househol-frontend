import { ChangeEvent, FormEvent, useState } from "react";
import CustomButton from "./customButton";
import { createStatusColumn } from "../../api/columns/createStatusColumn";
import { useColumns } from "../../context";

export default function ColumnForm({
  projectId,
  onClickCancel,
}: {
  projectId: string | null;
  onClickCancel: () => void;
}) {
  const { fetchColumns } = useColumns();

  const [title, setTitle] = useState<string>("");
  const [status, setStatus] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!projectId) {
      // Optionally, show an error message or handle as needed
      alert("Project ID is missing. Cannot create column.");
      return;
    }
    setLoading(true);
    try {
      await createStatusColumn({ title, status, projectId });
      fetchColumns();
      onClickCancel();
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  if (!projectId) {
    return (
      <div className="text-red-500">
        Project ID is missing. Cannot create a new status column.
        <div className="mt-4">
          <CustomButton label="Back" type="button" onClick={onClickCancel} />
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="flex flex-col gap-3">
        <h3 className="font-medium text-2xl">New Status Column</h3>
        <p className="text-gray-500 text-sm">
          Create a new status column for this project.
        </p>
      </div>
      <form className="mt-5 flex flex-col gap-4" onSubmit={handleSubmit}>
        <div className="grid grid-cols-3 items-center">
          <label htmlFor="column-title">Title</label>
          <input
            id="column-title"
            className="col-span-2 px-4 py-2 border rounded-md focus:outline-accent"
            placeholder="To Do"
            value={title}
            onChange={(e: ChangeEvent<HTMLInputElement>) =>
              setTitle(e.target.value)
            }
            required
          />
        </div>
        <div className="grid grid-cols-3 items-center">
          <label htmlFor="column-status">Status</label>
          <input
            id="column-status"
            className="col-span-2 px-4 py-2 border rounded-md focus:outline-accent"
            placeholder="pending"
            value={status}
            onChange={(e: ChangeEvent<HTMLInputElement>) =>
              setStatus(e.target.value)
            }
            required
          />
        </div>
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
