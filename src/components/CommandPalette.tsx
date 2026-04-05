import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { AnimatePresence, motion } from "framer-motion";
import {
  BarChart3,
  BookOpen,
  Code2,
  Command,
  FileText,
  Github,
  Home,
  ListOrdered,
  BookMarked,
  Mail,
  Monitor,
  TerminalSquare,
  Search,
  User,
  Briefcase,
  type LucideIcon,
} from "lucide-react";
import blogPosts from "@/data/blog-posts.json";
import projects from "@/data/projects.json";
import { useTranslation } from "@/i18n";

interface SearchItem {
  id: string;
  title: string;
  description?: string;
  category: "Pages" | "Blog Posts" | "Projects";
  categoryKey: string;
  icon: LucideIcon;
  action: () => void;
}

function fuzzyMatch(query: string, text: string): boolean {
  const q = query.toLowerCase();
  const t = text.toLowerCase();
  if (t.includes(q)) return true;
  let qi = 0;
  for (let ti = 0; ti < t.length && qi < q.length; ti++) {
    if (t[ti] === q[qi]) qi++;
  }
  return qi === q.length;
}

function scoreMatch(query: string, text: string): number {
  const q = query.toLowerCase();
  const t = text.toLowerCase();
  if (t === q) return 100;
  if (t.startsWith(q)) return 80;
  if (t.includes(q)) return 60;
  return 30; // fuzzy match
}

