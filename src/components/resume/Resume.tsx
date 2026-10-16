import { useEffect } from "react";
import { Link } from "@tanstack/react-router";
import { MONO } from "../homes/ascii/data";
import { agentSkills, bare, education, person, projects, summary, work } from "./data";

/**
 * /resume:手册页版式的一页简历,数据和 llms-full.txt 同源(./data)。
 * 屏幕上是首页的深底;打印换白纸黑字、A4、去掉导航,强调色压暗到纸上还读得清。
 * 颜色走 CSS 变量,print: 变体整组换掉。
 */

const COLORS =
  "[--paper:#101010] [--ink:#e8e4da] [--dim:#8a867c] [--rule:#4a463f] [--red:#ff7a45] " +
  "print:[--paper:#fff] print:[--ink:#111] print:[--dim:#555] print:[--rule:#bbb] print:[--red:#b4552c]";

const linkCls =
  "underline decoration-dotted underline-offset-4 hover:decoration-solid print:no-underline";

function Sec({
  title,
  className = "",
  children,
}: {
  title: string;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <section className={`mt-8 print:mt-2 ${className}`}>
      <h2 className="font-bold tracking-wide">{title}</h2>
      <div className="mt-2 pl-[4ch] sm:pl-[7ch] print:mt-1 print:pl-[4ch]">{children}</div>
    </section>
  );
}

/** 名字 ...... 右侧信息:和首页台账行同一个写法 */
function Row({ left, right }: { left: React.ReactNode; right: React.ReactNode }) {
  return (
    <div className="flex items-baseline gap-[1ch]">
      <span className="font-bold">{left}</span>
      <span
        aria-hidden="true"
        className="min-w-[2ch] flex-1 overflow-hidden whitespace-nowrap text-[var(--rule)]"
      >
        {". ".repeat(80)}
      </span>
      <span className="text-right text-[var(--dim)]">{right}</span>
    </div>
  );
}

export function Resume() {
  useEffect(() => {
    const prev = { bg: document.body.style.background, title: document.title };
    document.body.style.background = "#101010";
    document.title = `Resume — ${person.name} (${person.handle})`;
    return () => {
      document.body.style.background = prev.bg;
      document.title = prev.title;
    };
  }, []);

  return (
    <div
      className={`${COLORS} min-h-[100dvh] bg-[var(--paper)] text-[13px] leading-[1.6] text-[var(--ink)] [color-scheme:dark] sm:text-[14px] print:min-h-0 print:text-[8pt] print:leading-[1.3] print:[color-scheme:light]`}
      style={{ fontFamily: MONO }}
    >
      <style>
        {
          "@page { size: A4; margin: 9mm 14mm; } @media print { body { background: #fff !important; } }"
        }
      </style>
      <div className="mx-auto max-w-[900px] px-6 py-10 sm:px-10 print:max-w-none print:p-0">
        <header className="flex justify-between gap-4 text-[var(--dim)]">
          <span>SMA1LBOY(1)</span>
          <span className="hidden sm:inline print:inline">Resume</span>
          <span>SMA1LBOY(1)</span>
        </header>
        <nav className="mt-4 flex gap-x-[3ch] text-[var(--red)] print:hidden">
          <Link to="/" className={linkCls}>
            ← home
          </Link>
          <button
            type="button"
            onClick={() => window.print()}
            className={`${linkCls} cursor-pointer`}
          >
            [ print / save as pdf ]
          </button>
          <a href="/llms-full.txt" className={linkCls}>
            plain text
          </a>
        </nav>

        <Sec title="NAME">
          <h1>
            <span className="font-bold">{person.name}</span> ({person.native}) — {person.handle}
          </h1>
          <p>
            {person.headline}
            <span className="text-[var(--dim)]"> · {person.location}</span>
          </p>
          <p className="mt-1 flex flex-wrap gap-x-[3ch]">
            <a href={`mailto:${person.email}`} className={`${linkCls} text-[var(--red)]`}>
              {person.email}
            </a>
            {person.links
              .filter((l) => l.label !== "Bilibili")
              .map((l) => (
                <a
                  key={l.href}
                  href={l.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`${linkCls} text-[var(--red)]`}
                >
                  {bare(l.href)}
                </a>
              ))}
          </p>
        </Sec>

        <Sec title="SUMMARY">
          <p className="max-w-[72ch] print:max-w-none">{summary}</p>
        </Sec>

        <Sec title="EXPERIENCE">
          {work.map((w) => (
            <div key={`${w.org}-${w.when}`} className="mb-4 break-inside-avoid print:mb-1.5">
              <Row left={w.org} right={w.when} />
              <p>
                {w.title}
                <span className="text-[var(--dim)]"> · {w.location}</span>
              </p>
              <ul className="mt-1">
                {w.points.map((p) => (
                  <li key={p} className="grid grid-cols-[2ch_minmax(0,1fr)]">
                    <span aria-hidden="true" className="text-[var(--dim)]">
                      -
                    </span>
                    <span>{p}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </Sec>

        <Sec title="EDUCATION">
          {education.map((e) => (
            <div key={e.org} className="mb-2 break-inside-avoid">
              <Row left={e.org} right={e.when} />
              <p>
                {e.title}
                <span className="text-[var(--dim)]">
                  {[e.location, ...e.points].map((x) => ` · ${x}`)}
                </span>
              </p>
            </div>
          ))}
        </Sec>

        {/* 打印只留 tier 1,保证 A4 一页;其余在屏幕上和 llms-full.txt 里 */}
        <Sec title="PROJECTS">
          {projects.map((p) => (
            <div
              key={p.name}
              className={`mb-2 break-inside-avoid print:mb-1 ${p.tier === 1 ? "" : "print:hidden"}`}
            >
              <Row
                left={
                  <a
                    href={p.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`${linkCls} text-[var(--red)]`}
                  >
                    {p.name}
                  </a>
                }
                right={[p.meta, p.year].filter(Boolean).join(" · ")}
              />
              <p className="pl-[4ch]">{p.pitch}</p>
            </div>
          ))}
          <p className="hidden text-[var(--dim)] print:block">
            + {projects.filter((p) => p.tier !== 1).length} more at {bare(person.links[0].href)}
          </p>
        </Sec>

        <Sec title="AGENT SKILLS" className="print:hidden">
          {agentSkills.map((s) => (
            <p key={s.name}>
              <a
                href={s.href}
                target="_blank"
                rel="noopener noreferrer"
                className={`${linkCls} font-bold text-[var(--red)]`}
              >
                {s.name}
              </a>
              <span className="text-[var(--dim)]"> — {s.pitch}</span>
            </p>
          ))}
        </Sec>

        <footer className="mt-10 flex justify-between gap-4 text-[var(--dim)] print:hidden">
          <span>{bare(person.links[0].href)}/resume</span>
          <span>(END)</span>
        </footer>
      </div>
    </div>
  );
}

export default Resume;
