export default function TypeTag({ type }: { type?: string }) {
  const getTypeStyles = (taskType: string | undefined) => {
    if (!taskType) {
      return {
        bg: "bg-gray-100",
        text: "text-gray-700",
      };
    }

    switch (taskType.toLowerCase()) {
      case "feature":
        return {
          bg: "bg-green-100",
          text: "text-green-700",
        };
      case "bug":
        return {
          bg: "bg-red-100",
          text: "text-red-700",
        };
      case "improvement":
        return {
          bg: "bg-blue-100",
          text: "text-blue-700",
        };
      case "maintenance":
        return {
          bg: "bg-yellow-100",
          text: "text-yellow-700",
        };
      case "documentation":
        return {
          bg: "bg-purple-100",
          text: "text-purple-700",
        };
      case "testing":
        return {
          bg: "bg-indigo-100",
          text: "text-indigo-700",
        };
      case "research":
        return {
          bg: "bg-pink-100",
          text: "text-pink-700",
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
        {type || "other"}
      </p>
    </div>
  );
}
