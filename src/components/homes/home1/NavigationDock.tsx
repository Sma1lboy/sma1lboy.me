import {
  Activity,
  Code,
  FlaskConical,
  FolderOpen,
  Github,
  Home as HomeIcon,
  Linkedin,
  Mail,
  Twitter,
  User,
} from "lucide-react";
import { useNavigate } from "@tanstack/react-router";
import { Dock, DockIcon } from "../../magicui/dock";
import { ThemeToggle } from "../../theme/ThemeToggle";

interface NavigationDockProps {
  activeSection: string;
  scrollToSection: (sectionId: string) => void;
}

const activeClass =
  "bg-gray-200 shadow-lg ring-2 ring-gray-300 dark:bg-[#151515] dark:ring-[#2a2a2a]";
const inactiveClass =
  "hover:bg-gray-100 active:bg-gray-200 dark:hover:bg-[#0a0a0a] dark:active:bg-[#151515]";

function iconColor(active: boolean) {
  return active
    ? "text-gray-800 dark:text-gray-200"
    : "text-gray-700 dark:text-gray-300";
}

export function NavigationDock({ activeSection, scrollToSection }: NavigationDockProps) {
  const navigate = useNavigate();
  return (
    <div className="fixed bottom-3 left-1/2 z-50 -translate-x-1/2 transform sm:bottom-4">
      <Dock className="px-2 py-1 sm:px-3 sm:py-2">
        <DockIcon
          label="Home"
          onClick={() => scrollToSection("hero")}
          className={`touch-manipulation ${activeSection === "hero" ? activeClass : inactiveClass}`}
        >
          <HomeIcon
            size={18}
            className={`transition-colors duration-200 sm:size-5 ${iconColor(activeSection === "hero")}`}
          />
        </DockIcon>

        <DockIcon
          label="Projects"
          onClick={() => scrollToSection("projects")}
          className={`touch-manipulation ${activeSection === "projects" ? activeClass : inactiveClass}`}
        >
          <FolderOpen
            size={18}
            className={`transition-colors duration-200 sm:size-5 ${iconColor(activeSection === "projects")}`}
          />
        </DockIcon>

        <DockIcon
          label="Experience"
          onClick={() => scrollToSection("experience")}
          className={`touch-manipulation ${activeSection === "experience" ? activeClass : inactiveClass}`}
        >
          <User
            size={18}
            className={`transition-colors duration-200 sm:size-5 ${iconColor(activeSection === "experience")}`}
          />
        </DockIcon>

        <DockIcon
          label="Tech Stack"
          onClick={() => scrollToSection("tech-stack")}
          className={`touch-manipulation ${activeSection === "tech-stack" ? activeClass : inactiveClass}`}
        >
          <Code
            size={18}
            className={`transition-colors duration-200 sm:size-5 ${iconColor(activeSection === "tech-stack")}`}
          />
        </DockIcon>

        <DockIcon
          label="Activity"
          onClick={() => scrollToSection("github-activity")}
          className={`touch-manipulation ${activeSection === "github-activity" ? activeClass : inactiveClass}`}
        >
          <Activity
            size={18}
            className={`transition-colors duration-200 sm:size-5 ${iconColor(activeSection === "github-activity")}`}
          />
        </DockIcon>

        <DockIcon
          label="Lab"
          onClick={() => navigate({ to: "/apps" })}
          className={`touch-manipulation ${inactiveClass}`}
        >
          <FlaskConical
            size={18}
            className="text-gray-700 transition-colors duration-200 sm:size-5 dark:text-gray-300"
          />
        </DockIcon>

        {/* Divider */}
        <div className="mx-1 h-6 w-px bg-gray-300 sm:mx-2 sm:h-8 dark:bg-[#1a1a1a]" />

        <DockIcon
          label="GitHub"
          onClick={() => window.open("https://github.com/Sma1lboy", "_blank")}
          className={`touch-manipulation ${inactiveClass}`}
        >
          <Github size={18} className="text-gray-700 sm:size-5 dark:text-gray-300" />
        </DockIcon>

        <DockIcon
          label="Twitter"
          onClick={() => window.open("https://x.com/sma1lboy", "_blank")}
          className={`touch-manipulation ${inactiveClass}`}
        >
          <Twitter size={18} className="text-gray-700 sm:size-5 dark:text-gray-300" />
        </DockIcon>

        <DockIcon
          label="LinkedIn"
          onClick={() =>
            window.open("https://www.linkedin.com/in/chong-chen-857214292/", "_blank")
          }
          className={`touch-manipulation ${inactiveClass}`}
        >
          <Linkedin size={18} className="text-gray-700 sm:size-5 dark:text-gray-300" />
        </DockIcon>

        <DockIcon
          label="Email"
          onClick={() => window.open("mailto:541898146chen@gmail.com")}
          className={`touch-manipulation ${inactiveClass}`}
        >
          <Mail size={18} className="text-gray-700 sm:size-5 dark:text-gray-300" />
        </DockIcon>

        {/* Divider */}
        <div className="mx-1 h-6 w-px bg-gray-300 sm:mx-2 sm:h-8 dark:bg-[#1a1a1a]" />

        <DockIcon
          label="Theme"
          className="touch-manipulation hover:bg-gray-100 active:bg-gray-200 dark:hover:bg-gray-800 dark:active:bg-gray-700"
        >
          <ThemeToggle />
        </DockIcon>
      </Dock>
    </div>
  );
}
