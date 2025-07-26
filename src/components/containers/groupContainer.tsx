export default function GroupContainer({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-lg border border-gray-200 bg-white shadow-sm">
      {children}
    </div>
  );
}
