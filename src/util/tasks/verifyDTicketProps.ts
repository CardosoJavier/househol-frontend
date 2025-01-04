import { TaskProps } from "../../components/board/Task.types";

/*
 * Takes an object as a parameter, verifies its properties,
 * and returns the object as TaskProps if it matches the type.
 * Otherwise, returns undefined.
 *
 * @param maybeTask: unknown - Potential object of type TaskProps to be verified
 */
export default function verifyTaskProps(maybeTask: unknown): TaskProps | undefined {
  if (
    typeof maybeTask === "object" &&
    maybeTask !== null &&
    "id" in maybeTask &&
    typeof (maybeTask as TaskProps).id === "number" &&
    "description" in maybeTask &&
    typeof (maybeTask as TaskProps).description === "string" &&
    "dueDate" in maybeTask &&
    typeof (maybeTask as TaskProps).dueDate === "string" && // Will convert it to Date below
    "priority" in maybeTask &&
    typeof (maybeTask as TaskProps).priority === "string" &&
    "status" in maybeTask &&
    typeof (maybeTask as TaskProps).status === "string" &&
    "createdAt" in maybeTask &&
    typeof (maybeTask as TaskProps).createdAt === "string" && // Will convert it to Date below
    "userAccount" in maybeTask &&
    typeof (maybeTask as TaskProps).userAccount === "object" &&
    maybeTask.userAccount !== null && // Validate userAccount exists
    "columnId" in maybeTask &&
    typeof (maybeTask as TaskProps).columnId === "number"
  ) {
    const task = maybeTask as TaskProps;

    // Convert dueDate and createdAt from string to Date
    task.dueDate = new Date(task.dueDate);
    task.createdAt = new Date(task.createdAt);

    // Ensure both dates are valid
    if (isNaN(task.dueDate.getTime()) || isNaN(task.createdAt.getTime())) {
      return undefined; // Return undefined if date conversion fails
    }

    return task;
  }

  return undefined;
}
