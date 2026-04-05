export type ChangelogType = "new" | "improved" | "fixed";

export interface ChangelogEntry {
  id: string;
  date: string;
  version: string;
  title: string;
  description: string;
  type: ChangelogType;
}

export const typeLabels: Record<ChangelogType, string> = {
  new: "New",
  improved: "Improved",
  fixed: "Fixed",
};

export const typeColors: Record<ChangelogType, { badge: string; dot: string }> = {
  new: {
    badge: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
    dot: "bg-emerald-500",
  },
  improved: {
    badge: "bg-sky-500/10 text-sky-600 dark:text-sky-400",
    dot: "bg-sky-500",
  },
  fixed: {
    badge: "bg-amber-500/10 text-amber-600 dark:text-amber-400",
    dot: "bg-amber-500",
  },
};

export const changelogEntries: ChangelogEntry[] = [
  {
    id: "stats-dashboard",
    date: "2024-04-02",
    version: "v1.13.0",
    title: "Stats Dashboard",
    description:
      "Added a Stats Dashboard page with animated counters, skill bars, and fun developer metrics.",
    type: "new",
  },
  {
    id: "code-snippets",
    date: "2024-04-01",
    version: "v1.12.0",
    title: "Code Snippets",
    description:
      "Added a Code Snippets page with syntax highlighting, search filtering, and one-click copy-to-clipboard.",
    type: "new",
  },
  {
    id: "page-transitions",
    date: "2024-03-30",
    version: "v1.11.0",
    title: "Smooth Page Transitions",
    description:
      "Added smooth page transition animations with Framer Motion AnimatePresence for a more polished navigation experience.",
    type: "improved",
  },
  {
    id: "uses-page",
    date: "2024-03-28",
    version: "v1.10.0",
    title: "Uses / Setup Page",
    description:
      "Added a Uses page showcasing developer tools, hardware, and software setup with category filters.",
    type: "new",
  },
  {
    id: "reading-list",
    date: "2024-03-26",
    version: "v1.9.0",
    title: "Reading List",
    description:
      "Added a Reading List page with category filters and stagger animations for books, papers, and resources.",
    type: "new",
  },
  {
    id: "timeline-page",
    date: "2024-03-24",
    version: "v1.8.0",
    title: "Interactive Timeline",
    description:
      "Added an interactive Timeline/Journey page with scroll-triggered animations showing career milestones.",
    type: "new",
  },
  {
    id: "dark-light-theme",
    date: "2024-03-22",
    version: "v1.7.0",
    title: "Dark/Light Theme System",
    description:
      "Implemented complete dark/light theme with CSS transitions and full variable parity across all pages.",
    type: "improved",
  },
  {
    id: "command-palette",
    date: "2024-03-20",
    version: "v1.6.0",
    title: "Command Palette",
    description:
      "Added a Cmd+K spotlight-style Command Palette with fuzzy search across pages, blog posts, and projects.",
    type: "new",
  },
  {
    id: "contact-page",
    date: "2024-03-18",
    version: "v1.5.0",
    title: "Contact Page",
    description:
      "Added a Contact page with a message form, social links, and a live location indicator.",
    type: "new",
  },
  {
    id: "github-activity",
    date: "2024-03-16",
    version: "v1.4.0",
    title: "GitHub Activity",
    description:
      "Added a GitHub Activity page with contribution heatmap visualization and live repository feed.",
    type: "new",
  },
  {
    id: "resume-page",
    date: "2024-03-14",
    version: "v1.3.0",
    title: "Resume Page",
    description: "Added a Resume/CV page with timeline-based experience layout and skills grid.",
    type: "new",
  },
  {
    id: "projects-gallery",
    date: "2024-03-12",
    version: "v1.2.0",
    title: "Projects Gallery",
    description:
      "Added an interactive Projects Gallery with category filtering, animated cards, and detail views.",
    type: "new",
  },
  {
    id: "blog-system",
    date: "2024-03-10",
    version: "v1.1.0",
    title: "Blog System",
    description:
      "Added a blog/writing section with MDX support, listing page, and individual post detail pages.",
    type: "new",
  },
  {
    id: "site-optimization",
    date: "2024-03-08",
    version: "v1.0.1",
    title: "Performance Optimization",
    description:
      "Full site optimization with code splitting, image compression, and SEO improvements. Bundle size reduced by 40%.",
    type: "improved",
  },
];
