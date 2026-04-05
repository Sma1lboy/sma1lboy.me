import { Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { ArrowUp, Github, Linkedin, Mail, Twitter, Play } from "lucide-react";
import { socialLinks } from "@/constants/home";

const iconMap: Record<string, React.ComponentType<{ size?: number; className?: string }>> = {
  Twitter,
  Github,
  Linkedin,
  Mail,
  Play,
};

const contentLinks = [
  { label: "Blog", to: "/blog" },
  { label: "Projects", to: "/projects" },
  { label: "Thoughts", to: "/cmt" },
  { label: "Reading", to: "/reading" },
  { label: "Timeline", to: "/timeline" },
  { label: "Resume", to: "/resume" },
] as const;

const toolLinks = [
  { label: "Lab", to: "/apps" },
  { label: "Changelog", to: "/changelog" },
  { label: "Uses", to: "/uses" },
  { label: "Stats", to: "/stats" },
  { label: "Gallery", to: "/gallery" },
  { label: "Guestbook", to: "/guestbook" },
] as const;

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <motion.footer
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.5 }}
      className="border-border border-t pb-24 md:pb-28"
    >
      <div className="mx-auto max-w-5xl px-6 pt-12 pb-8">
        {/* Sitemap columns */}
        <div className="grid grid-cols-2 gap-8 sm:grid-cols-3">
          {/* Content */}
          <div>
            <h3 className="text-foreground mb-3 text-xs font-semibold tracking-wider uppercase">
              Content
            </h3>
            <ul className="space-y-2">
              {contentLinks.map((link) => (
                <li key={link.to}>
                  <Link
                    to={link.to}
                    className="text-muted-foreground hover:text-foreground text-sm transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Tools */}
          <div>
            <h3 className="text-foreground mb-3 text-xs font-semibold tracking-wider uppercase">
              Tools
            </h3>
            <ul className="space-y-2">
              {toolLinks.map((link) => (
                <li key={link.to}>
                  <Link
                    to={link.to}
                    className="text-muted-foreground hover:text-foreground text-sm transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Connect */}
          <div className="col-span-2 sm:col-span-1">
            <h3 className="text-foreground mb-3 text-xs font-semibold tracking-wider uppercase">
              Connect
            </h3>
            <ul className="space-y-2">
              {socialLinks.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-muted-foreground hover:text-foreground text-sm transition-colors"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Social icons row */}
        <div className="mt-10 flex items-center gap-4">
          {socialLinks.map((link) => {
            const Icon = iconMap[link.icon];
            if (!Icon) return null;
            return (
              <a
                key={link.label}
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={link.label}
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                <Icon size={16} />
              </a>
            );
          })}
        </div>

        {/* Copyright + credit + back to top */}
        <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="space-y-1">
            <p className="text-muted-foreground text-xs">&copy; {currentYear} Jackson Chen</p>
            <p className="text-muted-foreground/60 text-xs">Built with React + Vite</p>
          </div>
          <button
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            className="text-muted-foreground hover:text-foreground flex items-center gap-1 text-xs transition-colors"
            aria-label="Back to top"
          >
            <ArrowUp size={14} />
            Back to top
          </button>
        </div>
      </div>
    </motion.footer>
  );
}
