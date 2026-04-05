import {
  Activity,
  BarChart3,
  BookOpen,
  Code,
  FileText,
  FlaskConical,
  FolderOpen,
  GitBranch,
  Github,
  Home as HomeIcon,
  Image,
  Languages,
  Linkedin,
  ListOrdered,
  BookMarked,
  Mail,
  MessageSquare,
  MessageCircle,
  Monitor,
  PenLine,
  Twitter,
  User,
} from "lucide-react";
import { useNavigate } from "@tanstack/react-router";
import { Dock, DockIcon } from "../../magicui/dock";
import { ThemeToggle } from "../../theme/ThemeToggle";
import { useTranslation } from "@/i18n";
import { useLanguageStore } from "@/store/languageStore";

interface NavigationDockProps {
  activeSection: string;
  scrollToSection: (sectionId: string) => void;
}

const activeClass =
  "bg-gray-200 shadow-lg ring-2 ring-gray-300 dark:bg-[#151515] dark:ring-[#2a2a2a]";
const inactiveClass =
  "hover:bg-gray-100 active:bg-gray-200 dark:hover:bg-[#0a0a0a] dark:active:bg-[#151515]";

function iconColor(active: boolean) {
  return active ? "text-gray-800 dark:text-gray-200" : "text-gray-700 dark:text-gray-300";
}

