import { socialLinks } from "../../constants/home";
import { products, skills } from "../../constants/products";
import { BIO, current, jobs, schools } from "../homes/ascii/data";

/**
 * 简历的数据视图 —— /resume 页面和构建时生成的 llms-full.txt 共用这一份。
 * 只做派生,真相源还是 constants/。
 *
 * 只收站内数据里能对得上的东西:奖项(GSoC 没写项目、黑客松日期存疑)和
 * 教育里的"预计毕业"这类会过期的话不进简历,等 owner 补准了再加。
 * 纯 TS、只用相对路径 —— vite.config.ts 在构建时直接 import 它。
 */

export const SITE = "https://sma1lboy.me";

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

/** "2025-10" → "Oct 2025" */
const month = (s: string) => `${MONTHS[Number(s.slice(5, 7)) - 1]} ${s.slice(0, 4)}`;

const span = (p: { start: string; end?: string }) =>
  `${month(p.start)} – ${p.end ? month(p.end) : "present"}`;

const mail = socialLinks.find((l) => l.href.startsWith("mailto:"));

export const person = {
  name: "Chong Chen",
  native: "陈重",
  handle: "sma1lboy",
  headline: current ? `${current.title} @ ${current.company}` : "",
  location: current?.location ?? "",
  email: mail ? mail.href.slice("mailto:".length) : "",
  /** 站点放第一个;其余照 socialLinks 的顺序,去掉邮箱 */
  links: [
    { label: "Site", href: SITE },
    ...socialLinks
      .filter((l) => l !== mail)
      .map((l) => ({ label: l.label === "Twitter" ? "X" : l.label, href: l.href })),
  ],
};

export const summary = BIO;

export const work = jobs.map((e) => ({
  org: e.company ?? "",
  title: e.title,
  when: span(e.period),
  location: e.location ?? "",
  href: e.url,
  points: e.achievements ?? [],
}));

/** achievements 里只有 GPA 是事实;"Expected graduation"之类的叙述不收 */
export const education = schools.map((e) => ({
  org: e.organization ?? "",
  title: e.title,
  when: span(e.period),
  location: e.location ?? "",
  points: (e.achievements ?? []).filter((a) => a.startsWith("GPA")),
}));

/** 产品按台账顺序;skill 单列,和首页一样是两种物种 */
export const projects = products.map((e) => ({
  name: e.name,
  href: e.href,
  repo: e.repo,
  pitch: e.pitch,
  meta: [e.note, e.stars ? `${e.stars}★` : null, e.lang].filter(Boolean).join(" · "),
  year: e.year,
  tier: e.tier,
}));

export const agentSkills = skills
  .filter((e) => e.tier !== 3)
  .map((e) => ({ name: e.name, href: e.href, pitch: e.pitch }));

/** 去掉协议,打印出来短一点 */
export const bare = (href: string) =>
  href.replace(/^mailto:|^https?:\/\/(www\.)?/, "").replace(/\/$/, "");
