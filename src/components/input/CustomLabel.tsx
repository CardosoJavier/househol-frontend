export default function CustomLabel({
  forItem,
  label,
}: {
  forItem: string;
  label: string;
}) {
  return (
    <label className="text-accent text-base font-semibold" htmlFor={forItem}>
      {label}
    </label>
  );
}
