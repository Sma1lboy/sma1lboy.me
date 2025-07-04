import {
  Code,
  FolderOpen,
  Github,
  Home as HomeIcon,
  Linkedin,
  Mail,
  Twitter,
  User,
} from "lucide-react";
import { Dock, DockIcon } from "../magicui/dock";

interface NavigationDockProps {
  activeSection: string;
  scrollToSection: (sectionId: string) => void;
}

export function NavigationDock({ activeSection, scrollToSection }: NavigationDockProps) {
  const handleFriendsClick = () => {
    window.location.href = "/friends";
  };

  return (
    <div className="fixed bottom-3 left-1/2 z-50 -translate-x-1/2 transform sm:bottom-4">
      <Dock className="px-2 py-1 sm:px-3 sm:py-2">
        {/* Home/Navigation */}
        <DockIcon
          onClick={() => scrollToSection("hero")}
          className={`touch-manipulation ${
            activeSection === "hero"
              ? "bg-gray-200 shadow-lg ring-2 ring-gray-300 dark:bg-gray-700 dark:ring-gray-600"
              : "hover:bg-gray-100 active:bg-gray-200 dark:hover:bg-gray-800 dark:active:bg-gray-700"
          }`}
        >
          <HomeIcon
            size={18}
            className={`transition-colors duration-200 sm:size-5 ${
              activeSection === "hero"
                ? "text-gray-800 dark:text-gray-200"
                : "text-gray-700 dark:text-gray-300"
            }`}
          />
        </DockIcon>

        {/* Projects */}
        <DockIcon
          onClick={() => scrollToSection("projects")}
          className={`touch-manipulation ${
            activeSection === "projects"
              ? "bg-gray-200 shadow-lg ring-2 ring-gray-300 dark:bg-gray-700 dark:ring-gray-600"
              : "hover:bg-gray-100 active:bg-gray-200 dark:hover:bg-gray-800 dark:active:bg-gray-700"
          }`}
        >
          <FolderOpen
            size={18}
            className={`transition-colors duration-200 sm:size-5 ${
              activeSection === "projects"
                ? "text-gray-800 dark:text-gray-200"
                : "text-gray-700 dark:text-gray-300"
            }`}
          />
        </DockIcon>

        {/* Experience */}
        <DockIcon
          onClick={() => scrollToSection("experience")}
          className={`touch-manipulation ${
            activeSection === "experience"
              ? "bg-gray-200 shadow-lg ring-2 ring-gray-300 dark:bg-gray-700 dark:ring-gray-600"
              : "hover:bg-gray-100 active:bg-gray-200 dark:hover:bg-gray-800 dark:active:bg-gray-700"
          }`}
        >
          <User
            size={18}
            className={`transition-colors duration-200 sm:size-5 ${
              activeSection === "experience"
                ? "text-gray-800 dark:text-gray-200"
                : "text-gray-700 dark:text-gray-300"
            }`}
          />
        </DockIcon>

        {/* Tech Stack */}
        <DockIcon
          onClick={() => scrollToSection("tech-stack")}
          className={`touch-manipulation ${
            activeSection === "tech-stack"
              ? "bg-gray-200 shadow-lg ring-2 ring-gray-300 dark:bg-gray-700 dark:ring-gray-600"
              : "hover:bg-gray-100 active:bg-gray-200 dark:hover:bg-gray-800 dark:active:bg-gray-700"
          }`}
        >
          <Code
            size={18}
            className={`transition-colors duration-200 sm:size-5 ${
              activeSection === "tech-stack"
                ? "text-gray-800 dark:text-gray-200"
                : "text-gray-700 dark:text-gray-300"
            }`}
          />
        </DockIcon>

        {/* Friends */}
        <DockIcon
          onClick={handleFriendsClick}
          className="touch-manipulation hover:bg-gray-100 active:bg-gray-200 dark:hover:bg-gray-800 dark:active:bg-gray-700"
        >
          <svg
            width={18}
            height={18}
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="text-gray-700 transition-colors duration-200 sm:size-5 dark:text-gray-300"
          >
            <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
            <circle cx="9" cy="7" r="4" />
            <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
            <path d="M16 3.13a4 4 0 0 1 0 7.75" />
          </svg>
        </DockIcon>

        {/* Divider */}
        <div className="mx-1 h-6 w-px bg-gray-300 sm:mx-2 sm:h-8 dark:bg-gray-600"></div>

        {/* Social Media Section */}
        <DockIcon
          onClick={() => window.open("https://github.com/Sma1lboy", "_blank")}
          className="touch-manipulation hover:bg-gray-100 active:bg-gray-200 dark:hover:bg-gray-800 dark:active:bg-gray-700"
        >
          <Github size={18} className="text-gray-700 sm:size-5 dark:text-gray-300" />
        </DockIcon>

        <DockIcon
          onClick={() => window.open("https://x.com/sma1lboy", "_blank")}
          className="touch-manipulation hover:bg-gray-100 active:bg-gray-200 dark:hover:bg-gray-800 dark:active:bg-gray-700"
        >
          <Twitter size={18} className="text-gray-700 sm:size-5 dark:text-gray-300" />
        </DockIcon>

        <DockIcon
          onClick={() => window.open("https://www.linkedin.com/in/chong-chen-857214292/", "_blank")}
          className="touch-manipulation hover:bg-gray-100 active:bg-gray-200 dark:hover:bg-gray-800 dark:active:bg-gray-700"
        >
          <Linkedin size={18} className="text-gray-700 sm:size-5 dark:text-gray-300" />
        </DockIcon>

        <DockIcon
          onClick={() => window.open("mailto:jackson@example.com")}
          className="touch-manipulation hover:bg-gray-100 active:bg-gray-200 dark:hover:bg-gray-800 dark:active:bg-gray-700"
        >
          <Mail size={18} className="text-gray-700 sm:size-5 dark:text-gray-300" />
        </DockIcon>
      </Dock>
    </div>
  );
}