export function NavigationDock({ activeSection, scrollToSection }: NavigationDockProps) {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { language, toggleLanguage } = useLanguageStore();

  return (
    <nav aria-label={t("nav.home")} className="fixed bottom-3 left-1/2 z-50 hidden -translate-x-1/2 transform md:block sm:bottom-4">
      <Dock className="px-2 py-1 sm:px-3 sm:py-2">
        <DockIcon
          label={t("nav.home")}
          onClick={() => scrollToSection("hero")}
          className={`touch-manipulation ${activeSection === "hero" ? activeClass : inactiveClass}`}
        >
          <HomeIcon
            size={18}
            className={`transition-colors duration-200 sm:size-5 ${iconColor(activeSection === "hero")}`}
          />
        </DockIcon>

        <DockIcon
          label={t("nav.projects")}
          onClick={() => scrollToSection("projects")}
          className={`touch-manipulation ${activeSection === "projects" ? activeClass : inactiveClass}`}
        >
          <FolderOpen
            size={18}
            className={`transition-colors duration-200 sm:size-5 ${iconColor(activeSection === "projects")}`}
          />
        </DockIcon>

        <DockIcon
          label={t("nav.experience")}
          onClick={() => scrollToSection("experience")}
          className={`touch-manipulation ${activeSection === "experience" ? activeClass : inactiveClass}`}
        >
          <User
            size={18}
            className={`transition-colors duration-200 sm:size-5 ${iconColor(activeSection === "experience")}`}
          />
        </DockIcon>

        <DockIcon
          label={t("nav.techStack")}
          onClick={() => scrollToSection("tech-stack")}
          className={`touch-manipulation ${activeSection === "tech-stack" ? activeClass : inactiveClass}`}
        >
          <Code
            size={18}
            className={`transition-colors duration-200 sm:size-5 ${iconColor(activeSection === "tech-stack")}`}
          />
        </DockIcon>

        <DockIcon
          label={t("nav.activity")}
          onClick={() => scrollToSection("github-activity")}
          className={`touch-manipulation ${activeSection === "github-activity" ? activeClass : inactiveClass}`}
        >
          <Activity
            size={18}
            className={`transition-colors duration-200 sm:size-5 ${iconColor(activeSection === "github-activity")}`}
          />
        </DockIcon>

        <DockIcon
          label={t("nav.githubActivity")}
          onClick={() => navigate({ to: "/github" })}
          className={`touch-manipulation ${inactiveClass}`}
        >
          <Activity
            size={18}
            className="text-gray-700 transition-colors duration-200 sm:size-5 dark:text-gray-300"
          />
        </DockIcon>

        <DockIcon
          label={t("nav.portfolio")}
          onClick={() => navigate({ to: "/projects" })}
          className={`touch-manipulation ${inactiveClass}`}
        >
          <FolderOpen
            size={18}
            className="text-gray-700 transition-colors duration-200 sm:size-5 dark:text-gray-300"
          />
        </DockIcon>

        <DockIcon
          label={t("nav.lab")}
          onClick={() => navigate({ to: "/apps" })}
          className={`touch-manipulation ${inactiveClass}`}
        >
          <FlaskConical
            size={18}
            className="text-gray-700 transition-colors duration-200 sm:size-5 dark:text-gray-300"
          />
        </DockIcon>

        <DockIcon
          label={t("nav.writing")}
          onClick={() => navigate({ to: "/blog" })}
          className={`touch-manipulation ${inactiveClass}`}
        >
          <PenLine
            size={18}
            className="text-gray-700 transition-colors duration-200 sm:size-5 dark:text-gray-300"
          />
        </DockIcon>

        <DockIcon
          label={t("nav.thoughts")}
          onClick={() => navigate({ to: "/cmt" })}
          className={`touch-manipulation ${inactiveClass}`}
        >
          <MessageCircle
            size={18}
            className="text-gray-700 transition-colors duration-200 sm:size-5 dark:text-gray-300"
          />
        </DockIcon>

        <DockIcon
          label={t("nav.timeline")}
          onClick={() => navigate({ to: "/timeline" })}
          className={`touch-manipulation ${inactiveClass}`}
        >
          <GitBranch
            size={18}
            className="text-gray-700 transition-colors duration-200 sm:size-5 dark:text-gray-300"
          />
        </DockIcon>

        <DockIcon
          label={t("nav.reading")}
          onClick={() => navigate({ to: "/reading" })}
          className={`touch-manipulation ${inactiveClass}`}
        >
          <BookOpen
            size={18}
            className="text-gray-700 transition-colors duration-200 sm:size-5 dark:text-gray-300"
          />
        </DockIcon>

        <DockIcon
          label={t("nav.uses")}
          onClick={() => navigate({ to: "/uses" })}
          className={`touch-manipulation ${inactiveClass}`}
        >
          <Monitor
            size={18}
            className="text-gray-700 transition-colors duration-200 sm:size-5 dark:text-gray-300"
          />
        </DockIcon>

        <DockIcon
          label={t("nav.stats")}
          onClick={() => navigate({ to: "/stats" })}
          className={`touch-manipulation ${inactiveClass}`}
        >
          <BarChart3
            size={18}
            className="text-gray-700 transition-colors duration-200 sm:size-5 dark:text-gray-300"
          />
        </DockIcon>

        <DockIcon
          label={t("nav.gallery")}
          onClick={() => navigate({ to: "/gallery" })}
          className={`touch-manipulation ${inactiveClass}`}
        >
          <Image
            size={18}
            className="text-gray-700 transition-colors duration-200 sm:size-5 dark:text-gray-300"
          />
        </DockIcon>

        <DockIcon
          label={t("nav.guestbook")}
          onClick={() => navigate({ to: "/guestbook" })}
          className={`touch-manipulation ${inactiveClass}`}
        >
          <BookMarked
            size={18}
            className="text-gray-700 transition-colors duration-200 sm:size-5 dark:text-gray-300"
          />
        </DockIcon>

        <DockIcon
          label={t("nav.changelog")}
          onClick={() => navigate({ to: "/changelog" })}
          className={`touch-manipulation ${inactiveClass}`}
        >
          <ListOrdered
            size={18}
            className="text-gray-700 transition-colors duration-200 sm:size-5 dark:text-gray-300"
          />
        </DockIcon>

        <DockIcon
          label={t("nav.resume")}
          onClick={() => navigate({ to: "/resume" })}
          className={`touch-manipulation ${inactiveClass}`}
        >
          <FileText
            size={18}
            className="text-gray-700 transition-colors duration-200 sm:size-5 dark:text-gray-300"
          />
        </DockIcon>

        <DockIcon
          label={t("nav.contact")}
          onClick={() => navigate({ to: "/contact" })}
          className={`touch-manipulation ${inactiveClass}`}
        >
          <MessageSquare
            size={18}
            className="text-gray-700 transition-colors duration-200 sm:size-5 dark:text-gray-300"
          />
        </DockIcon>

        {/* Divider */}
        <div className="mx-1 h-6 w-px bg-gray-300 sm:mx-2 sm:h-8 dark:bg-[#1a1a1a]" />

        <DockIcon
          label={t("nav.social.github")}
          onClick={() => window.open("https://github.com/Sma1lboy", "_blank")}
          className={`touch-manipulation ${inactiveClass}`}
        >
          <Github size={18} className="text-gray-700 sm:size-5 dark:text-gray-300" />
        </DockIcon>

        <DockIcon
          label={t("nav.social.twitter")}
          onClick={() => window.open("https://x.com/sma1lboy", "_blank")}
          className={`touch-manipulation ${inactiveClass}`}
        >
          <Twitter size={18} className="text-gray-700 sm:size-5 dark:text-gray-300" />
        </DockIcon>

        <DockIcon
          label={t("nav.social.linkedin")}
          onClick={() => window.open("https://www.linkedin.com/in/chong-chen-857214292/", "_blank")}
          className={`touch-manipulation ${inactiveClass}`}
        >
          <Linkedin size={18} className="text-gray-700 sm:size-5 dark:text-gray-300" />
        </DockIcon>

        <DockIcon
          label={t("nav.social.email")}
          onClick={() => window.open("mailto:541898146chen@gmail.com")}
          className={`touch-manipulation ${inactiveClass}`}
        >
          <Mail size={18} className="text-gray-700 sm:size-5 dark:text-gray-300" />
        </DockIcon>

        {/* Divider */}
        <div className="mx-1 h-6 w-px bg-gray-300 sm:mx-2 sm:h-8 dark:bg-[#1a1a1a]" />

        <DockIcon
          label={t("nav.language")}
          onClick={toggleLanguage}
          className="touch-manipulation hover:bg-gray-100 active:bg-gray-200 dark:hover:bg-gray-800 dark:active:bg-gray-700"
        >
          <div className="relative flex items-center justify-center">
            <Languages size={18} className="text-gray-700 sm:size-5 dark:text-gray-300" />
            <span className="absolute -right-1 -top-1 text-[8px] font-bold leading-none text-gray-700 dark:text-gray-300">
              {language === "en" ? "EN" : "中"}
            </span>
          </div>
        </DockIcon>

        <DockIcon
          label={t("nav.theme")}
          className="touch-manipulation hover:bg-gray-100 active:bg-gray-200 dark:hover:bg-gray-800 dark:active:bg-gray-700"
        >
          <ThemeToggle />
        </DockIcon>
      </Dock>
    </nav>
  );
}
