/**
 * 产品与 skill 台账 —— 首页的真相源。
 *
 * 分层不是装饰:tier 决定一个东西在首页占多大版面。
 *   1 = 主力,大卡片 + 封面图 + 大数字
 *   2 = 正式产品,标准台账行
 *   3 = 实验/练手,紧凑行
 * star 数是手抄快照(首页保持零网络请求),数量级对就行。改数据只动这个文件。
 */

export interface Entry {
  name: string;
  /** 落地页优先;没有就指向 repo */
  href: string;
  /** 一句话,小写开头,不加句号 —— 台账条目不是营销文案 */
  pitch: string;
  repo?: string;
  stars?: number;
  lang?: string;
  year: string;
  /** 还在推进中 —— 唯一会拿到强调色的状态 */
  live?: boolean;
  /** 比 star 更能说明问题的那个数字,有就盖过 star */
  note?: string;
  tier: 1 | 2 | 3;
  /** tier 1 专用:public/images/covers/<cover>.png */
  cover?: string;
}

/** 产品 —— 有落地页、给别人用的东西 */
export const products: Entry[] = [
  {
    name: "kobe",
    href: "https://kobe.sma1lboy.me",
    pitch:
      "the agent multiplexer in your shell — fan out N coding agents into isolated git worktrees, compare, merge the winner",
    repo: "https://github.com/Sma1lboy/kobe",
    stars: 94,
    lang: "TypeScript",
    year: "2026",
    live: true,
    note: "14k npm/mo",
    tier: 1,
    cover: "kobe",
  },
  {
    name: "codefox",
    href: "https://codefox.sma1lboy.me",
    pitch: "where the fox came from — the original AI full-stack project generator, multi-agent",
    repo: "https://github.com/CodeFox-Repo/codefox",
    stars: 75,
    lang: "TypeScript",
    year: "2025",
    live: true,
    tier: 1,
    cover: "codefox",
  },
  {
    name: "coforce",
    href: "https://coforce.sma1lboy.me",
    pitch:
      "job hunt on autopilot — discovers postings, tailors the resume, fills applications in your own Chrome, every file local",
    repo: "https://github.com/Sma1lboy/coforce-apply",
    stars: 4,
    lang: "JavaScript",
    year: "2026",
    live: true,
    tier: 1,
    cover: "coforce",
  },
  {
    name: "convera",
    href: "https://convera.sma1lboy.me",
    pitch:
      "desktop AI agent workspace — conversations, agents and model configs stored on your own machine, with MCP tools",
    repo: "https://github.com/CodeFox-Repo/Convera",
    stars: 2,
    lang: "TypeScript",
    year: "2026",
    live: true,
    tier: 1,
    cover: "convera",
  },
  {
    name: "brand-studio",
    href: "https://brand-studio.sma1lboy.me",
    pitch:
      "generate → review → settle: brand assets as a repeatable pipeline — it curates and seals, producers generate, humans gate every round",
    repo: "https://github.com/Sma1lboy/brand-studio",
    stars: 3,
    lang: "Python",
    year: "2026",
    live: true,
    tier: 2,
  },
  {
    name: "artifact-share",
    href: "https://share.sma1lboy.me",
    pitch:
      "publish an HTML page, get the verdicts back — one POST turns a self-contained board into a public review link the agent reads as JSON",
    repo: "https://github.com/Sma1lboy/artifact-share",
    lang: "JavaScript",
    year: "2026",
    live: true,
    note: "~200 lines",
    tier: 2,
  },
  {
    name: "codefox-local",
    href: "https://github.com/CodeFox-Repo/codefox-local",
    pitch: "the AI website generator running on your own machine — chat left, live preview right",
    repo: "https://github.com/CodeFox-Repo/codefox-local",
    lang: "TypeScript",
    year: "2026",
    live: true,
    tier: 2,
  },
  {
    name: "foxychat",
    href: "https://foxychat.sma1lboy.me",
    pitch: "cross-platform desktop AI chat built on Electron + RobotJS automation",
    repo: "https://github.com/CodeFox-Repo/foxychat",
    lang: "TypeScript",
    year: "2024",
    tier: 2,
  },
  {
    name: "kobeMC",
    href: "https://kobemc.vercel.app",
    pitch:
      "Minecraft launcher built from scratch — Rust core + Tauri v2, one-click Fabric / Quilt / Forge / NeoForge, Modrinth built in",
    repo: "https://github.com/Sma1lboy/mc",
    stars: 4,
    lang: "Rust",
    year: "2025",
    live: true,
    tier: 2,
  },
  {
    name: "foxscreen",
    href: "https://github.com/Sma1lboy/foxscreen",
    pitch: "cross-platform AI video editor — transcript-driven keep/cut, multi-track timeline",
    repo: "https://github.com/Sma1lboy/foxscreen",
    stars: 1,
    lang: "TypeScript",
    year: "2026",
    tier: 2,
  },
  {
    name: "FoxPhotoColor",
    href: "https://github.com/Sma1lboy/FoxPhotoColor",
    pitch: "any photo → a minimalist colour-palette poster, five modes, SwiftUI",
    repo: "https://github.com/Sma1lboy/FoxPhotoColor",
    lang: "Swift",
    year: "2026",
    tier: 2,
  },
];

