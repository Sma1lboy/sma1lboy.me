import { experiences } from "../../../constants/experiences";
import { socialLinks } from "../../../constants/home";
import { Entry, experiments, flagships, products, skills } from "../../../constants/products";

/**
 * 三个 ASCII 版首页共用的数据视图 —— 只做派生,真相源还是 constants/。
 */

export const jobs = experiences
  .filter((e) => e.type === "work" || e.type === "internship")
  .sort((a, b) => b.period.start.localeCompare(a.period.start));

export const schools = experiences
  .filter((e) => e.type === "education")
  .sort((a, b) => b.period.start.localeCompare(a.period.start));

export const current = jobs.find((e) => !e.period.end);

/** tier 2/3 产品;tier 1 单独做大块 */
export const builds = products.filter((p) => p.tier !== 1);

export { experiments, flagships, skills };
export type { Entry };

/** 首屏只放 x / github / linkedin */
export const socials = socialLinks
  .filter((l) => ["Twitter", "GitHub", "LinkedIn"].includes(l.label))
  .map((l) => ({ href: l.href, label: l.label === "Twitter" ? "x" : l.label.toLowerCase() }));

export const stats = [
  { n: String(products.length + skills.length + experiments.length), l: "things built" },
  { n: "14k", l: "npm installs/mo" },
  { n: "180+", l: "github stars" },
  { n: String(flagships.length), l: "products shipped" },
];

export const BIO =
  "Mostly things that live in a terminal. At ByteDance I work on agent infrastructure and evaluation — the framework the team's agents run on, and the harness that decides whether they got better.";

/** 站内其他页面。全是真实路由 */
export const INTERNAL = [
  { to: "/apps", title: "apps", pitch: "interactive toys: a retro typewriter, a 3D receipt with cloth physics" },
  { to: "/cmt", title: "thoughts", pitch: "short notes on what I'm building and what I got wrong" },
  { to: "/api", title: "api", pitch: "this site's data as JSON endpoints" },
] as const;

export const ym = (s?: string) => (s ? `${s.slice(2, 4)}.${s.slice(5, 7)}` : "··.··");

export const metaOf = (e: Entry) =>
  [e.note ?? (e.stars ? `${e.stars}★` : null), e.lang].filter(Boolean).join(" · ");

export const MONO =
  'ui-monospace, "SF Mono", "JetBrains Mono", "Cascadia Mono", Menlo, Consolas, monospace';

/**
 * figlet 横幅的字号:按列数撑满可用宽度,上限 max px。
 * 等宽字形宽约 0.6em,pad 是左右总留白。
 */
export const fitFont = (cols: number, max: number, pad = "3rem") =>
  `min(${max}px, calc((100vw - ${pad}) / ${(cols * 0.6).toFixed(1)}))`;
