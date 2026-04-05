import { useCallback, useEffect, useRef, useState } from "react";
import { Link } from "@tanstack/react-router";
import { ArrowLeft, Send } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useSEO } from "@/hooks/useSEO";

interface Message {
  id: number;
  role: "user" | "bot";
  text: string;
}

const JOKES = [
  "Why do programmers prefer dark mode? Because light attracts bugs. 🐛",
  "There are only 10 types of people in the world: those who understand binary and those who don't.",
  "A SQL query walks into a bar, sees two tables, and asks... 'Can I JOIN you?'",
  "!false — it's funny because it's true.",
  "Why do Java developers wear glasses? Because they can't C#.",
];

const WELCOME_MESSAGE =
  "Hey! I'm Jackson's chat bot. Ask me about him — his projects, tech stack, background, or just say hi. 👋";

function getResponse(input: string): string {
  const q = input.toLowerCase().trim();

  if (/^(hi|hello|hey|sup|yo|howdy|what'?s up)/i.test(q)) {
    return "Hey there! 👋 What would you like to know about Jackson?";
  }

  if (/who (are you|is jackson|is sma1lboy)|about|tell me about/i.test(q)) {
    return "I'm a bot for Jackson (sma1lboy) — a software engineer, open-source contributor, and CS grad. He loves building developer tools and exploring the edges of AI. When he's not coding, he's probably reading about distributed systems or tinkering with a new side project.";
  }

  if (/what (do you|does he|does jackson) do|work|job|career/i.test(q)) {
    return "Jackson is a full-stack developer who works on AI-powered tools, developer experience, and open-source projects. He's contributed to projects with thousands of GitHub stars and is always building something new.";
  }

  if (/project|codefox|pochi|tabby|built|building/i.test(q)) {
    return "Some highlights:\n• **Codefox** — an AI-powered code generation platform\n• **Tabby** — contributions to a self-hosted AI coding assistant (1k+ ⭐)\n• **Pochi** — developer tooling experiments\n• **This site** — interactive demos, blogs, and more\n\nCheck them out on GitHub: github.com/Sma1lboy";
  }

  if (/tech|stack|language|framework|tool|typescript|react|rust|go|python|kubernetes/i.test(q)) {
    return "Jackson's toolkit:\n• **Languages** — TypeScript, Go, Rust, Python, Java\n• **Frontend** — React, Next.js, Tailwind, Framer Motion\n• **Backend** — Node.js, NestJS, GraphQL\n• **Infra** — Kubernetes, Docker, CI/CD\n• **AI/ML** — LLMs, code generation, agent systems";
  }

  if (/contact|reach|email|github|twitter|social|x\.com/i.test(q)) {
    return "You can find Jackson here:\n• **GitHub** — github.com/Sma1lboy\n• **Twitter/X** — x.com/sma1lboy\n• **Email** — 541898146chen@gmail.com\n• **Website** — sma1lboy.me";
  }

  if (/joke|funny|laugh|humor/i.test(q)) {
    return JOKES[Math.floor(Math.random() * JOKES.length)];
  }

  if (/education|school|university|degree|study/i.test(q)) {
    return "Jackson has a CS degree and keeps learning through open-source contributions, side projects, and staying on top of the latest in AI and systems programming.";
  }

  if (/hobby|hobbies|free time|fun|interest/i.test(q)) {
    return "Outside of code, Jackson enjoys exploring new tech, contributing to open source, reading about distributed systems, and building interactive experiments like the ones on this site!";
  }

  if (/this (site|website)|sma1lboy\.me/i.test(q)) {
    return "This site is built with React 19, TypeScript, Vite, TanStack Router, Tailwind CSS 4, and Framer Motion. It features a blog, resume, interactive apps, and — well — me! Check out the other experiments in the Apps section.";
  }

  if (/help|what can (i|you)|commands/i.test(q)) {
    return "Try asking about:\n• Who is Jackson?\n• What does he work on?\n• His projects\n• Tech stack\n• Contact info\n• Tell me a joke\n• This website";
  }

  return "Hmm, I'm not sure about that one! Try asking about Jackson's projects, tech stack, background, or contact info. Or just say 'help' to see what I know. 🤔";
}

let nextId = 1;

export default function Chat() {
  useSEO({
    title: "AI Chat",
    description:
      "Chat with a simulated AI assistant. Ask about Jackson, his projects, tech stack, and more.",
    path: "/apps/chat",
  });

  const [messages, setMessages] = useState<Message[]>([
    { id: nextId++, role: "bot", text: WELCOME_MESSAGE },
  ]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = useCallback(() => {
    requestAnimationFrame(() => {
      scrollRef.current?.scrollTo({
        top: scrollRef.current.scrollHeight,
        behavior: "smooth",
      });
    });
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping, scrollToBottom]);

  const handleSend = useCallback(() => {
    const trimmed = input.trim();
    if (!trimmed || isTyping) return;

    const userMsg: Message = { id: nextId++, role: "user", text: trimmed };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setIsTyping(true);

    const delay = 800 + Math.random() * 400;
    setTimeout(() => {
      const response = getResponse(trimmed);
      setMessages((prev) => [
        ...prev,
        { id: nextId++, role: "bot", text: response },
      ]);
      setIsTyping(false);
    }, delay);
  }, [input, isTyping]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="flex min-h-screen flex-col bg-white dark:bg-black">
      {/* Back link */}
      <div className="fixed left-6 top-6 z-10">
        <Link
          to="/apps"
          className="inline-flex items-center gap-1.5 text-sm text-gray-500 transition-colors hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-200"
        >
          <ArrowLeft size={14} />
          Back
        </Link>
      </div>

      {/* Header */}
      <div className="border-b border-gray-200 px-6 pb-4 pt-16 text-center dark:border-gray-800">
        <h1 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
          sma1lbot
        </h1>
        <p className="mt-0.5 text-xs text-gray-500 dark:text-gray-400">
          Ask me anything about Jackson
        </p>
      </div>

      {/* Messages */}
      <div
        ref={scrollRef}
        className="flex-1 overflow-y-auto px-4 py-6 sm:px-6"
      >
        <div className="mx-auto max-w-2xl space-y-4">
          <AnimatePresence initial={false}>
            {messages.map((msg) => (
              <motion.div
                key={msg.id}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.25, ease: "easeOut" }}
                className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[80%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed sm:max-w-[70%] ${
                    msg.role === "user"
                      ? "bg-gray-200 text-gray-900 dark:bg-gray-800 dark:text-gray-100"
                      : "bg-indigo-50 text-gray-800 dark:bg-indigo-950/50 dark:text-gray-200"
                  }`}
                >
                  {msg.text.split("\n").map((line, i) => (
                    <span key={i}>
                      {line.split(/(\*\*[^*]+\*\*)/).map((part, j) =>
                        part.startsWith("**") && part.endsWith("**") ? (
                          <strong key={j} className="font-semibold">
                            {part.slice(2, -2)}
                          </strong>
                        ) : (
                          <span key={j}>{part}</span>
                        ),
                      )}
                      {i < msg.text.split("\n").length - 1 && <br />}
                    </span>
                  ))}
                </div>
              </motion.div>
            ))}
          </AnimatePresence>

          {/* Typing indicator */}
          <AnimatePresence>
            {isTyping && (
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -4 }}
                transition={{ duration: 0.2 }}
                className="flex justify-start"
              >
                <div className="flex gap-1 rounded-2xl bg-indigo-50 px-4 py-3 dark:bg-indigo-950/50">
                  {[0, 1, 2].map((i) => (
                    <motion.span
                      key={i}
                      className="inline-block h-2 w-2 rounded-full bg-indigo-400 dark:bg-indigo-300"
                      animate={{ y: [0, -6, 0] }}
                      transition={{
                        duration: 0.6,
                        repeat: Infinity,
                        delay: i * 0.15,
                        ease: "easeInOut",
                      }}
                    />
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Input */}
      <div className="border-t border-gray-200 px-4 py-4 dark:border-gray-800 sm:px-6">
        <div className="mx-auto flex max-w-2xl gap-3">
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask about Jackson..."
            disabled={isTyping}
            className="flex-1 rounded-xl border border-gray-200 bg-gray-50 px-4 py-2.5 text-sm text-gray-900 placeholder-gray-400 outline-none transition-colors focus:border-indigo-300 focus:ring-2 focus:ring-indigo-100 disabled:opacity-50 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100 dark:placeholder-gray-500 dark:focus:border-indigo-600 dark:focus:ring-indigo-900/30"
          />
          <button
            onClick={handleSend}
            disabled={!input.trim() || isTyping}
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-indigo-500 text-white transition-all hover:bg-indigo-600 disabled:opacity-40 disabled:hover:bg-indigo-500 dark:bg-indigo-600 dark:hover:bg-indigo-500"
            aria-label="Send message"
          >
            <Send size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}
