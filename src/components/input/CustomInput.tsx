export default function CustomInput({
  placeholder,
  type,
  id,
  value,
  name,
  onChange,
  isDisabled = false,
}: {
  id: string;
  name: string;
  type: string;
  placeholder?: string;
  value?: any;
  onChange?: any;
  isDisabled?: boolean;
}) {
  return (
    <input
      className={`h-10 w-full bg-transparent outline outline-secondary 
                rounded-md px-2 py-3 text-accent text-sm focus-visible:outline-none 
                duration-200 ease-linear focus-visible:ring-2 focus-within:ring-accent
                ${isDisabled ? "bg-gray-200" : ""}
                ${type === "file" ? "hidden" : ""}
                `}
      placeholder={placeholder}
      type={type}
      id={id}
      value={value}
      onChange={onChange}
      name={name}
      disabled={isDisabled}
    />
  );
}
