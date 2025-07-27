import { useState } from "react";
import { useLocation, useNavigate } from "react-router";
import Logo from "../tags/logo";
import CustomButton from "../input/customButton";
import { useAuth, useColumns } from "../../context";
import { showToast } from "../notifications/CustomToast";
import { GENERIC_ERROR_MESSAGES, handleError } from "../../constants";

// Modern icons from react-icons
import { HiMenu, HiX, HiFolderOpen, HiUser, HiLogout } from "react-icons/hi";

type NavigationLink = {
  label: String;
  link: string;
};

export default function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const { setColumns } = useColumns();
  const { logOut } = useAuth();

  const [isExpanded, setIsExpanded] = useState<boolean>(false);
  const [isLoggingOut, setIsLoggingOut] = useState<boolean>(false);

  const navLinks: NavigationLink[] = [
    { label: "Projects", link: "/" },
    { label: "Settings", link: "/profile" },
  ];

  const handleSignOut = async () => {
    try {
      setIsLoggingOut(true);
      setColumns([]);
      await logOut();
    } catch (error) {
      const errorMessage = handleError(
        error,
        GENERIC_ERROR_MESSAGES.UNEXPECTED_ERROR
      );
      showToast(errorMessage, "error");
    } finally {
      setIsLoggingOut(false);
    }
  };

  function SidebarContent() {
    return (
      <div className="flex flex-col h-full p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <div className="w-36 h-12">
              <Logo size={120} />
            </div>
          </div>
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="lg:hidden p-2 rounded-md hover:bg-gray-100 transition-colors"
          >
            <HiX size={20} className="text-gray-600" />
          </button>
        </div>

        {/* Navigation Links */}
        <div className="flex flex-col justify-between h-full">
          <nav className="space-y-2">
            {navLinks.map((navLink: NavigationLink, index: number) => {
              // Check if current route is active - for Projects, also check if we're on a project board
              const isActive =
                navLink.link === "/"
                  ? location.pathname === "/" ||
                    location.pathname === "/board" ||
                    location.pathname.startsWith("/project")
                  : location.pathname === navLink.link;
              const Icon = navLink.link === "/" ? HiFolderOpen : HiUser;

              return (
                <div key={index} className="relative">
                  <CustomButton
                    label={
                      <div className="flex items-center gap-3">
                        <Icon size={18} />
                        {navLink.label}
                      </div>
                    }
                    onClick={() => {
                      if (location.pathname !== navLink.link) {
                        navigate(navLink.link);
                        setIsExpanded(false);
                      }
                    }}
                    variant={isActive ? "default" : "ghost"}
                  />
                </div>
              );
            })}
          </nav>

          {/* Logout Button */}
          <CustomButton
            label={
              <div className="flex items-center gap-3">
                <HiLogout size={18} />
                {isLoggingOut ? "Logging out..." : "Log out"}
              </div>
            }
            onClick={handleSignOut}
            loading={isLoggingOut}
            isDisabled={isLoggingOut}
            variant="destructive"
          />
        </div>
      </div>
    );
  }

  return (
    <nav className="h-full lg:min-h-screen">
      {/* Mobile Header */}
      <div className="lg:hidden flex items-center justify-between p-4 bg-white border-b border-gray-200">
        <div className="flex items-center gap-3 w-36 h-12">
          <Logo size={120} />
        </div>
        <button
          className="p-2 rounded-md hover:bg-gray-100 transition-colors"
          onClick={() => setIsExpanded(!isExpanded)}
        >
          <HiMenu size={20} className="text-gray-700" />
        </button>
      </div>

      {/* Mobile Overlay */}
      {isExpanded && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden transition-opacity duration-300"
          onClick={() => setIsExpanded(false)}
        />
      )}

      {/* Mobile Sidebar */}
      <div
        className={`fixed top-0 left-0 h-full w-80 bg-white shadow-xl z-50 transform transition-transform duration-300 ease-in-out lg:hidden ${
          isExpanded ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <SidebarContent />
      </div>

      {/* Desktop Sidebar */}
      <div className="hidden lg:block lg:w-80 lg:h-full lg:bg-white lg:border-r lg:border-gray-200">
        <div className="sticky top-0 h-screen">
          <SidebarContent />
        </div>
      </div>
    </nav>
  );
}
