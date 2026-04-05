import { useState, useRef, useEffect, useCallback } from "react";
import { useNavigate } from "@tanstack/react-router";
import { Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { ArrowLeft } from "lucide-react";
import { useSEO } from "@/hooks/useSEO";

interface OutputLine {
  id: number;
  text: string;
  isCommand: boolean;
  isTyping?: boolean;
}

const PROMPT = "visitor@sma1lboy.me:~$ ";

const SITE_PAGES: Record<string, string> = {
  home: "/",
  blog: "/blog",
  projects: "/projects",
  profile: "/profile",
  resume: "/resume",
  github: "/github",
  contact: "/contact",
  uses: "/uses",
  snippets: "/snippets",
  stats: "/stats",
  changelog: "/changelog",
  apps: "/apps",
  terminal: "/apps/terminal",
};

const HELP_TEXT = `Available commands:

  help          Show this help message
  about         About Jackson
  projects      List projects
  skills        Show technical skills
  contact       Contact information
  clear         Clear terminal
  echo <text>   Echo back text
  date          Show current date
  ls            List site pages
  whoami        Who are you?
  cd <page>     Navigate to a page
  sudo hire-me  ???

Type a command and press Enter.`;

const ABOUT_TEXT = `
  ╔══════════════════════════════════════╗
  ║          JACKSON (SMA1LBOY)          ║
  ╠══════════════════════════════════════╣
  ║                                      ║
  ║  Full-stack developer                ║
  ║  CS @ University of Wisconsin-Madison║
  ║  SDE @ TikTok                        ║
  ║  GSoC Alumnus                        ║
  ║                                      ║
  ║  Building AI tooling & open-source   ║
  ║  infrastructure for the next         ║
  ║  generation of developer tools.      ║
  ║                                      ║
  ╚══════════════════════════════════════╝`;

const PROJECTS_TEXT = `
  PROJECT            DESCRIPTION
  ─────────────────────────────────────────
  pochi              AI coding teammate
  tabby              Terminal AI assistant
  foxychat           Real-time chat platform
  codefox            AI-powered code gen
  codefox-local      Local-first code gen
  sma1lboy.me        This website :)

  Run \`cd projects\` to see full list.`;

const SKILLS_TEXT = `
  LANGUAGES       TypeScript, Rust, Python, Java, Go, C++
  FRONTEND        React, Next.js, TailwindCSS, Framer Motion
  BACKEND         Node.js, Express, NestJS, FastAPI
  DATABASE        PostgreSQL, Redis, MongoDB, Prisma
  INFRA           Docker, Kubernetes, AWS, Vercel
  AI/ML           LLM tooling, RAG, Agent frameworks
  TOOLS           Git, Vim, Tmux, Linux`;

const CONTACT_TEXT = `
  ┌─────────────────────────────────────┐
  │  CONTACT                            │
  ├─────────────────────────────────────┤
  │  github    github.com/Sma1lboy      │
  │  x/twitter x.com/sma1lboy           │
  │  linkedin  linkedin.com/in/chong-   │
  │            chen-857214292            │
  │  email     chongchen@wisc.edu       │
  └─────────────────────────────────────┘`;

const HIRE_ME_TEXT = `
  ⚡ SUDO PERMISSION GRANTED ⚡

  ██╗  ██╗██╗██████╗ ███████╗    ███╗   ███╗███████╗██╗
  ██║  ██║██║██╔══██╗██╔════╝    ████╗ ████║██╔════╝██║
  ███████║██║██████╔╝█████╗      ██╔████╔██║█████╗  ██║
  ██╔══██║██║██╔══██╗██╔══╝      ██║╚██╔╝██║██╔══╝  ╚═╝
  ██║  ██║██║██║  ██║███████╗    ██║ ╚═╝ ██║███████╗██╗
  ╚═╝  ╚═╝╚═╝╚═╝  ╚═╝╚══════╝    ╚═╝     ╚═╝╚══════╝╚═╝

  > Compiling resume.pdf ...
  > Checking availability ... ✓ OPEN TO OPPORTUNITIES
  > Running background check ... ✓ GSoC alumnus, TikTok SDE
  > Evaluating skills ... ✓ Full-stack, AI/ML, Systems
  > Generating offer letter ...

  Just kidding — but seriously, let's talk!
  Run \`contact\` to get in touch.`;

const TYPE_DELAY = 12;

let lineIdCounter = 0;
function nextId() {
  return ++lineIdCounter;
}

export default function Terminal() {
  useSEO({
    title: "Terminal",
    description: "Interactive terminal emulator with custom commands.",
    path: "/apps/terminal",
  });

  const [output, setOutput] = useState<OutputLine[]>([
    {
      id: nextId(),
      text: 'Welcome to sma1lboy.me terminal v1.0.0\nType "help" for available commands.\n',
      isCommand: false,
    },
  ]);
  const [input, setInput] = useState("");
  const [history, setHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [isTyping, setIsTyping] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  const scrollToBottom = useCallback(() => {
    requestAnimationFrame(() => {
      if (scrollRef.current) {
        scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
      }
    });
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [output, scrollToBottom]);

  const typewriterOutput = useCallback(
    (text: string, onDone?: () => void) => {
      setIsTyping(true);
      const lineId = nextId();
      setOutput((prev) => [...prev, { id: lineId, text: "", isCommand: false, isTyping: true }]);

      let i = 0;
      const chars = text.split("");

      function tick() {
        if (i < chars.length) {
          const batch = chars.slice(i, i + 3).join("");
          i += 3;
          setOutput((prev) =>
            prev.map((line) =>
              line.id === lineId ? { ...line, text: line.text + batch } : line,
            ),
          );
          scrollToBottom();
          setTimeout(tick, TYPE_DELAY);
        } else {
          setOutput((prev) =>
            prev.map((line) =>
              line.id === lineId ? { ...line, isTyping: false } : line,
            ),
          );
          setIsTyping(false);
          onDone?.();
        }
      }

      tick();
    },
    [scrollToBottom],
  );

  const executeCommand = useCallback(
    (cmd: string) => {
      const trimmed = cmd.trim();
      const parts = trimmed.split(/\s+/);
      const command = parts[0]?.toLowerCase() ?? "";
      const args = parts.slice(1).join(" ");

      // Add command line to output
      setOutput((prev) => [
        ...prev,
        { id: nextId(), text: PROMPT + trimmed, isCommand: true },
      ]);

      if (!trimmed) return;

      // Add to history
      setHistory((prev) => {
        const filtered = prev.filter((h) => h !== trimmed);
        return [trimmed, ...filtered];
      });
      setHistoryIndex(-1);

      switch (command) {
        case "help":
          typewriterOutput(HELP_TEXT);
          break;

        case "about":
          typewriterOutput(ABOUT_TEXT);
          break;

        case "projects":
          typewriterOutput(PROJECTS_TEXT);
          break;

        case "skills":
          typewriterOutput(SKILLS_TEXT);
          break;

        case "contact":
          typewriterOutput(CONTACT_TEXT);
          break;

        case "clear":
          setOutput([]);
          break;

        case "echo":
          typewriterOutput(args || "");
          break;

        case "date":
          typewriterOutput("  " + new Date().toString());
          break;

        case "ls":
          typewriterOutput(
            "  " + Object.keys(SITE_PAGES).join("  "),
          );
          break;

        case "whoami":
          typewriterOutput("  visitor");
          break;

        case "cd": {
          const page = args.toLowerCase().replace(/^\//, "");
          if (!page) {
            typewriterOutput("  Usage: cd <page>\n  Run `ls` to see available pages.");
            break;
          }
          const route = SITE_PAGES[page];
          if (route) {
            typewriterOutput(`  Navigating to /${page}...`, () => {
              setTimeout(() => navigate({ to: route }), 400);
            });
          } else {
            typewriterOutput(`  cd: no such page: ${page}\n  Run \`ls\` to see available pages.`);
          }
          break;
        }

        case "sudo":
          if (args.toLowerCase() === "hire-me") {
            typewriterOutput(HIRE_ME_TEXT);
          } else {
            typewriterOutput(`  sudo: unknown command: ${args}`);
          }
          break;

        default:
          typewriterOutput(
            `  command not found: ${command}\n  Type "help" for available commands.`,
          );
      }
    },
    [typewriterOutput, navigate],
  );

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      if (isTyping) return;
      executeCommand(input);
      setInput("");
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      if (history.length === 0) return;
      const newIndex = historyIndex + 1;
      if (newIndex < history.length) {
        setHistoryIndex(newIndex);
        setInput(history[newIndex]);
      }
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      if (historyIndex <= 0) {
        setHistoryIndex(-1);
        setInput("");
      } else {
        const newIndex = historyIndex - 1;
        setHistoryIndex(newIndex);
        setInput(history[newIndex]);
      }
    }
  };

  const focusInput = () => {
    inputRef.current?.focus();
  };

  return (
    <div className="min-h-screen bg-black p-4 sm:p-8">
      <div className="mx-auto max-w-4xl">
        {/* Back button */}
        <Link
          to="/apps"
          className="mb-4 inline-flex items-center gap-1.5 text-sm text-gray-500 transition-colors hover:text-gray-300"
        >
          <ArrowLeft size={14} />
          Back to Lab
        </Link>

        {/* Terminal window */}
        <motion.div
          className="overflow-hidden rounded-lg border border-gray-800 bg-[#0a0a0a] shadow-2xl shadow-green-900/10"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}
        >
          {/* Title bar */}
          <div className="flex items-center gap-2 border-b border-gray-800 bg-[#111] px-4 py-2.5">
            <div className="flex gap-1.5">
              <div className="h-3 w-3 rounded-full bg-[#ff5f57]" />
              <div className="h-3 w-3 rounded-full bg-[#febc2e]" />
              <div className="h-3 w-3 rounded-full bg-[#28c840]" />
            </div>
            <span className="ml-2 font-mono text-xs text-gray-500">
              visitor@sma1lboy.me — bash
            </span>
          </div>

          {/* Terminal body */}
          <div
            ref={scrollRef}
            className="h-[70vh] cursor-text overflow-y-auto p-4 sm:p-6"
            onClick={focusInput}
          >
            {/* Output lines */}
            {output.map((line) => (
              <div key={line.id} className="font-mono text-sm leading-relaxed whitespace-pre-wrap">
                {line.isCommand ? (
                  <span className="text-green-400">{line.text}</span>
                ) : (
                  <span className="text-green-300/90">{line.text}</span>
                )}
                {line.isTyping && (
                  <span className="inline-block h-4 w-1.5 animate-pulse bg-green-400" />
                )}
              </div>
            ))}

            {/* Input line */}
            {!isTyping && (
              <div className="flex font-mono text-sm">
                <span className="text-green-400 whitespace-pre">{PROMPT}</span>
                <div className="relative flex-1">
                  <input
                    ref={inputRef}
                    type="text"
                    className="w-full border-none bg-transparent font-mono text-sm text-green-400 caret-transparent outline-none"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={handleKeyDown}
                    autoFocus
                    spellCheck={false}
                    autoComplete="off"
                    autoCapitalize="off"
                  />
                  {/* Custom blinking cursor */}
                  <span
                    className="pointer-events-none absolute top-0 font-mono text-sm text-green-400 whitespace-pre"
                    aria-hidden
                  >
                    {input}
                    <span className="inline-block h-4 w-1.5 translate-y-[1px] animate-blink bg-green-400" />
                  </span>
                </div>
              </div>
            )}
          </div>
        </motion.div>

        {/* Hint */}
        <motion.p
          className="mt-4 text-center font-mono text-xs text-gray-600"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
        >
          Type &quot;help&quot; to get started
        </motion.p>
      </div>
    </div>
  );
}
