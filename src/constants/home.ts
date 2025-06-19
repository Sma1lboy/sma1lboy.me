// Featured projects data
export const featuredProjects = [
  {
    id: 1,
    title: "Pochi",
    description:
      "Your AI-powered teammate that actually gets it. Pochi reads your full codebase, remembers your patterns, turns Figma screenshots into real React components, traces bugs with full project context, and builds full features so you can focus on core architecture.",
    url: "https://app.getpochi.com",
    preview: "/images/pochi-preview.png",
    tech: "AI/ML • Full-Stack • React • TypeScript",
    year: "2025",
  },
  {
    id: 2,
    title: "TabbyML",
    description:
      "A self-hosted AI coding assistant offering an open-source alternative to GitHub Copilot. Features consumer-grade GPU support, OpenAPI integration, and seamless IDE extensions. Empowers developers with intelligent code completion, chat assistance, and repository-aware context understanding.",
    url: "https://github.com/TabbyML/tabby",
    preview: "/images/tabby-preview.png",
    tech: "Rust • AI/ML • Open Source • Self-Hosted",
    year: "2024",
  },
  {
    id: 3,
    title: "FoxyChat",
    description:
      "A cross-platform desktop AI chat application built with Electron and TypeScript. Features intelligent conversation capabilities, RobotJS automation, and a modern interface designed for seamless AI interactions.",
    url: "https://foxychat.net",
    preview: "/images/foxychat-preview.png",
    tech: "Electron • TypeScript • RobotJS • AI/ML",
    year: "2024",
  },
  {
    id: 4,
    title: "TaskForge",
    description:
      "A comprehensive full-stack task management platform built with modern web technologies. Features a monorepo architecture with separate client and server packages, database migrations, and production-ready deployment workflows.",
    url: "https://task-forge-website.vercel.app",
    preview: "/images/taskforge-preview.png",
    tech: "TypeScript • Monorepo • Full-Stack • Database",
    year: "2024",
  },
  {
    id: 5,
    title: "Personal Portfolio",
    description:
      "A minimalist portfolio website showcasing my work and experiences with modern web technologies.",
    url: "https://sma1lboy.me",
    preview: "/images/personal-preview.png",
    tech: "React • TanStack Router • Framer Motion",
    year: "2024",
  },
];

// Animation variants
export const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      duration: 0.6,
      staggerChildren: 0.1,
    },
  },
};

export const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
    },
  },
};

export const socialLinkVariants = {
  rest: { scale: 1, y: 0 },
  hover: {
    scale: 1.1,
    y: -2,
    transition: {
      duration: 0.2,
    },
  },
};

export const avatarVariants = {
  hidden: { opacity: 0, scale: 0.8, x: 50 },
  visible: {
    opacity: 1,
    scale: 1,
    x: 0,
    transition: {
      duration: 0.8,
      delay: 0.3,
    },
  },
};

export const slideVariants = {
  enterFromRight: { x: 300, opacity: 0 },
  enterFromLeft: { x: -300, opacity: 0 },
  center: { x: 0, opacity: 1 },
  exitToLeft: { x: -300, opacity: 0 },
  exitToRight: { x: 300, opacity: 0 },
};

// Social links data
export const socialLinks = [
  {
    href: "https://x.com/sma1lboy",
    label: "Twitter",
    icon: "Twitter",
  },
  {
    href: "https://space.bilibili.com/72605744",
    label: "Bilibili",
    icon: "Play",
  },
  {
    href: "https://github.com/Sma1lboy",
    label: "GitHub",
    icon: "Github",
  },
  {
    href: "https://www.linkedin.com/in/chong-chen-857214292/",
    label: "LinkedIn",
    icon: "Linkedin",
  },
  {
    href: "mailto:jackson@example.com",
    label: "Email",
    icon: "Mail",
  },
];
