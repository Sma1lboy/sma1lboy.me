export interface Experience {
  company: string;
  role: string;
  period: string;
  description: string;
  tags: string[];
  color: string;
}

export interface Education {
  school: string;
  degree: string;
  period: string;
  details: string;
}

export interface SkillCategory {
  name: string;
  skills: string[];
}

export interface Contribution {
  project: string;
  description: string;
  role: string;
  url: string;
}

export interface Achievement {
  title: string;
  description: string;
}

export const resumeData = {
  name: "Jackson Chen",
  handle: "sma1lboy",
  title: "Full-Stack Developer & AI Engineer",
  email: "541898146chen@gmail.com",
  github: "https://github.com/Sma1lboy",
  linkedin: "https://www.linkedin.com/in/chong-chen-857214292/",
  twitter: "https://x.com/sma1lboy",

  education: [
    {
      school: "University of Illinois at Urbana-Champaign",
      degree: "Bachelor of Science, Computer Science",
      period: "2022 — 2026",
      details: "Focus on systems programming, AI/ML, and software engineering.",
    },
  ] as Education[],

  experience: [
    {
      company: "Pochi / CodeFox",
      role: "Founder & Lead Developer",
      period: "2024 — Present",
      description:
        "Building an AI-powered code generation platform. Architecting the full-stack system from LLM orchestration to frontend tooling.",
      tags: ["TypeScript", "React", "LLM", "RAG", "Node.js"],
      color: "#6366f1",
    },
    {
      company: "TabbyML",
      role: "Open Source Contributor",
      period: "2024",
      description:
        "Contributed to the core Rust codebase of a self-hosted AI coding assistant. Worked on inference pipeline and IDE integration features.",
      tags: ["Rust", "AI", "Open Source", "IDE Tooling"],
      color: "#f59e0b",
    },
    {
      company: "FoxyChat",
      role: "Creator",
      period: "2023 — 2024",
      description:
        "Built a cross-platform AI chat application using Electron. Implemented multi-model support and real-time streaming interfaces.",
      tags: ["Electron", "TypeScript", "React", "LLM"],
      color: "#10b981",
    },
  ] as Experience[],

  skills: [
    {
      name: "Languages",
      skills: ["TypeScript", "JavaScript", "Rust", "Python", "Java", "Go", "Kotlin"],
    },
    {
      name: "Frameworks",
      skills: ["React", "Next.js", "Node.js", "Electron", "Spring Boot"],
    },
    {
      name: "AI / ML",
      skills: ["LLM Integration", "RAG", "Agent Systems", "Prompt Engineering"],
    },
    {
      name: "Tools",
      skills: ["Git", "Docker", "Kubernetes", "AWS", "Linux", "CI/CD"],
    },
  ] as SkillCategory[],

  contributions: [
    {
      project: "TabbyML/tabby",
      description:
        "Self-hosted AI coding assistant — significant contributor to core Rust codebase",
      role: "Contributor",
      url: "https://github.com/TabbyML/tabby",
    },
    {
      project: "Pochi / CodeFox",
      description: "AI-powered code generation platform — founder and primary maintainer",
      role: "Founder",
      url: "https://github.com/Sma1lboy/codefox",
    },
    {
      project: "AI/ML Ecosystem",
      description:
        "Various contributions to open source AI tooling and developer experience projects",
      role: "Contributor",
      url: "https://github.com/Sma1lboy",
    },
  ] as Contribution[],

  achievements: [
    {
      title: "Founded Pochi",
      description: "AI coding assistant platform used by developers for automated code generation.",
    },
    {
      title: "Core Contributor — TabbyML",
      description:
        "Significant contributions to a self-hosted AI coding assistant with 1000+ GitHub stars.",
    },
    {
      title: "UIUC Computer Science",
      description: "Pursuing CS at one of the top computer science programs in the United States.",
    },
  ] as Achievement[],
};
