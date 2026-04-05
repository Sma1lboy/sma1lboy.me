export type UsesCategory = "hardware" | "development" | "ai-tools" | "design" | "productivity";

export interface UsesItem {
  id: string;
  name: string;
  description: string;
  url?: string;
}

export const categoryMeta: Record<UsesCategory, { label: string; emoji: string }> = {
  hardware: { label: "Hardware", emoji: "💻" },
  development: { label: "Development", emoji: "🛠" },
  "ai-tools": { label: "AI Tools", emoji: "🤖" },
  design: { label: "Design", emoji: "🎨" },
  productivity: { label: "Productivity", emoji: "⚡" },
};

export const usesItems: Record<UsesCategory, UsesItem[]> = {
  hardware: [
    {
      id: "macbook",
      name: 'MacBook Pro 16" M3 Max',
      description: "Main development machine with 48GB RAM",
    },
    {
      id: "monitor",
      name: 'LG 27" 4K Monitor',
      description: "External display for productivity",
    },
    {
      id: "keyboard",
      name: "Keychron K2 Pro",
      description: "Mechanical keyboard with brown switches",
    },
    {
      id: "mouse",
      name: "Logitech MX Master 3S",
      description: "Ergonomic mouse for long sessions",
    },
    {
      id: "headphones",
      name: "Sony WH-1000XM5",
      description: "Noise-cancelling headphones for deep focus",
    },
    {
      id: "dock",
      name: "CalDigit TS4",
      description: "Thunderbolt dock for single-cable setup",
    },
  ],
  development: [
    {
      id: "vscode",
      name: "VS Code",
      description: "Primary editor with vim keybindings",
      url: "https://code.visualstudio.com",
    },
    {
      id: "neovim",
      name: "Neovim",
      description: "Terminal editor for quick edits",
      url: "https://neovim.io",
    },
    {
      id: "iterm2",
      name: "iTerm2",
      description: "Terminal emulator with split panes",
      url: "https://iterm2.com",
    },
    {
      id: "zsh",
      name: "Zsh + Oh My Zsh",
      description: "Shell with custom aliases and plugins",
    },
    {
      id: "docker",
      name: "Docker Desktop",
      description: "Container management for local dev",
      url: "https://docker.com",
    },
    {
      id: "homebrew",
      name: "Homebrew",
      description: "Package manager for macOS",
      url: "https://brew.sh",
    },
  ],
  "ai-tools": [
    {
      id: "claude-code",
      name: "Claude Code",
      description: "AI coding assistant in the terminal",
      url: "https://claude.ai/claude-code",
    },
    {
      id: "copilot",
      name: "GitHub Copilot",
      description: "AI pair programming in VS Code",
      url: "https://github.com/features/copilot",
    },
    {
      id: "cursor",
      name: "Cursor",
      description: "AI-native code editor for exploration",
      url: "https://cursor.com",
    },
    {
      id: "ollama",
      name: "Ollama",
      description: "Local LLM runner for experiments",
      url: "https://ollama.com",
    },
  ],
  design: [
    {
      id: "figma",
      name: "Figma",
      description: "UI/UX design and prototyping",
      url: "https://figma.com",
    },
    {
      id: "inter",
      name: "Inter",
      description: "Primary UI font family",
      url: "https://rsms.me/inter",
    },
    {
      id: "jetbrains-mono",
      name: "JetBrains Mono",
      description: "Monospace font for code",
      url: "https://jetbrains.com/mono",
    },
    {
      id: "excalidraw",
      name: "Excalidraw",
      description: "Quick whiteboarding and diagrams",
      url: "https://excalidraw.com",
    },
  ],
  productivity: [
    {
      id: "raycast",
      name: "Raycast",
      description: "Launcher replacing Spotlight",
      url: "https://raycast.com",
    },
    {
      id: "arc",
      name: "Arc Browser",
      description: "Chromium browser with workspaces",
      url: "https://arc.net",
    },
    {
      id: "notion",
      name: "Notion",
      description: "Notes, docs, and project wikis",
      url: "https://notion.so",
    },
    {
      id: "linear",
      name: "Linear",
      description: "Issue tracking for side projects",
      url: "https://linear.app",
    },
    {
      id: "1password",
      name: "1Password",
      description: "Password and secrets management",
      url: "https://1password.com",
    },
    {
      id: "cleanshot",
      name: "CleanShot X",
      description: "Screenshot and screen recording tool",
      url: "https://cleanshot.com",
    },
  ],
};

export const categoryOrder: UsesCategory[] = [
  "hardware",
  "development",
  "ai-tools",
  "design",
  "productivity",
];
