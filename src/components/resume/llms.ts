import { INTERNAL, experiments } from "../homes/ascii/data";
import { SITE, agentSkills, bare, education, person, projects, summary, work } from "./data";

/**
 * /llms.txt 和 /llms-full.txt 的正文(https://llmstxt.org)。
 * vite 插件在 build 时调用,产物写进 dist/ —— 数据改了重新构建就同步,不存手写副本。
 */

const contact = [`- Email: ${person.email}`, ...person.links.map((l) => `- ${l.label}: ${l.href}`)];

export function llmsTxt() {
  return [
    `# ${person.name} (${person.handle})`,
    "",
    `> ${person.headline}, ${person.location}. Builds agent infrastructure, evaluation harnesses and terminal tools for coding agents.`,
    "",
    summary,
    "",
    `Also written ${person.native}. GitHub and older pages use the name Jackson Chen.`,
    "",
    "## Products",
    "",
    ...projects.map(
      (p) =>
        `- [${p.name}](${p.href}): ${p.pitch}${p.meta ? ` (${p.meta})` : ""}${p.repo && p.repo !== p.href ? `. Source: ${p.repo}` : ""}`,
    ),
    "",
    "## Agent skills",
    "",
    ...agentSkills.map((s) => `- [${s.name}](${s.href}): ${s.pitch}`),
    "",
    "## Contact",
    "",
    ...contact,
    "",
    "## Pages",
    "",
    `- [Home](${SITE}/): projects, skills and work history, written as a man page`,
    `- [Resume](${SITE}/resume): one-page resume, printable to A4`,
    `- [Full resume as text](${SITE}/llms-full.txt): the same resume in Markdown`,
    ...INTERNAL.map((p) => `- [${p.title}](${SITE}${p.to}): ${p.pitch}`),
    "",
    "## Optional",
    "",
    ...experiments.map((e) => `- [${e.name}](${e.href}): ${e.pitch}`),
    "",
  ].join("\n");
}

export function llmsFullTxt() {
  return [
    `# ${person.name} (${person.handle}) — Resume`,
    "",
    `> ${person.headline} · ${person.location}`,
    "",
    "## Contact",
    "",
    ...contact,
    "",
    "## Summary",
    "",
    summary,
    "",
    "## Experience",
    "",
    ...work.flatMap((w) => [
      `### ${w.title} — ${w.org}`,
      "",
      [w.when, w.location, w.href].filter(Boolean).join(" · "),
      "",
      ...w.points.map((p) => `- ${p}`),
      "",
    ]),
    "## Education",
    "",
    ...education.flatMap((e) => [
      `### ${e.title} — ${e.org}`,
      "",
      [e.when, e.location, ...e.points].filter(Boolean).join(" · "),
      "",
    ]),
    "## Projects",
    "",
    ...projects.map(
      (p) =>
        `- **${p.name}** (${p.year}${p.meta ? `, ${p.meta}` : ""}) — ${p.pitch}. ${bare(p.href)}`,
    ),
    "",
    "## Agent skills",
    "",
    ...agentSkills.map((s) => `- **${s.name}** — ${s.pitch}. ${bare(s.href)}`),
    "",
  ].join("\n");
}
