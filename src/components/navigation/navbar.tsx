import { useState } from "react";
import { List, X } from "react-bootstrap-icons";
import { NavLink } from "react-router";
import Logo from "../tags/logo";

type NavigationLink = {
  label: String;
  link: string;
};

export default function Navbar() {
  const [isExpanded, setIsExpanded] = useState<boolean>(false);

  const navLinks: NavigationLink[] = [
    { label: "Board", link: "/board" },
    { label: "Backlog", link: "/backlog" },
    { label: "Management", link: "/management" },
    { label: "Profile", link: "/profile" },
  ];

  function SidebarContent() {
    return (
      <div className="flex flex-col gap-5 w-full">
        {/* Header */}
        <div className="flex flex-row justify-between">
          <div className="lg:flex lg:flex-row lg:gap-5 lg:mt-10">
            <div className="hidden lg:block">
              <Logo size={32} />
            </div>
            <h1 className="text-2xl font-bold">Choreboard</h1>
          </div>
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="flex border border-accent rounded-md justify-center items-center bg-accent lg:hidden"
          >
            <X size={28} color="white" />
          </button>
        </div>
        {/* Links */}
        <div className="grid grid-cols-1 gap-3">
          {navLinks.map((navLink: NavigationLink, index: number) => (
            <NavLink
              key={index}
              to={navLink.link}
              className={`flex justify-center px-4 py-2 text-primary bg-accent rounded-md text-base hover:text-accent hover:bg-primary hover:outline hover:outline-accent`}
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
        className={`border border-accent rounded-md p-1 bg-accent ${
          isExpanded ? " invisible" : ""
        } lg:hidden`}
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <List color="white" size={28} />
      </button>

      {/* Mobile & Tablet view */}
      <div
        className={`fixed h-screen rounded-r-lg bg-primary z-50 left-0 top-0 w-2/3 p-5 transition-transform ease-in-out duration-300 ${
          isExpanded ? "translate-x-0" : "-translate-x-full"
        } md:w-2/5 lg:hidden`}
      >
        <SidebarContent />
      </div>

      <div
        className={`h-screen w-screen fixed bg-gray-500 left-0 top-0 opacity-50 z-0 duration-300 ${
          isExpanded ? "translate-y-0" : "-translate-y-full"
        } lg:hidden`}
      ></div>
      {/* Desktop Sidebar */}
      <div className="hidden lg:flex lg:h-screen lg:w-80 lg:px-10 lg:bg-gray-100 lg:mr-10">
        <SidebarContent />
      </div>
    </nav>
  );
}
