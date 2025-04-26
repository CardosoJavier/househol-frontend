export default function GroupContainer({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-md outline outline-2 outline-secondary bg-transparent">
      {children}
    </div>
  );
}
