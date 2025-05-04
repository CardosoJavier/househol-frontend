import { useState } from "react";
import { PulseLoader } from "react-spinners";

export default function CustomButton({
  label,
  onClick = null,
  type = "button",
  loading = false,
  border = "square",
  textSize,
  isDisabled = false,
}: {
  label: String | React.ReactElement;
  onClick?: any;
  type?: "submit" | "reset" | "button" | undefined;
  loading?: boolean;
  border?: "square" | "circle";
  textSize?: "xs" | "sm" | "base" | "lg";
  isDisabled?: boolean;
}) {
  const [isHovered, setIsHovered] = useState<boolean>(false);

  return (
    <button
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={onClick}
      type={type}
      disabled={isDisabled}
      className={`w-full text-center min-h-10 border border-accent text-primary bg-accent duration-200 ease-linear  ${
        border === "square" ? "rounded-md" : "rounded-full"
      }  ${
        isDisabled
          ? "bg-gray-500 border-primary"
          : "hover:text-accent hover:bg-primary "
      } ${
        textSize === "xs"
          ? "text-xs"
          : textSize === "sm"
          ? "text-sm p-1"
          : textSize === "base"
          ? "text-base px-4 py-2"
          : textSize === "lg"
          ? "text-lg px-4 py-2"
          : "text-base px-4 py-2"
      }`}
    >
      {loading ? (
        <PulseLoader size={5} color={isHovered ? "#4f46e5" : "#FFFFFF"} />
      ) : (
        label
      )}
    </button>
  );
}
