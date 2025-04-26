import { useState } from "react";
import { PulseLoader } from "react-spinners";

export default function CustomButton({
  label,
  onClick = null,
  type = "button",
  loading = false,
  border = "square",
}: {
  label: String | React.ReactElement;
  onClick?: any;
  type?: "submit" | "reset" | "button" | undefined;
  loading?: boolean;
  border?: "square" | "circle";
}) {
  const [isHovered, setIsHovered] = useState<boolean>(false);

  return (
    <button
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={onClick}
      type={type}
      className={`w-full text-center min-h-10 border border-accent  text-primary bg-accent ${
        border === "square" ? "rounded-md px-4 py-2" : "rounded-full px-2 py-2"
      } text-base duration-200 ease-linear hover:text-accent hover:bg-primary`}
    >
      {loading ? (
        <PulseLoader size={5} color={isHovered ? "#4f46e5" : "#FFFFFF"} />
      ) : (
        label
      )}
    </button>
  );
}
