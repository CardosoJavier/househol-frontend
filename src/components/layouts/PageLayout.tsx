import Header from "../navigation/Header";

export default function PageLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="lg:flex">
      <Header />
      <div className="gap-4 px-8 mt-8 w-full h-full">{children}</div>
    </div>
  );
}
