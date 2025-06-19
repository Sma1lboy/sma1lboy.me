import { FolderOpen, Github, Home as HomeIcon, Linkedin, Mail, Twitter } from "lucide-react";
import { Dock, DockIcon } from "../magicui/dock";

interface NavigationDockProps {
  activeSection: string;
  scrollToSection: (sectionId: string) => void;
}

export function NavigationDock({ activeSection, scrollToSection }: NavigationDockProps) {
  return (
    <div className="fixed bottom-4 left-1/2 z-50 -translate-x-1/2 transform">
      <Dock>
        {/* Home/Navigation */}
        <DockIcon
          onClick={() => scrollToSection("hero")}
          className={`${
            activeSection === "hero"
              ? "bg-blue-100 shadow-lg ring-2 ring-blue-300 dark:bg-blue-900 dark:ring-blue-600"
              : "hover:bg-gray-100 dark:hover:bg-gray-800"
          }`}
        >
          <HomeIcon
            size={20}
            className={`transition-colors duration-200 ${
              activeSection === "hero"
                ? "text-blue-600 dark:text-blue-400"
                : "text-gray-700 dark:text-gray-300"
            }`}
          />
        </DockIcon>

        {/* Projects */}
        <DockIcon
          onClick={() => scrollToSection("projects")}
          className={`${
            activeSection === "projects"
              ? "bg-blue-100 shadow-lg ring-2 ring-blue-300 dark:bg-blue-900 dark:ring-blue-600"
              : "hover:bg-gray-100 dark:hover:bg-gray-800"
          }`}
        >
          <FolderOpen
            size={20}
            className={`transition-colors duration-200 ${
              activeSection === "projects"
                ? "text-blue-600 dark:text-blue-400"
                : "text-gray-700 dark:text-gray-300"
            }`}
          />
        </DockIcon>

        {/* Divider */}
        <div className="mx-2 h-8 w-px bg-gray-300 dark:bg-gray-600"></div>

        {/* Social Media Section */}
        <DockIcon
          onClick={() => window.open("https://github.com/Sma1lboy", "_blank")}
          className="hover:bg-gray-100 dark:hover:bg-gray-800"
        >
          <Github size={20} className="text-gray-700 dark:text-gray-300" />
        </DockIcon>

        <DockIcon
          onClick={() => window.open("https://x.com/sma1lboy", "_blank")}
          className="hover:bg-gray-100 dark:hover:bg-gray-800"
        >
          <Twitter size={20} className="text-gray-700 dark:text-gray-300" />
        </DockIcon>

        <DockIcon
          onClick={() => window.open("https://www.linkedin.com/in/chong-chen-857214292/", "_blank")}
          className="hover:bg-gray-100 dark:hover:bg-gray-800"
        >
          <Linkedin size={20} className="text-gray-700 dark:text-gray-300" />
        </DockIcon>

        <DockIcon
          onClick={() => window.open("mailto:jackson@example.com")}
          className="hover:bg-gray-100 dark:hover:bg-gray-800"
        >
          <Mail size={20} className="text-gray-700 dark:text-gray-300" />
        </DockIcon>
      </Dock>
    </div>
  );
}
