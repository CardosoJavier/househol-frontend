import { TASK_TYPES } from "../../constants/taskTypes";

export default function TypeTag({ type }: { type?: string }) {
  const getTypeStyles = (taskType: string | undefined) => {
    if (!taskType) {
      return {
        bg: "bg-gray-100",
        text: "text-gray-700",
      };
    }

    switch (taskType.toLowerCase()) {
      case TASK_TYPES.FEATURE:
        return {
          bg: "bg-green-100",
          text: "text-green-700",
        };
      case TASK_TYPES.BUG:
        return {
          bg: "bg-red-100",
          text: "text-red-700",
        };
      case TASK_TYPES.REFACTOR:
        return {
          bg: "bg-blue-100",
          text: "text-blue-700",
        };
      case TASK_TYPES.MAINTENANCE:
        return {
          bg: "bg-yellow-100",
          text: "text-yellow-700",
        };
      case TASK_TYPES.DOCUMENTATION:
        return {
          bg: "bg-purple-100",
          text: "text-purple-700",
        };
      case TASK_TYPES.TESTING:
        return {
          bg: "bg-indigo-100",
          text: "text-indigo-700",
        };
      case TASK_TYPES.RESEARCH:
        return {
          bg: "bg-pink-100",
          text: "text-pink-700",
        };
      case TASK_TYPES.DESIGN:
        return {
          bg: "bg-violet-100",
          text: "text-violet-700",
        };
      default: // other
        return {
          bg: "bg-gray-100",
          text: "text-gray-700",
        };
    }
  };

  const styles = getTypeStyles(type);

  return (
    <div
      className={`flex items-center justify-center ${styles.bg} w-fit rounded-lg`}
    >
      <p className={`${styles.text} text-xs font-bold px-2`}>
        {type || TASK_TYPES.OTHER}
      </p>
    </div>
  );
}
