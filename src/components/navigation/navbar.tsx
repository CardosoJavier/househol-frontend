import { useState } from "react";
import { List, X } from "react-bootstrap-icons";
import CustomButton from "../input/customButton";

type NavLink = {
  label: String;
  link: String;
};

export default function Navbar() {
  const [isExpanded, setIsExpanded] = useState<boolean>(false);

  const navLinks: NavLink[] = [
    { label: "Board", link: "" },
    { label: "Backlog", link: "" },
    { label: "Management", link: "" },
    { label: "Profile", link: "" },
  ];

  function SidebarContent() {
    return (
      <div className="flex flex-col gap-5">
        <div className="flex flex-row justify-between">
          <h1 className="text-2xl font-bold">Choreboad</h1>
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="flex border border-black rounded-md justify-center items-center bg-black"
          >
            <X size={28} color="white" />
          </button>
        </div>
        <div className="grid grid-cols-1 gap-3">
          {navLinks.map((navLink: NavLink) => (
            <CustomButton label={navLink.label} />
          ))}
        </div>
      </div>
    );
  }

  return (
    <nav>
      {/* Toggle btn */}
      <button
        className={`border border-black rounded-md p-1 bg-black ${
          isExpanded ? " invisible" : ""
        }`}
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <List color="white" size={28} />
      </button>

      {/* Mobile view */}
      <div
        className={`fixed h-screen bg-white z-50 left-0 top-0 w-2/3 p-5 transition-transform ease-in-out duration-300 ${
          isExpanded ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <SidebarContent />
      </div>
      <div
        className={`h-screen w-screen fixed bg-gray-500 left-0 top-0 opacity-50 z-0 duration-300 ${
          isExpanded ? "translate-y-0" : "-translate-y-full"
        }`}
      ></div>
    </nav>
  );
}
