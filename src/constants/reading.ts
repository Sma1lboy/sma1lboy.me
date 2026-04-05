export type ReadingCategory = "ai-ml" | "software-engineering" | "design" | "productivity";

export interface ReadingEntry {
  id: string;
  title: string;
  author: string;
  note: string;
  url: string;
  category: ReadingCategory;
}

export const categoryLabels: Record<ReadingCategory, string> = {
  "ai-ml": "AI/ML Papers",
  "software-engineering": "Software Engineering",
  design: "Design",
  productivity: "Productivity",
};

export const categoryColors: Record<ReadingCategory, { badge: string; dot: string }> = {
  "ai-ml": {
    badge: "bg-violet-500/10 text-violet-600 dark:text-violet-400",
    dot: "bg-violet-500",
  },
  "software-engineering": {
    badge: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
    dot: "bg-emerald-500",
  },
  design: {
    badge: "bg-amber-500/10 text-amber-600 dark:text-amber-400",
    dot: "bg-amber-500",
  },
  productivity: {
    badge: "bg-sky-500/10 text-sky-600 dark:text-sky-400",
    dot: "bg-sky-500",
  },
};

export const readingList: ReadingEntry[] = [
  // AI/ML Papers
  {
    id: "attention-is-all-you-need",
    title: "Attention Is All You Need",
    author: "Vaswani et al.",
    note: "The paper that started the transformer revolution. Every modern LLM traces back to this architecture — understanding it is non-negotiable.",
    url: "https://arxiv.org/abs/1706.03762",
    category: "ai-ml",
  },
  {
    id: "bert",
    title: "BERT: Pre-training of Deep Bidirectional Transformers",
    author: "Devlin et al.",
    note: "Showed how pre-training on unlabeled text then fine-tuning could dominate NLP benchmarks. Changed how I think about transfer learning.",
    url: "https://arxiv.org/abs/1810.04805",
    category: "ai-ml",
  },
  {
    id: "scaling-laws",
    title: "Scaling Laws for Neural Language Models",
    author: "Kaplan et al.",
    note: "Proved that model performance follows predictable power laws with scale. This paper explains why bigger models keep getting better.",
    url: "https://arxiv.org/abs/2001.08361",
    category: "ai-ml",
  },
  {
    id: "constitutional-ai",
    title: "Constitutional AI: Harmlessness from AI Feedback",
    author: "Bai et al.",
    note: "Elegant approach to alignment — using AI to critique and revise its own outputs. Core to how modern assistants are built safely.",
    url: "https://arxiv.org/abs/2212.08073",
    category: "ai-ml",
  },
  {
    id: "react-agent",
    title: "ReAct: Synergizing Reasoning and Acting in Language Models",
    author: "Yao et al.",
    note: "The reasoning-plus-action loop that powers modern AI agents. Directly influenced how I build agent architectures in my projects.",
    url: "https://arxiv.org/abs/2210.03629",
    category: "ai-ml",
  },
  {
    id: "tree-of-thoughts",
    title: "Tree of Thoughts: Deliberate Problem Solving with LLMs",
    author: "Yao et al.",
    note: "Goes beyond chain-of-thought by exploring multiple reasoning paths. A key insight for building AI systems that can plan and backtrack.",
    url: "https://arxiv.org/abs/2305.10601",
    category: "ai-ml",
  },

  // Software Engineering
  {
    id: "ddia",
    title: "Designing Data-Intensive Applications",
    author: "Martin Kleppmann",
    note: "The best systems design book I've read. Makes distributed systems tangible — I reference it constantly when designing backend architectures.",
    url: "https://dataintensive.net/",
    category: "software-engineering",
  },
  {
    id: "philosophy-software-design",
    title: "A Philosophy of Software Design",
    author: "John Ousterhout",
    note: "Short, opinionated, and right about most things. The idea of 'deep modules' changed how I think about API boundaries.",
    url: "https://web.stanford.edu/~ouster/cgi-bin/aposd.php",
    category: "software-engineering",
  },
  {
    id: "pragmatic-programmer",
    title: "The Pragmatic Programmer",
    author: "David Thomas & Andrew Hunt",
    note: "Timeless craft advice. 'Don't repeat yourself' and 'tracer bullets' are concepts I apply daily without thinking about it.",
    url: "https://pragprog.com/titles/tpp20/the-pragmatic-programmer-20th-anniversary-edition/",
    category: "software-engineering",
  },
  {
    id: "clean-code",
    title: "Clean Code",
    author: "Robert C. Martin",
    note: "Not everything ages perfectly, but the core message — code is read far more than written — fundamentally shaped my early habits.",
    url: "https://www.oreilly.com/library/view/clean-code-a/9780136083238/",
    category: "software-engineering",
  },
  {
    id: "system-design-interview",
    title: "System Design Interview",
    author: "Alex Xu",
    note: "Practical walkthroughs of real-world architecture problems. Great for building intuition about tradeoffs at scale.",
    url: "https://www.amazon.com/System-Design-Interview-insiders-Second/dp/B08CMF2CQF",
    category: "software-engineering",
  },

  // Design
  {
    id: "refactoring-ui",
    title: "Refactoring UI",
    author: "Adam Wathan & Steve Schoger",
    note: "Taught me more about visual design than any other resource. Practical tips I use every time I build a UI — spacing, hierarchy, color.",
    url: "https://www.refactoringui.com/",
    category: "design",
  },
  {
    id: "design-everyday-things",
    title: "The Design of Everyday Things",
    author: "Don Norman",
    note: "Affordances, signifiers, feedback loops — these concepts apply everywhere, from door handles to API design.",
    url: "https://www.amazon.com/Design-Everyday-Things-Revised-Expanded/dp/0465050654",
    category: "design",
  },
  {
    id: "dont-make-me-think",
    title: "Don't Make Me Think",
    author: "Steve Krug",
    note: "The shortest, most impactful UX book. If your interface needs explanation, it needs redesign.",
    url: "https://sensible.com/dont-make-me-think/",
    category: "design",
  },

  // Productivity
  {
    id: "deep-work",
    title: "Deep Work",
    author: "Cal Newport",
    note: "Made me ruthless about protecting focus time. The ability to concentrate without distraction is the most valuable skill in knowledge work.",
    url: "https://calnewport.com/deep-work-rules-for-focused-success-in-a-distracted-world/",
    category: "productivity",
  },
  {
    id: "atomic-habits",
    title: "Atomic Habits",
    author: "James Clear",
    note: "Systems over goals. The 1% improvement compound effect applies directly to learning new technologies and building side projects.",
    url: "https://jamesclear.com/atomic-habits",
    category: "productivity",
  },
  {
    id: "show-your-work",
    title: "Show Your Work!",
    author: "Austin Kleon",
    note: "Convinced me to share my work publicly — open source contributions, blog posts, and building in the open.",
    url: "https://austinkleon.com/show-your-work/",
    category: "productivity",
  },
];
