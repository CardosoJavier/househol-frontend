export default function CustomButton({ label }: { label: String }) {
  return (
    <button className="border border-black px-4 py-2 text-white bg-black rounded-md text-base">
      {label}
    </button>
  );
}
