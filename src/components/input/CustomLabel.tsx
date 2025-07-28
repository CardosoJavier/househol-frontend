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
      data-testid="custom-label"
      className={`text-accent text-sm font-medium ${
        inputType === "file" ? "hover:underline cursor-pointer" : ""
      }`}
      htmlFor={forItem}
    >
      {label}
    </label>
  );
}
