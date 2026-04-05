import { motion } from "framer-motion";
import { useNavigate } from "@tanstack/react-router";

const randomRoutes = ["/apps", "/cmt", "/profile", "/api", "/apps/receipt", "/apps/typewriter"];

function randomNav(navigate: ReturnType<typeof useNavigate>) {
  const route = randomRoutes[Math.floor(Math.random() * randomRoutes.length)];
  navigate({ to: route });
}

const now = [
  "SDE @ TikTok — distributed systems",
  "building pochi — AI coding teammate",
  "open source — tabby, codefox",
];

const artifacts = [
  { label: "codefox", id: "codefox" },
  { label: "tabby", id: "tabby" },
  { label: "pochi", id: "pochi" },
  { label: "foxychat", id: "foxychat" },
  { label: "all projects →", id: "projects", route: "/projects" },
];

const labs = [
  { label: "receipt", id: "receipt" },
  { label: "typewriter", id: "typewriter" },
  { label: "terminal", id: "terminal" },
];

const stack = ["typescript", "rust", "react", "python", "java", "postgres"];

const socials = [
  { label: "x.com", href: "https://x.com/sma1lboy" },
  { label: "github", href: "https://github.com/Sma1lboy" },
  { label: "linkedin", href: "https://www.linkedin.com/in/chong-chen-857214292/" },
];

export function Sidebar() {
  const navigate = useNavigate();

  return (
    <motion.aside
      className="flex h-full w-full flex-col gap-8 overflow-y-auto p-6 md:p-8"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0, ease: [0.25, 0.46, 0.45, 0.94] }}
    >
      <div>
        <h1 className="text-sm font-bold tracking-widest text-gray-900 dark:text-[#e0e0e0]">
          SMA1LBOY
        </h1>
        <p className="mt-3 text-[13px] leading-relaxed text-gray-500 dark:text-[#888]">
          Full-stack dev. CS @ UW-Madison. Building AI tooling and open-source at TikTok. GSoC
          alumnus.
        </p>
      </div>

      <div>
        <h2 className="text-[11px] tracking-[0.2em] text-gray-400 uppercase dark:text-[#666]">
          Now
        </h2>
        <ul className="mt-3 space-y-2">
          {now.map((item) => (
            <li key={item} className="text-[13px] text-gray-600 dark:text-[#b0b0b0]">
              {item}
            </li>
          ))}
        </ul>
      </div>

      <div>
        <h2 className="text-[11px] tracking-[0.2em] text-gray-400 uppercase dark:text-[#666]">
          Artifacts
        </h2>
        <ul className="mt-3 space-y-2">
          {artifacts.map((item) => (
            <li key={item.id}>
              <button
                onClick={() =>
                  "route" in item && item.route ? navigate({ to: item.route }) : randomNav(navigate)
                }
                className="text-[13px] text-gray-600 transition-colors duration-150 hover:cursor-pointer hover:text-gray-900 dark:text-[#b0b0b0] dark:hover:text-white"
              >
                {item.label}
              </button>
            </li>
          ))}
        </ul>
      </div>

      <div>
        <h2 className="text-[11px] tracking-[0.2em] text-gray-400 uppercase dark:text-[#666]">
          Lab
        </h2>
        <ul className="mt-3 space-y-2">
          {labs.map((item) => (
            <li key={item.id}>
              <button
                onClick={() => randomNav(navigate)}
                className="text-[13px] text-gray-600 transition-colors duration-150 hover:cursor-pointer hover:text-gray-900 dark:text-[#b0b0b0] dark:hover:text-white"
              >
                {item.label}
              </button>
            </li>
          ))}
        </ul>
      </div>

      <div>
        <h2 className="text-[11px] tracking-[0.2em] text-gray-400 uppercase dark:text-[#666]">
          Stack
        </h2>
        <ul className="mt-3 space-y-2">
          {stack.map((item) => (
            <li key={item} className="text-[13px] text-gray-600 dark:text-[#b0b0b0]">
              {item}
            </li>
          ))}
        </ul>
      </div>

      <div>
        <h2 className="text-[11px] tracking-[0.2em] text-gray-400 uppercase dark:text-[#666]">
          Social
        </h2>
        <ul className="mt-3 space-y-2">
          {socials.map((item) => (
            <li key={item.label}>
              <a
                href={item.href}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[13px] text-gray-600 transition-colors duration-150 hover:text-gray-900 dark:text-[#b0b0b0] dark:hover:text-white"
              >
                {item.label}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </motion.aside>
  );
}