/** Agent skills —— 装进 Claude Code 里的东西,和上面是两种物种 */
export const skills: Entry[] = [
  {
    name: "autonomous",
    href: "https://github.com/Sma1lboy/autonomous",
    pitch: "self-driving project agent — drop into any repo, it keeps improving beyond one session",
    stars: 6,
    year: "2026",
    tier: 2,
  },
  {
    name: "open-design",
    href: "https://github.com/Sma1lboy/open-design",
    pitch: "natural language in, single-file HTML design artifacts out",
    stars: 3,
    year: "2026",
    tier: 2,
  },
  {
    name: "student-skill",
    href: "https://github.com/Sma1lboy/student-skill",
    pitch: "学术助手 —— 写作/代码风格画像、去 AI 化、Canvas 集成",
    stars: 4,
    year: "2026",
    tier: 2,
  },
  {
    name: "skill-story",
    href: "https://github.com/Sma1lboy/skill-story",
    pitch: "test an agent skill's conversation like code — sandboxed tmux captures with real ANSI",
    year: "2026",
    tier: 2,
  },
  {
    name: "codefox-skill",
    href: "https://github.com/CodeFox-Repo/codefox-skill",
    pitch: "codefox as a skill — natural language in, a runnable website project out",
    year: "2026",
    tier: 2,
  },
  {
    name: "brand-video",
    href: "https://github.com/Sma1lboy/brand-video",
    pitch: "script or reference footage in, a storyboarded Remotion film out",
    year: "2026",
    tier: 2,
  },
  {
    name: "kobe-plugins",
    href: "https://github.com/Sma1lboy/kobe-plugins",
    pitch: "official plugins for kobe",
    year: "2026",
    tier: 3,
  },
  {
    name: "claude-remote-watchdog",
    href: "https://github.com/Sma1lboy/claude-remote-watchdog",
    pitch: "auto-detect and revive dead Claude Code sessions in tmux",
    stars: 1,
    lang: "Shell",
    year: "2026",
    tier: 3,
  },
];

/** 实验与练手 —— 不成产品,但是记录的一部分。写编译器、模拟器、插件那一类。 */
export const experiments: Entry[] = [
  {
    name: "Unlimited-DeepL-Pro",
    href: "https://github.com/Sma1lboy/Unlimited-DeepL-Pro",
    pitch: "unmetered DeepL",
    stars: 21,
    lang: "JavaScript",
    year: "2023",
    tier: 3,
  },
  {
    name: "cgit",
    href: "https://github.com/Sma1lboy/cgit",
    pitch: "git, reimplemented in Java",
    stars: 8,
    lang: "Java",
    year: "2023",
    tier: 3,
  },
  {
    name: "csh",
    href: "https://github.com/Sma1lboy/csh",
    pitch: "a Unix shell in C",
    stars: 6,
    lang: "C",
    year: "2023",
    tier: 3,
  },
  {
    name: "duckov-preset-loadout",
    href: "https://github.com/Sma1lboy/duckov-preset-loadout",
    pitch: "preset loadout mod",
    stars: 6,
    lang: "C#",
    year: "2026",
    tier: 3,
  },
  {
    name: "obsidian-same-name-dir-hidden",
    href: "https://github.com/Sma1lboy/obsidian-same-name-dir-hidden",
    pitch: "Obsidian plugin — fold the directory that shadows a note",
    stars: 5,
    lang: "TypeScript",
    year: "2024",
    tier: 3,
  },
  {
    name: "LC3-VM",
    href: "https://github.com/Sma1lboy/LC3-VM",
    pitch: "Little Computer 3 emulator",
    stars: 3,
    lang: "C++",
    year: "2023",
    tier: 3,
  },
  {
    name: "ArcticAI",
    href: "https://github.com/Sma1lboy/ArcticAI",
    pitch: "multi-agent framework orchestrating the codefox ecosystem",
    stars: 2,
    lang: "TypeScript",
    year: "2025",
    tier: 3,
  },
  {
    name: "EFTarkovLiveMap",
    href: "https://github.com/Sma1lboy/EFTarkovLiveMap",
    pitch: "live position map for Escape from Tarkov",
    stars: 7,
    lang: "Python",
    year: "2022",
    tier: 3,
  },
  {
    name: "ccgameboy-emulator",
    href: "https://github.com/Sma1lboy/ccgameboy-emulator",
    pitch: "Game Boy emulator",
    stars: 1,
    year: "2024",
    tier: 3,
  },
  {
    name: "json-parser",
    href: "https://github.com/Sma1lboy/json-parser",
    pitch: "a JSON parser in JavaScript, no dependencies",
    stars: 1,
    lang: "JavaScript",
    year: "2023",
    tier: 3,
  },
  {
    name: "ArenaForFight",
    href: "https://github.com/Sma1lboy/ArenaForFight",
    pitch: "Minecraft PvP arena plugin",
    stars: 1,
    lang: "Java",
    year: "2022",
    tier: 3,
  },
  {
    name: "onesentenceForMac",
    href: "https://github.com/Sma1lboy/onesentenceForMac",
    pitch: "one sentence a day, in the menu bar",
    stars: 1,
    lang: "Swift",
    year: "2023",
    tier: 3,
  },
];

/** tier 1 —— 首页顶部的大卡片 */
export const flagships = products.filter((p) => p.tier === 1);
