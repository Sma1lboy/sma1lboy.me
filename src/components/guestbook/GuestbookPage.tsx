import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { Link } from "@tanstack/react-router";
import { ArrowLeft, Send, MessageSquarePlus } from "lucide-react";
import { useSEO } from "@/hooks/useSEO";

const ease = [0.25, 0.46, 0.45, 0.94] as const;
const MAX_MESSAGE_LENGTH = 280;
const STORAGE_KEY = "guestbook-messages";

interface GuestbookMessage {
  id: string;
  name: string;
  message: string;
  timestamp: number;
  color: string;
  rotation: number;
}

const NOTE_COLORS = [
  "bg-amber-500/15 border-amber-500/25",
  "bg-rose-500/15 border-rose-500/25",
  "bg-sky-500/15 border-sky-500/25",
  "bg-emerald-500/15 border-emerald-500/25",
  "bg-violet-500/15 border-violet-500/25",
  "bg-pink-500/15 border-pink-500/25",
  "bg-teal-500/15 border-teal-500/25",
  "bg-orange-500/15 border-orange-500/25",
];

const SEED_MESSAGES: GuestbookMessage[] = [
  {
    id: "seed-1",
    name: "Linus Torvalds",
    message:
      "Talk is cheap. Show me the code. Nice portfolio though — at least you ship things.",
    timestamp: Date.now() - 86400000 * 30,
    color: NOTE_COLORS[0],
    rotation: -2.1,
  },
  {
    id: "seed-2",
    name: "Dan Abramov",
    message:
      "The best way to learn React is to build something you care about. This site proves it.",
    timestamp: Date.now() - 86400000 * 25,
    color: NOTE_COLORS[1],
    rotation: 1.5,
  },
  {
    id: "seed-3",
    name: "Evan You",
    message:
      "Clean design, smooth animations. Reminds me of when I first built my personal site. Keep iterating!",
    timestamp: Date.now() - 86400000 * 20,
    color: NOTE_COLORS[2],
    rotation: -1.2,
  },
  {
    id: "seed-4",
    name: "Ryan Dahl",
    message:
      "Simple is better than complex. Your site loads fast — that already puts you ahead of most.",
    timestamp: Date.now() - 86400000 * 15,
    color: NOTE_COLORS[3],
    rotation: 2.3,
  },
  {
    id: "seed-5",
    name: "TJ Holowaychuk",
    message:
      "Minimalism is underrated. I see you understand that. Also, dark mode by default — respect.",
    timestamp: Date.now() - 86400000 * 10,
    color: NOTE_COLORS[4],
    rotation: -0.8,
  },
  {
    id: "seed-6",
    name: "DHH",
    message:
      "Stop overthinking the stack. Ship it, learn, iterate. Looks like you already figured that out.",
    timestamp: Date.now() - 86400000 * 7,
    color: NOTE_COLORS[5],
    rotation: 1.8,
  },
  {
    id: "seed-7",
    name: "Guillermo Rauch",
    message:
      "The web is the platform. Great to see devs building beautiful things on it. Solid work here.",
    timestamp: Date.now() - 86400000 * 3,
    color: NOTE_COLORS[6],
    rotation: -1.6,
  },
  {
    id: "seed-8",
    name: "Sindre Sorhus",
    message:
      "I appreciate devs who care about the small details. The animations on this site are chef's kiss.",
    timestamp: Date.now() - 86400000 * 1,
    color: NOTE_COLORS[7],
    rotation: 0.9,
  },
];

function getStoredMessages(): GuestbookMessage[] {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      return JSON.parse(stored);
    }
  } catch {
    // ignore parse errors
  }
  return [];
}

function saveMessages(messages: GuestbookMessage[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(messages));
}

function formatTimestamp(ts: number): string {
  const diff = Date.now() - ts;
  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);

  if (minutes < 1) return "just now";
  if (minutes < 60) return `${minutes}m ago`;
  if (hours < 24) return `${hours}h ago`;
  if (days < 30) return `${days}d ago`;
  return new Date(ts).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.06,
    },
  },
};

const noteVariants = {
  hidden: { opacity: 0, y: 20, scale: 0.95 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.4,
      ease,
    },
  },
};

