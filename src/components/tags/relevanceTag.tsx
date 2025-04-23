export default function RelevanceTag({ priority }: { priority: string }) {
  return (
    <div
      className={`flex items-center justify-center ${
        priority === "high"
          ? "bg-red-100"
          : priority === "medium"
          ? "bg-orange-100"
          : "bg-blue-100"
      } w-fit rounded-lg`}
    >
      <p
        className={`${
          priority === "high"
            ? "text-red-700"
            : priority === "medium"
            ? "text-orange-700"
            : "text-blue-700"
        } text-xs font-bold px-2`}
      >
        {priority}
      </p>
    </div>
  );
}
