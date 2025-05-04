export default function CustomLabel({
  forItem,
  label,
  inputType,
}: {
  forItem: string;
  label: string;
  inputType?: string;
}) {
  return (
    <label
      className={`text-accent text-base font-semibold ${
        inputType === "file" ? "hover:underline cursor-pointer" : ""
      }`}
      htmlFor={forItem}
    >
      {label}
    </label>
  );
}