export function CommandPalette() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const { t } = useTranslation();

  const allItems = useMemo<SearchItem[]>(() => {
    const pages: SearchItem[] = [
      {
        id: "page-home",
        title: t("commandPalette.pages.home"),
        description: t("commandPalette.pages.homeDesc"),
        category: "Pages",
        categoryKey: "commandPalette.categories.pages",
        icon: Home,
        action: () => navigate({ to: "/" }),
      },
      {
        id: "page-blog",
        title: t("commandPalette.pages.blog"),
        description: t("commandPalette.pages.blogDesc"),
        category: "Pages",
        categoryKey: "commandPalette.categories.pages",
        icon: BookOpen,
        action: () => navigate({ to: "/blog" }),
      },
      {
        id: "page-projects",
        title: t("commandPalette.pages.projects"),
        description: t("commandPalette.pages.projectsDesc"),
        category: "Pages",
        categoryKey: "commandPalette.categories.pages",
        icon: Code2,
        action: () => navigate({ to: "/projects" }),
      },
      {
        id: "page-profile",
        title: t("commandPalette.pages.profile"),
        description: t("commandPalette.pages.profileDesc"),
        category: "Pages",
        categoryKey: "commandPalette.categories.pages",
        icon: User,
        action: () => navigate({ to: "/profile" }),
      },
      {
        id: "page-resume",
        title: t("commandPalette.pages.resume"),
        description: t("commandPalette.pages.resumeDesc"),
        category: "Pages",
        categoryKey: "commandPalette.categories.pages",
        icon: FileText,
        action: () => navigate({ to: "/resume" }),
      },
      {
        id: "page-github",
        title: t("commandPalette.pages.githubActivity"),
        description: t("commandPalette.pages.githubActivityDesc"),
        category: "Pages",
        categoryKey: "commandPalette.categories.pages",
        icon: Github,
        action: () => navigate({ to: "/github" }),
      },
      {
        id: "page-contact",
        title: t("commandPalette.pages.contact"),
        description: t("commandPalette.pages.contactDesc"),
        category: "Pages",
        categoryKey: "commandPalette.categories.pages",
        icon: Mail,
        action: () => navigate({ to: "/contact" }),
      },
      {
        id: "page-guestbook",
        title: t("commandPalette.pages.guestbook"),
        description: t("commandPalette.pages.guestbookDesc"),
        category: "Pages",
        categoryKey: "commandPalette.categories.pages",
        icon: BookMarked,
        action: () => navigate({ to: "/guestbook" }),
      },
      {
        id: "page-uses",
        title: t("commandPalette.pages.uses"),
        description: t("commandPalette.pages.usesDesc"),
        category: "Pages",
        categoryKey: "commandPalette.categories.pages",
        icon: Monitor,
        action: () => navigate({ to: "/uses" }),
      },
      {
        id: "page-snippets",
        title: t("commandPalette.pages.snippets"),
        description: t("commandPalette.pages.snippetsDesc"),
        category: "Pages",
        categoryKey: "commandPalette.categories.pages",
        icon: Code2,
        action: () => navigate({ to: "/snippets" }),
      },
      {
        id: "page-stats",
        title: t("commandPalette.pages.stats"),
        description: t("commandPalette.pages.statsDesc"),
        category: "Pages",
        categoryKey: "commandPalette.categories.pages",
        icon: BarChart3,
        action: () => navigate({ to: "/stats" }),
      },
      {
        id: "page-changelog",
        title: t("commandPalette.pages.changelog"),
        description: t("commandPalette.pages.changelogDesc"),
        category: "Pages",
        categoryKey: "commandPalette.categories.pages",
        icon: ListOrdered,
        action: () => navigate({ to: "/changelog" }),
      },
      {
        id: "page-terminal",
        title: t("commandPalette.pages.terminal"),
        description: t("commandPalette.pages.terminalDesc"),
        category: "Pages",
        categoryKey: "commandPalette.categories.pages",
        icon: TerminalSquare,
        action: () => navigate({ to: "/apps/terminal" }),
      },
    ];

    const blogItems: SearchItem[] = blogPosts.map((post) => ({
      id: `blog-${post.slug}`,
      title: post.title,
      description: post.excerpt,
      category: "Blog Posts",
      categoryKey: "commandPalette.categories.blogPosts",
      icon: BookOpen,
      action: () => navigate({ to: "/blog/$slug", params: { slug: post.slug } }),
    }));

    const projectItems: SearchItem[] = projects.map((project) => ({
      id: `project-${project.id}`,
      title: project.title,
      description: project.description,
      category: "Projects",
      categoryKey: "commandPalette.categories.projects",
      icon: Briefcase,
      action: () => navigate({ to: "/projects" }),
    }));

    return [...pages, ...blogItems, ...projectItems];
  }, [navigate, t]);

  const filtered = useMemo(() => {
    if (!query.trim()) return allItems;
    return allItems
      .filter(
        (item) =>
          fuzzyMatch(query, item.title) ||
          (item.description && fuzzyMatch(query, item.description)),
      )
      .sort((a, b) => {
        const aScore = Math.max(
          scoreMatch(query, a.title),
          a.description ? scoreMatch(query, a.description) : 0,
        );
        const bScore = Math.max(
          scoreMatch(query, b.title),
          b.description ? scoreMatch(query, b.description) : 0,
        );
        return bScore - aScore;
      });
  }, [query, allItems]);

  const grouped = useMemo(() => {
    const groups: Record<string, SearchItem[]> = {};
    for (const item of filtered) {
      if (!groups[item.category]) groups[item.category] = [];
      groups[item.category].push(item);
    }
    return groups;
  }, [filtered]);

  const flatFiltered = useMemo(() => {
    const order: SearchItem["category"][] = ["Pages", "Blog Posts", "Projects"];
    const result: SearchItem[] = [];
    for (const cat of order) {
      if (grouped[cat]) result.push(...grouped[cat]);
    }
    return result;
  }, [grouped]);

  const close = useCallback(() => {
    setOpen(false);
    setQuery("");
    setSelectedIndex(0);
  }, []);

  // Global Cmd+K / Ctrl+K listener
  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setOpen((prev) => {
          if (prev) {
            setQuery("");
            setSelectedIndex(0);
          }
          return !prev;
        });
      }
    }
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, []);

  // Listen for custom event from keyboard shortcuts (/ key)
  useEffect(() => {
    function onOpenPalette() {
      setOpen(true);
    }
    window.addEventListener("open-command-palette", onOpenPalette);
    return () => window.removeEventListener("open-command-palette", onOpenPalette);
  }, []);

  // Focus input when opening
  useEffect(() => {
    if (open) {
      requestAnimationFrame(() => inputRef.current?.focus());
    }
  }, [open]);

  // Reset selected index when results change
  useEffect(() => {
    setSelectedIndex(0);
  }, [query]);

  // Scroll selected item into view
  useEffect(() => {
    if (!listRef.current) return;
    const selected = listRef.current.querySelector("[data-selected='true']");
    selected?.scrollIntoView({ block: "nearest" });
  }, [selectedIndex]);

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setSelectedIndex((i) => (i + 1) % flatFiltered.length);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setSelectedIndex((i) => (i - 1 + flatFiltered.length) % flatFiltered.length);
    } else if (e.key === "Enter" && flatFiltered[selectedIndex]) {
      e.preventDefault();
      flatFiltered[selectedIndex].action();
      close();
    } else if (e.key === "Escape") {
      e.preventDefault();
      close();
    }
  }

  const categoryDisplayNames: Record<string, string> = {
    Pages: t("commandPalette.categories.pages"),
    "Blog Posts": t("commandPalette.categories.blogPosts"),
    Projects: t("commandPalette.categories.projects"),
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[9999] flex items-start justify-center pt-[15vh]"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.15 }}
        >
          {/* Backdrop */}
          <motion.div
            className="absolute inset-0 bg-black/60 backdrop-blur-md"
            onClick={close}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          />

          {/* Modal */}
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-label={t("commandPalette.searchPlaceholder")}
            className="border-border bg-card relative mx-4 w-full max-w-[560px] overflow-hidden rounded-xl border shadow-2xl"
            initial={{ opacity: 0, scale: 0.95, y: -10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -10 }}
            transition={{ duration: 0.15, ease: "easeOut" }}
            onKeyDown={handleKeyDown}
          >
            {/* Search input */}
            <div className="border-border flex items-center gap-3 border-b px-4">
              <Search className="text-muted-foreground h-4 w-4 shrink-0" />
              <input
                ref={inputRef}
                type="text"
                placeholder={t("commandPalette.searchPlaceholder")}
                className="text-foreground placeholder:text-muted-foreground h-12 w-full bg-transparent text-sm outline-none"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                role="combobox"
                aria-label={t("commandPalette.searchPlaceholder")}
                aria-expanded={true}
                aria-controls="command-palette-results"
                aria-activedescendant={flatFiltered[selectedIndex]?.id}
                autoComplete="off"
              />
              <kbd className="border-border bg-muted text-muted-foreground hidden h-5 items-center gap-0.5 rounded border px-1.5 text-[10px] font-medium sm:inline-flex">
                ESC
              </kbd>
            </div>

            {/* Results */}
            <div ref={listRef} id="command-palette-results" role="listbox" aria-live="polite" className="max-h-[50vh] overflow-y-auto overscroll-contain p-2">
              {flatFiltered.length === 0 ? (
                <div className="text-muted-foreground px-4 py-8 text-center text-sm">
                  {t("commandPalette.noResults")}
                </div>
              ) : (
                (["Pages", "Blog Posts", "Projects"] as const).map((category) => {
                  const items = grouped[category];
                  if (!items || items.length === 0) return null;
                  return (
                    <div key={category} className="mb-1">
                      <div className="text-muted-foreground px-2 py-1.5 text-xs font-medium">
                        {categoryDisplayNames[category]}
                      </div>
                      {items.map((item) => {
                        const flatIndex = flatFiltered.indexOf(item);
                        const isSelected = flatIndex === selectedIndex;
                        const Icon = item.icon;
                        return (
                          <button
                            key={item.id}
                            id={item.id}
                            role="option"
                            aria-selected={isSelected}
                            data-selected={isSelected}
                            className={`flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left text-sm transition-colors ${
                              isSelected
                                ? "bg-accent text-accent-foreground"
                                : "text-foreground hover:bg-accent/50"
                            }`}
                            onClick={() => {
                              item.action();
                              close();
                            }}
                            onMouseEnter={() => setSelectedIndex(flatIndex)}
                          >
                            <Icon className="text-muted-foreground h-4 w-4 shrink-0" />
                            <div className="min-w-0 flex-1">
                              <div className="truncate font-medium">{item.title}</div>
                              {item.description && (
                                <div className="text-muted-foreground truncate text-xs">
                                  {item.description}
                                </div>
                              )}
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  );
                })
              )}
            </div>

            {/* Footer hint */}
            <div className="border-border text-muted-foreground flex items-center justify-between border-t px-4 py-2 text-[11px]">
              <div className="flex items-center gap-3">
                <span className="flex items-center gap-1">
                  <kbd className="border-border bg-muted rounded border px-1 py-0.5 text-[10px]">
                    ↑↓
                  </kbd>
                  {t("commandPalette.footer.navigate")}
                </span>
                <span className="flex items-center gap-1">
                  <kbd className="border-border bg-muted rounded border px-1 py-0.5 text-[10px]">
                    ↵
                  </kbd>
                  {t("commandPalette.footer.select")}
                </span>
                <span className="flex items-center gap-1">
                  <kbd className="border-border bg-muted rounded border px-1 py-0.5 text-[10px]">
                    esc
                  </kbd>
                  {t("commandPalette.footer.close")}
                </span>
              </div>
              <span className="flex items-center gap-1">
                <Command className="h-3 w-3" />K
              </span>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
