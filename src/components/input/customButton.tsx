import { useState } from "react";
import { PulseLoader } from "react-spinners";

export default function CustomButton({
  label,
  onClick = null,
  type,
  loading = false,
}: {
  label: String | React.ReactElement;
  onClick?: any;
  type?: "submit" | "reset" | "button" | undefined;
  loading?: boolean;
}) {
  const [isHovered, setIsHovered] = useState<boolean>(false);

  return (
    <button
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={onClick}
      type={type}
      className="border border-accent px-4 py-2 text-primary bg-accent rounded-md text-base duration-200 ease-linear hover:text-accent hover:bg-primary"
    >
      {loading ? (
        <PulseLoader size={5} color={isHovered ? "#4f46e5" : "#FFFFFF"} />
      ) : (
        label
      )}
    </button>
  );
}
