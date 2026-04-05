import { Link, useRouterState } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { ChevronRight } from "lucide-react";

const SEGMENT_LABELS: Record<string, string> = {
  blog: "Blog",
  apps: "Apps",
  chat: "AI Chat",
  snake: "Snake",
  pixel: "Pixel Art",
  life: "Game of Life",
  receipt: "3D Receipt",
  typewriter: "Motorola Fix Beeper",
  terminal: "Terminal",
  diff: "Code Diff",
  json: "JSON Formatter",
  encode: "Encoder / Decoder",
  regex: "Regex Tester",
  widget: "Widget Generator",
  hash: "Hash Generator",
  qr: "QR Code",
  pomodoro: "Pomodoro Timer",
  markdown: "Markdown Editor",
  typing: "Typing Test",
  kanban: "Kanban Board",
  colors: "Color Picker",
  gradient: "Gradient Generator",
  ascii: "ASCII Art",
};

export interface BreadcrumbItem {
  label: string;
  href: string;
}

interface BreadcrumbsProps {
  /** Override the last breadcrumb label (useful for dynamic pages like blog post titles) */
  lastLabel?: string;
  /** Fully override the breadcrumb items instead of deriving from route */
  items?: BreadcrumbItem[];
}

export function useBreadcrumbs(lastLabel?: string): BreadcrumbItem[] {
  const routerState = useRouterState();
  const pathname = routerState.location.pathname;

  const segments = pathname.split("/").filter(Boolean);
  if (segments.length === 0) return [];

  const items: BreadcrumbItem[] = [{ label: "Home", href: "/" }];

  segments.forEach((segment, i) => {
    const href = "/" + segments.slice(0, i + 1).join("/");
    const isLast = i === segments.length - 1;
    const label =
      isLast && lastLabel
        ? lastLabel
        : SEGMENT_LABELS[segment] || segment.charAt(0).toUpperCase() + segment.slice(1);
    items.push({ label, href });
  });

  return items;
}

export function Breadcrumbs({ lastLabel, items: itemsProp }: BreadcrumbsProps) {
  const derived = useBreadcrumbs(lastLabel);
  const items = itemsProp ?? derived;

  if (items.length <= 1) return null;

  return (
    <motion.nav
      aria-label="Breadcrumb"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="mb-6"
    >
      <ol className="flex flex-wrap items-center gap-1 text-xs">
        {items.map((item, i) => {
          const isLast = i === items.length - 1;
          return (
            <li key={item.href} className="flex items-center gap-1">
              {i > 0 && (
                <ChevronRight
                  size={12}
                  className="text-gray-300 dark:text-gray-700"
                />
              )}
              {isLast ? (
                <span className="text-gray-500 dark:text-gray-400">
                  {item.label}
                </span>
              ) : (
                <Link
                  to={item.href}
                  className="text-gray-400 transition-colors hover:text-gray-700 dark:text-gray-500 dark:hover:text-gray-300"
                >
                  {item.label}
                </Link>
              )}
            </li>
          );
        })}
      </ol>
    </motion.nav>
  );
}
