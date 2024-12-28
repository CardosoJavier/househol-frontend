import { useState } from "react";
import { List, X } from "react-bootstrap-icons";
import { NavLink } from "react-router";

type NavigationLink = {
  label: String;
  link: string;
};

export default function Navbar() {
  const [isExpanded, setIsExpanded] = useState<boolean>(false);

  const navLinks: NavigationLink[] = [
    { label: "Board", link: "/board" },
    { label: "Backlog", link: "/" },
    { label: "Management", link: "" },
    { label: "Profile", link: "" },
  ];

  function SidebarContent() {
    return (
      <div className="flex flex-col gap-5 w-full">
        <div className="flex flex-row justify-between">
          <h1 className="text-2xl font-bold">Choreboard</h1>
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="flex border border-black rounded-md justify-center items-center bg-black"
          >
            <X size={28} color="white" />
          </button>
        </div>
        <div className="grid grid-cols-1 gap-3">
          {navLinks.map((navLink: NavigationLink, index: number) => (
            <NavLink
              key={index}
              to={navLink.link}
              className={`flex justify-center border border-black px-4 py-2 text-white bg-black rounded-md text-base hover:text-black hover:bg-white`}
            >
              {navLink.label}
            </NavLink>
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
        className={`fixed h-screen rounded-r-lg bg-white z-50 left-0 top-0 w-2/3 p-5 transition-transform ease-in-out duration-300 ${
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
