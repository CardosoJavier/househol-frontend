import { useState } from "react";
import { List, X } from "react-bootstrap-icons";
import { useNavigate } from "react-router";
import Logo from "../tags/logo";
import CustomButton from "../input/customButton";
import { createClient } from "../../utils";
import { useColumns } from "../../context";

type NavigationLink = {
  label: String;
  link: string;
};

export default function Navbar() {
  const supabase = createClient();
  const navigate = useNavigate();
  const { setColumns } = useColumns();

  const [isExpanded, setIsExpanded] = useState<boolean>(false);

  const navLinks: NavigationLink[] = [
    { label: "Projects", link: "/projects" },
    { label: "Profile", link: "/profile" },
  ];

  async function handleSignOut() {
    const { error } = await supabase.auth.signOut();

    if (error) console.log(error.message);

    setColumns([]);
    sessionStorage.clear();
    navigate("/auth/login");
  }

  function SidebarContent() {
    return (
      <div className="flex flex-col gap-5 w-full h-full">
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
        <div className="flex flex-col h-full justify-between">
          <div className="grid grid-cols-1 gap-3">
            {navLinks.map((navLink: NavigationLink, index: number) => (
              <CustomButton
                label={navLink.label}
                onClick={() => navigate(navLink.link)}
                key={index}
              />
            ))}
          </div>
          <CustomButton label={"Log out"} onClick={handleSignOut} />
        </div>
      </div>
    );
  }

  return (
    <nav className="h-full lg:min-h-screen">
      {/* Toggle btn */}
      <button
        className={` ${
          isExpanded
            ? "invisible"
            : "border border-accent rounded-md p-1 bg-accent lg:hidden"
        } `}
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
      <div className="hidden lg:flex lg:justify-center lg:min-h-fit lg:h-full lg:w-80 lg:bg-gray-100">
        <div
          style={{ height: "calc(100vh - 1.5rem)" }}
          className="sticky top-0"
        >
          <SidebarContent />
        </div>
      </div>
    </nav>
  );
}
