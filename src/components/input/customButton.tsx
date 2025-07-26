import { PulseLoader } from "react-spinners";

export default function CustomButton({
  label,
  onClick = null,
  type = "button",
  loading = false,
  border = "square",
  textSize,
  isDisabled = false,
  variant = "default",
}: {
  label: String | React.ReactElement;
  onClick?: any;
  type?: "submit" | "reset" | "button" | undefined;
  loading?: boolean;
  border?: "square" | "circle";
  textSize?: "xs" | "sm" | "base" | "lg";
  isDisabled?: boolean;
  variant?: "default" | "ghost" | "destructive";
}) {


  const getVariantStyles = () => {
    switch (variant) {
      case "ghost":
        return "bg-transparent border-transparent text-gray-700 hover:bg-gray-100 hover:text-gray-900";
      case "destructive":
        return "bg-transparent border-transparent text-red-600 hover:bg-red-50 hover:text-red-700";
      case "default":
      default:
        return isDisabled
          ? "bg-gray-500 border-gray-500 text-white"
          : "bg-gray-900 border-gray-900 text-white hover:bg-gray-700";
    }
  };

  const getSizeStyles = () => {
    switch (textSize) {
      case "xs":
        return "text-xs px-2 py-1";
      case "sm":
        return "text-sm px-3 py-1.5";
      case "lg":
        return "text-lg px-6 py-3";
      case "base":
      default:
        return "text-sm px-4 py-2";
    }
  };

  return (
    <button

      onClick={onClick}
      type={type}
      disabled={isDisabled}
      className={`w-full text-center min-h-10 border font-medium transition-colors duration-200 ${
        border === "square" ? "rounded-md" : "rounded-full"
      } ${getVariantStyles()} ${getSizeStyles()} ${
        isDisabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"
      }`}
    >
      {loading ? (
        <PulseLoader
          size={5}
          color={
            variant === "default"
              ? "#FFFFFF"
              : variant === "destructive"
              ? "#dc2626"
              : "#374151"
          }
        />
      ) : (
        label
      )}
    </button>
  );
}
