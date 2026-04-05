import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { AnimatePresence, motion } from "framer-motion";
import {
  BookOpen,
  Code2,
  Command,
  FileText,
  Github,
  Home,
  Mail,
  Monitor,
  Search,
  User,
  Briefcase,
  type LucideIcon,
} from "lucide-react";
import blogPosts from "@/data/blog-posts.json";
import projects from "@/data/projects.json";

interface SearchItem {
  id: string;
  title: string;
  description?: string;
  category: "Pages" | "Blog Posts" | "Projects";
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

  const allItems = useMemo<SearchItem[]>(() => {
    const pages: SearchItem[] = [
      {
        id: "page-home",
        title: "Home",
        description: "Back to homepage",
        category: "Pages",
        icon: Home,
        action: () => navigate({ to: "/" }),
      },
      {
        id: "page-blog",
        title: "Blog",
        description: "Read my writing",
        category: "Pages",
        icon: BookOpen,
        action: () => navigate({ to: "/blog" }),
      },
      {
        id: "page-projects",
        title: "Projects",
        description: "View my work",
        category: "Pages",
        icon: Code2,
        action: () => navigate({ to: "/projects" }),
      },
      {
        id: "page-profile",
        title: "Profile",
        description: "About me",
        category: "Pages",
        icon: User,
        action: () => navigate({ to: "/profile" }),
      },
      {
        id: "page-resume",
        title: "Resume",
        description: "Experience & skills",
        category: "Pages",
        icon: FileText,
        action: () => navigate({ to: "/resume" }),
      },
      {
        id: "page-github",
        title: "GitHub Activity",
        description: "Contributions & repos",
        category: "Pages",
        icon: Github,
        action: () => navigate({ to: "/github" }),
      },
      {
        id: "page-contact",
        title: "Contact",
        description: "Get in touch",
        category: "Pages",
        icon: Mail,
        action: () => navigate({ to: "/contact" }),
      },
      {
        id: "page-uses",
        title: "Uses",
        description: "Developer setup & tools",
        category: "Pages",
        icon: Monitor,
        action: () => navigate({ to: "/uses" }),
      },
    ];

    const blogItems: SearchItem[] = blogPosts.map((post) => ({
      id: `blog-${post.slug}`,
      title: post.title,
      description: post.excerpt,
      category: "Blog Posts",
      icon: BookOpen,
      action: () => navigate({ to: "/blog/$slug", params: { slug: post.slug } }),
    }));

    const projectItems: SearchItem[] = projects.map((project) => ({
      id: `project-${project.id}`,
      title: project.title,
      description: project.description,
      category: "Projects",
      icon: Briefcase,
      action: () => navigate({ to: "/projects" }),
    }));

    return [...pages, ...blogItems, ...projectItems];
  }, [navigate]);

  const filtered = useMemo(() => {
    if (!query.trim()) return allItems;
    return allItems
      .filter(
        (item) =>
          fuzzyMatch(query, item.title) ||
          (item.description && fuzzyMatch(query, item.description))
      )
      .sort((a, b) => {
        const aScore = Math.max(
          scoreMatch(query, a.title),
          a.description ? scoreMatch(query, a.description) : 0
        );
        const bScore = Math.max(
          scoreMatch(query, b.title),
          b.description ? scoreMatch(query, b.description) : 0
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
            className="relative w-full max-w-[560px] mx-4 overflow-hidden rounded-xl border border-border bg-card shadow-2xl"
            initial={{ opacity: 0, scale: 0.95, y: -10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -10 }}
            transition={{ duration: 0.15, ease: "easeOut" }}
            onKeyDown={handleKeyDown}
          >
            {/* Search input */}
            <div className="flex items-center gap-3 border-b border-border px-4">
              <Search className="h-4 w-4 shrink-0 text-muted-foreground" />
              <input
                ref={inputRef}
                type="text"
                placeholder="Search pages, posts, projects..."
                className="h-12 w-full bg-transparent text-sm text-foreground placeholder:text-muted-foreground outline-none"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
              />
              <kbd className="hidden sm:inline-flex h-5 items-center gap-0.5 rounded border border-border bg-muted px-1.5 text-[10px] font-medium text-muted-foreground">
                ESC
              </kbd>
            </div>

            {/* Results */}
            <div
              ref={listRef}
              className="max-h-[50vh] overflow-y-auto overscroll-contain p-2"
            >
              {flatFiltered.length === 0 ? (
                <div className="px-4 py-8 text-center text-sm text-muted-foreground">
                  No results found.
                </div>
              ) : (
                (["Pages", "Blog Posts", "Projects"] as const).map((category) => {
                  const items = grouped[category];
                  if (!items || items.length === 0) return null;
                  return (
                    <div key={category} className="mb-1">
                      <div className="px-2 py-1.5 text-xs font-medium text-muted-foreground">
                        {category}
                      </div>
                      {items.map((item) => {
                        const flatIndex = flatFiltered.indexOf(item);
                        const isSelected = flatIndex === selectedIndex;
                        const Icon = item.icon;
                        return (
                          <button
                            key={item.id}
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
                            <Icon className="h-4 w-4 shrink-0 text-muted-foreground" />
                            <div className="min-w-0 flex-1">
                              <div className="truncate font-medium">{item.title}</div>
                              {item.description && (
                                <div className="truncate text-xs text-muted-foreground">
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
            <div className="flex items-center justify-between border-t border-border px-4 py-2 text-[11px] text-muted-foreground">
              <div className="flex items-center gap-3">
                <span className="flex items-center gap-1">
                  <kbd className="rounded border border-border bg-muted px-1 py-0.5 text-[10px]">↑↓</kbd>
                  navigate
                </span>
                <span className="flex items-center gap-1">
                  <kbd className="rounded border border-border bg-muted px-1 py-0.5 text-[10px]">↵</kbd>
                  select
                </span>
                <span className="flex items-center gap-1">
                  <kbd className="rounded border border-border bg-muted px-1 py-0.5 text-[10px]">esc</kbd>
                  close
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
