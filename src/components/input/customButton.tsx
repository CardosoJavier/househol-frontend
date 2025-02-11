export default function CustomButton({
  label,
  onClick = null,
  type,
}: {
  label: String;
  onClick?: any;
  type?: "submit" | "reset" | "button" | undefined;
}) {
  return (
    <button
      onClick={onClick}
      type={type}
      className="border border-accent px-4 py-2 text-primary bg-accent rounded-md text-base hover:text-accent hover:bg-primary"
    >
      {label}
    </button>
  );
}
