export default function CustomInput({
  placeholder,
  type,
  id,
}: {
  placeholder?: string;
  type: string;
  id: string;
}) {
  return (
    <input
      className="h-10 w-full bg-transparent outline outline-secondary rounded-md px-2 py-3 text-accent text-sm focus-visible:outline-none focus-visible:ring-2 focus-within:ring-accent"
      placeholder={placeholder}
      type={type}
      id={id}
    />
  );
}
