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
      className="border border-black px-4 py-2 text-white bg-black rounded-md text-base hover:text-black hover:bg-white"
    >
      {label}
    </button>
  );
}