export default function GuestbookPage() {
  useSEO({
    title: "Guestbook",
    description: "Leave a message on my guestbook.",
    path: "/guestbook",
  });

  const [userMessages, setUserMessages] = useState<GuestbookMessage[]>(
    getStoredMessages,
  );
  const [name, setName] = useState("");
  const [message, setMessage] = useState("");

  const allMessages = useMemo(() => {
    return [...userMessages, ...SEED_MESSAGES].sort(
      (a, b) => b.timestamp - a.timestamp,
    );
  }, [userMessages]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !message.trim()) return;

    const newMessage: GuestbookMessage = {
      id: `user-${Date.now()}`,
      name: name.trim(),
      message: message.trim(),
      timestamp: Date.now(),
      color: NOTE_COLORS[Math.floor(Math.random() * NOTE_COLORS.length)],
      rotation: (Math.random() - 0.5) * 4,
    };

    const updated = [newMessage, ...userMessages];
    setUserMessages(updated);
    saveMessages(updated);
    setName("");
    setMessage("");
  };

  const charsLeft = MAX_MESSAGE_LENGTH - message.length;

  return (
    <div className="min-h-screen bg-white px-4 py-12 text-gray-900 sm:px-6 lg:px-8 dark:bg-[#0a0a0a] dark:text-gray-100">
      <div className="mx-auto max-w-2xl">
        {/* Back link */}
        <motion.div
          initial={{ opacity: 0, x: -12 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4, ease }}
        >
          <Link
            to="/"
            className="mb-8 inline-flex items-center gap-1.5 text-sm text-gray-500 transition-colors hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-200"
          >
            <ArrowLeft size={14} />
            Back
          </Link>
        </motion.div>

        {/* Page title */}
        <motion.h1
          className="mb-2 text-3xl font-bold tracking-tight sm:text-4xl"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease }}
        >
          Guestbook
        </motion.h1>
        <motion.p
          className="mb-8 text-gray-500 dark:text-gray-400"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.05, ease }}
        >
          Leave a message, say hi, or drop some wisdom.
        </motion.p>

        {/* Message form */}
        <motion.form
          onSubmit={handleSubmit}
          className="mb-10 rounded-xl border border-gray-200 p-4 sm:p-5 dark:border-[#1e1e1e]"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1, ease }}
        >
          <div className="mb-3 flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300">
            <MessageSquarePlus size={16} />
            Sign the guestbook
          </div>

          <div className="flex flex-col gap-3 sm:flex-row">
            <input
              type="text"
              placeholder="Your name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              maxLength={50}
              aria-label="Your name"
              className="rounded-lg border border-gray-200 bg-transparent px-3 py-2 text-sm outline-none transition-colors placeholder:text-gray-400 focus:border-gray-400 dark:border-[#2a2a2a] dark:placeholder:text-gray-600 dark:focus:border-gray-600"
            />
            <div className="relative flex-1">
              <input
                type="text"
                placeholder="Your message..."
                value={message}
                onChange={(e) =>
                  e.target.value.length <= MAX_MESSAGE_LENGTH &&
                  setMessage(e.target.value)
                }
                aria-label="Your message"
                className="w-full rounded-lg border border-gray-200 bg-transparent px-3 py-2 pr-16 text-sm outline-none transition-colors placeholder:text-gray-400 focus:border-gray-400 dark:border-[#2a2a2a] dark:placeholder:text-gray-600 dark:focus:border-gray-600"
              />
              <span
                className={`absolute right-3 top-1/2 -translate-y-1/2 text-xs tabular-nums ${
                  charsLeft < 30
                    ? charsLeft < 10
                      ? "text-red-400"
                      : "text-amber-400"
                    : "text-gray-400 dark:text-gray-600"
                }`}
              >
                {charsLeft}
              </span>
            </div>
          </div>

          <div className="mt-3 flex justify-end">
            <motion.button
              type="submit"
              disabled={!name.trim() || !message.trim()}
              className="inline-flex items-center gap-1.5 rounded-lg bg-gray-900 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-40 dark:bg-white dark:text-gray-900 dark:hover:bg-gray-200"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Send size={14} />
              Post
            </motion.button>
          </div>
        </motion.form>

        {/* Messages */}
        <motion.div
          className="grid gap-3 sm:grid-cols-2"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          aria-live="polite"
          aria-label="Guestbook messages"
        >
          {allMessages.map((msg) => (
            <motion.div
              key={msg.id}
              variants={noteVariants}
              className={`rounded-xl border p-4 ${msg.color}`}
              style={{ rotate: `${msg.rotation}deg` }}
              whileHover={{
                rotate: 0,
                scale: 1.03,
                transition: { duration: 0.2 },
              }}
            >
              <p className="mb-3 text-sm leading-relaxed text-gray-800 dark:text-gray-200">
                {msg.message}
              </p>
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-gray-600 dark:text-gray-400">
                  {msg.name}
                </span>
                <span className="text-xs text-gray-500 dark:text-gray-500">
                  {formatTimestamp(msg.timestamp)}
                </span>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Message count */}
        <motion.p
          className="mt-8 text-center text-xs text-gray-400 dark:text-gray-600"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.6, ease }}
        >
          {allMessages.length} message{allMessages.length !== 1 && "s"} &middot;
          stored locally in your browser
        </motion.p>
      </div>
    </div>
  );
}
