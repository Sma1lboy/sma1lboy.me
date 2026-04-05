import { useState, useCallback, useEffect } from "react";
import { motion, AnimatePresence, useDragControls } from "motion/react";
import { useNavigate, useLocation } from "@tanstack/react-router";
import {
  Activity,
  BarChart3,
  BookOpen,
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
  Menu,
  MessageSquare,
  MessageCircle,
  Monitor,
  Moon,
  PenLine,
  Sun,
  Twitter,
  X,
} from "lucide-react";
import { useTranslation } from "@/i18n";
import { useLanguageStore } from "@/store/languageStore";
import { useThemeStore } from "@/store/themeStore";

interface NavItem {
  icon: React.ElementType;
  labelKey: string;
  action: () => void;
}

interface NavSection {
  title: string;
  items: NavItem[];
}

export function MobileNav() {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { t } = useTranslation();
  const { language, toggleLanguage } = useLanguageStore();
  const { resolvedTheme, toggleTheme } = useThemeStore();
  const dragControls = useDragControls();

  // Close on route change
  useEffect(() => {
    setOpen(false);
  }, [location.pathname]);

  // Lock body scroll when open
  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  const close = useCallback(() => setOpen(false), []);
  const toggle = useCallback(() => setOpen((v) => !v), []);

  const nav = useCallback(
    (to: string) => {
      navigate({ to });
      close();
    },
    [navigate, close],
  );

  const external = useCallback(
    (url: string) => {
      window.open(url, "_blank");
      close();
    },
    [close],
  );

  const sections: NavSection[] = [
    {
      title: "Pages",
      items: [
        { icon: HomeIcon, labelKey: "nav.home", action: () => nav("/") },
        { icon: Activity, labelKey: "nav.githubActivity", action: () => nav("/github") },
        { icon: FolderOpen, labelKey: "nav.portfolio", action: () => nav("/projects") },
        { icon: FlaskConical, labelKey: "nav.lab", action: () => nav("/apps") },
        { icon: PenLine, labelKey: "nav.writing", action: () => nav("/blog") },
        { icon: MessageCircle, labelKey: "nav.thoughts", action: () => nav("/cmt") },
        { icon: GitBranch, labelKey: "nav.timeline", action: () => nav("/timeline") },
        { icon: BookOpen, labelKey: "nav.reading", action: () => nav("/reading") },
        { icon: Monitor, labelKey: "nav.uses", action: () => nav("/uses") },
        { icon: BarChart3, labelKey: "nav.stats", action: () => nav("/stats") },
        { icon: Image, labelKey: "nav.gallery", action: () => nav("/gallery") },
        { icon: BookMarked, labelKey: "nav.guestbook", action: () => nav("/guestbook") },
        { icon: ListOrdered, labelKey: "nav.changelog", action: () => nav("/changelog") },
        { icon: FileText, labelKey: "nav.resume", action: () => nav("/resume") },
        { icon: MessageSquare, labelKey: "nav.contact", action: () => nav("/contact") },
      ],
    },
    {
      title: "Social",
      items: [
        {
          icon: Github,
          labelKey: "nav.social.github",
          action: () => external("https://github.com/Sma1lboy"),
        },
        {
          icon: Twitter,
          labelKey: "nav.social.twitter",
          action: () => external("https://x.com/sma1lboy"),
        },
        {
          icon: Linkedin,
          labelKey: "nav.social.linkedin",
          action: () => external("https://www.linkedin.com/in/chong-chen-857214292/"),
        },
        {
          icon: Mail,
          labelKey: "nav.social.email",
          action: () => external("mailto:541898146chen@gmail.com"),
        },
      ],
    },
  ];

  return (
    <div className="md:hidden">
      {/* FAB hamburger button */}
      <button
        type="button"
        onClick={toggle}
        aria-label={open ? "Close menu" : "Open menu"}
        aria-expanded={open}
        className="fixed right-4 bottom-4 z-[60] flex h-12 w-12 items-center justify-center rounded-full bg-gray-900 shadow-lg transition-colors active:bg-gray-700 dark:bg-white dark:active:bg-gray-200"
      >
        <AnimatePresence mode="wait" initial={false}>
          {open ? (
            <motion.div
              key="close"
              initial={{ rotate: -90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: 90, opacity: 0 }}
              transition={{ duration: 0.15 }}
            >
              <X size={20} className="text-white dark:text-gray-900" />
            </motion.div>
          ) : (
            <motion.div
              key="menu"
              initial={{ rotate: 90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: -90, opacity: 0 }}
              transition={{ duration: 0.15 }}
            >
              <Menu size={20} className="text-white dark:text-gray-900" />
            </motion.div>
          )}
        </AnimatePresence>
      </button>

      {/* Full-screen overlay */}
      <AnimatePresence>
        {open && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 z-[55] bg-black/40 backdrop-blur-sm"
              onClick={close}
            />

            {/* Slide-up panel */}
            <motion.div
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", damping: 30, stiffness: 300 }}
              drag="y"
              dragControls={dragControls}
              dragConstraints={{ top: 0, bottom: 0 }}
              dragElastic={{ top: 0, bottom: 0.6 }}
              onDragEnd={(_, info) => {
                if (info.offset.y > 100 || info.velocity.y > 300) {
                  close();
                }
              }}
              className="fixed inset-x-0 bottom-0 z-[56] max-h-[85vh] overflow-y-auto overscroll-contain rounded-t-2xl bg-white pb-20 dark:bg-[#111]"
            >
              {/* Drag handle */}
              <div
                className="sticky top-0 z-10 flex justify-center bg-white/80 pt-3 pb-2 backdrop-blur-md dark:bg-[#111]/80"
                onPointerDown={(e) => dragControls.start(e)}
              >
                <div className="h-1 w-8 rounded-full bg-gray-300 dark:bg-gray-600" />
              </div>

              <nav className="px-5 pb-6" aria-label="Mobile navigation">
                {sections.map((section, si) => (
                  <div key={section.title} className={si > 0 ? "mt-6" : ""}>
                    <motion.p
                      initial={{ opacity: 0, x: -8 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: si * 0.05, duration: 0.2 }}
                      className="mb-2 px-3 text-xs font-semibold tracking-wider text-gray-400 uppercase dark:text-gray-500"
                    >
                      {section.title}
                    </motion.p>
                    <div className="grid grid-cols-3 gap-1.5">
                      {section.items.map((item, i) => {
                        const Icon = item.icon;
                        return (
                          <motion.button
                            key={item.labelKey}
                            type="button"
                            onClick={item.action}
                            initial={{ opacity: 0, y: 12 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{
                              delay: si * 0.05 + i * 0.025,
                              duration: 0.25,
                            }}
                            className="flex flex-col items-center gap-1.5 rounded-xl px-2 py-3 text-gray-700 transition-colors active:bg-gray-100 dark:text-gray-300 dark:active:bg-[#1a1a1a]"
                          >
                            <Icon size={18} className="text-gray-500 dark:text-gray-400" />
                            <span className="text-[11px] leading-tight font-medium">
                              {t(item.labelKey)}
                            </span>
                          </motion.button>
                        );
                      })}
                    </div>
                  </div>
                ))}

                {/* Settings row */}
                <div className="mt-6">
                  <motion.p
                    initial={{ opacity: 0, x: -8 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.15, duration: 0.2 }}
                    className="mb-2 px-3 text-xs font-semibold tracking-wider text-gray-400 uppercase dark:text-gray-500"
                  >
                    Settings
                  </motion.p>
                  <div className="flex gap-2">
                    <motion.button
                      type="button"
                      onClick={toggleLanguage}
                      initial={{ opacity: 0, y: 12 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.18, duration: 0.25 }}
                      className="flex flex-1 items-center gap-3 rounded-xl border border-gray-100 px-4 py-3 transition-colors active:bg-gray-50 dark:border-[#1f1f1f] dark:active:bg-[#1a1a1a]"
                    >
                      <Languages size={18} className="text-gray-500 dark:text-gray-400" />
                      <div className="text-left">
                        <span className="block text-xs font-medium text-gray-700 dark:text-gray-300">
                          {t("nav.language")}
                        </span>
                        <span className="text-[11px] text-gray-400 dark:text-gray-500">
                          {language === "en" ? "English" : "中文"}
                        </span>
                      </div>
                    </motion.button>

                    <motion.button
                      type="button"
                      onClick={toggleTheme}
                      initial={{ opacity: 0, y: 12 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.2, duration: 0.25 }}
                      className="flex flex-1 items-center gap-3 rounded-xl border border-gray-100 px-4 py-3 transition-colors active:bg-gray-50 dark:border-[#1f1f1f] dark:active:bg-[#1a1a1a]"
                    >
                      {resolvedTheme === "dark" ? (
                        <Moon size={18} className="text-gray-500 dark:text-gray-400" />
                      ) : (
                        <Sun size={18} className="text-gray-500 dark:text-gray-400" />
                      )}
                      <div className="text-left">
                        <span className="block text-xs font-medium text-gray-700 dark:text-gray-300">
                          {t("nav.theme")}
                        </span>
                        <span className="text-[11px] text-gray-400 dark:text-gray-500">
                          {resolvedTheme === "dark" ? "Dark" : "Light"}
                        </span>
                      </div>
                    </motion.button>
                  </div>
                </div>
              </nav>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
