export default function CustomButton({
  label,
  onClick = null,
}: {
  label: String;
  onClick?: any;
}) {
  return (
    <button
      onClick={onClick}
      className="border border-accent px-4 py-2 text-primary bg-accent rounded-md text-base hover:text-accent hover:bg-primary"
    >
      {label}
    </button>
  );
}
