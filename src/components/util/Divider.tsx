export default function Divider({ label }: { label: string }) {
  return (
    <div className="flex flex-row items-center gap-5">
      <div className="h-px w-full bg-accent"></div>
      <p>{label}</p>
      <div className="h-px w-full bg-accent"></div>
    </div>
  );
}
