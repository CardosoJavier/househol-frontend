import Logo from "../tags/logo";
import Navbar from "./navbar";

export default function Header() {
  return (
    <div className="flex flex-row justify-between items-center py-4 px-8 bg-white border-b-2 lg:p-0">
      <div className="lg:hidden">
        <Logo size={38} />
      </div>
      <Navbar />
    </div>
  );
}
