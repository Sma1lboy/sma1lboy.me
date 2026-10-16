import { useEffect, useState } from "react";
import { Link } from "@tanstack/react-router";
import { useReducedMotion } from "framer-motion";
import {
  BIO,
  INTERNAL,
  MONO,
  builds,
  current,
  experiments,
  flagships,
  jobs,
  metaOf,
  schools,
  skills,
  socials,
  stats,
  ym,
} from "./data";
import { FIGURES, Field } from "./Field";
import { ART } from "./art";
import { AsciiBox } from "./parts";

/**
 * 首页:首屏是一张会动的海报 —— 字符场里的主体(名字/花/狐狸/猫)被光标弹散、定时碎开重组,
 * 四角压小号大写的说明文字(借 Oriku "Digital Bloom" 的版式)。下面是 SMA1LBOY(1) 手册页。
 *
 * 整页一个底:深底暖白字,强调色橙。
 * 颜色走 CSS 变量,组件只认 var(--x);画布读不到变量,dust/levels 单独给实色。
 */

const PAPER = {
  paper: "var(--paper)",
  ink: "var(--ink)",
  dim: "var(--dim)",
  rule: "var(--rule)",
  red: "var(--red)",
};

const NIGHT = {
  paper: "#101010",
  ink: "#e8e4da",
  dim: "#8a867c",
  rule: "#4a463f",
  red: "#ff7a45",
  dust: "#4a4740",
  levels: ["#6b4a37", "#b4552c", "#ff7a45", "#f3dcc0"],
} as const;

/** 字符画:纯装饰,aria-hidden。去掉公共前导空格 —— 每幅画的左缘都贴住正文左缘 */
function Art({ lines, className = "" }: { lines?: string[]; className?: string }) {
  if (!lines) return null;
  const indent = Math.min(...lines.filter((l) => l.trim()).map((l) => l.search(/\S/)));
  return (
    <pre aria-hidden="true" className={`leading-[1.2] whitespace-pre select-none ${className}`} style={{ color: PAPER.dim }}>
      {lines.map((l) => l.slice(indent)).join("\n")}
    </pre>
  );
}

/** art 放在节的右侧,只在宽屏出现 —— 窄屏它只会挤正文 */
function Sec({ id, title, art, children }: { id: string; title: string; art?: string[]; children: React.ReactNode }) {
  return (
    <section id={id} className="mt-14 scroll-mt-8">
      <h2 className="font-bold tracking-wide">{title}</h2>
      <div className="mt-3 grid gap-8 pl-[4ch] sm:pl-[7ch] lg:grid-cols-[minmax(0,1fr)_auto]">
        <div className="min-w-0">{children}</div>
        {art && <Art lines={art} className="hidden pt-1 text-[11px] lg:block" />}
      </div>
    </section>
  );
}

const linkCls = "font-bold underline decoration-dotted underline-offset-4 hover:decoration-solid";

function Item({
  name,
  pitch,
  meta,
  href,
  live,
}: {
  name: string;
  pitch: string;
  meta?: string;
  href?: string;
  live?: boolean;
}) {
  return (
    <div className="py-1">
      <div className="flex items-baseline gap-[1ch]">
        {href ? (
          <a href={href} target="_blank" rel="noopener noreferrer" className={linkCls} style={{ color: PAPER.red }}>
            {name}
          </a>
        ) : (
          <span className="font-bold">{name}</span>
        )}
        {live && <span style={{ color: PAPER.red }}>(live)</span>}
        <span aria-hidden="true" className="min-w-[2ch] flex-1 overflow-hidden whitespace-nowrap" style={{ color: PAPER.rule }}>
          {". ".repeat(80)}
        </span>
        <span className="text-right" style={{ color: PAPER.dim }}>
          {meta}
        </span>
      </div>
      <p className="pl-[4ch]">{pitch}</p>
    </div>
  );
}

export function HomeAscii() {
  const still = !!useReducedMotion();
  const T = NIGHT;
  const [fig, setFig] = useState(0);

  useEffect(() => {
    const prev = document.body.style.background;
    document.body.style.background = T.paper;
    return () => {
      document.body.style.background = prev;
    };
  }, [T.paper]);

  const caps = "text-[11px] leading-[1.4] tracking-[0.08em] uppercase";

  return (
    <div
      className="min-h-[100dvh] text-[13px] leading-[1.65] sm:text-[14px]"
      style={
        {
          "--paper": T.paper,
          "--ink": T.ink,
          "--dim": T.dim,
          "--rule": T.rule,
          "--red": T.red,
          background: PAPER.paper,
          color: PAPER.ink,
          fontFamily: MONO,
          colorScheme: "dark",
        } as React.CSSProperties
      }
    >
      {/* ══ 首屏:海报。主体在画布里,四角是字 ══ */}
      <section className="relative overflow-hidden">
        <Field still={still} palette={T} onFigure={setFig} />
        <div className="pointer-events-none relative mx-auto grid min-h-[100dvh] w-full max-w-[1280px] grid-rows-[auto_1fr_auto] px-6 py-8 sm:px-10 sm:py-10">
          <div className="flex items-start justify-between gap-6">
            <div>
              <h1 className="sr-only">Sma1lboy — Chong Chen</h1>
              <p className="text-[clamp(2.2rem,6.4vw,5.6rem)] leading-[0.92] font-bold tracking-[-0.05em]">
                I build
                <br />
                tools <span style={{ color: PAPER.red }}>that</span>
                <br />
                <span style={{ color: PAPER.red }}>run.</span>
              </p>
            </div>
            <p className={`text-right ${caps}`} style={{ color: PAPER.dim }}>
              chong chen
              <br />
              陈重
              <br />
              {current?.title}
              <br />@ {current?.company}
            </p>
          </div>
          <div />
          <div className="flex items-end justify-between gap-6">
            <div className={caps}>
              <p style={{ color: PAPER.dim }}>
                agents
                <br />
                terminals
                <br />
                evals
                <br />
                tools
              </p>
              <p className="pointer-events-auto mt-3 flex gap-x-[2ch]">
                {socials.map((l) => (
                  <a key={l.label} href={l.href} target="_blank" rel="noopener noreferrer" className="hover:underline" style={{ color: PAPER.red }}>
                    {l.label}↗
                  </a>
                ))}
              </p>
            </div>
            <div className={`text-right ${caps}`} style={{ color: PAPER.dim }}>
              <p aria-live="polite">
                fig.0{fig + 1} — {FIGURES[fig]}
              </p>
              {!still && <p className="hidden sm:block">swipe to brush · click to regrow</p>}
              <p className="mt-3" style={{ color: PAPER.ink }}>
                {new Date().getFullYear()}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ══ 自我介绍:从首屏挪下来,海报只留四角 ══ */}
      <section className="mx-auto max-w-[980px] px-6 pt-12 pb-10 sm:px-10">
        <div className="grid gap-6 md:grid-cols-[minmax(0,58ch)_1fr]">
          <p>{BIO}</p>
          <div className="md:text-right">
            <p>{current ? `${current.title} @ ${current.company}` : "—"}</p>
            <p style={{ color: PAPER.dim }}>{current?.location}</p>
          </div>
        </div>
        <div className="mt-8 flex flex-wrap gap-x-[4ch] gap-y-2 border-t border-dashed pt-4" style={{ borderColor: PAPER.rule }}>
          {stats.map((s) => (
            <span key={s.l}>
              <span style={{ color: PAPER.red }}>{s.n}</span> <span style={{ color: PAPER.dim }}>{s.l}</span>
            </span>
          ))}
          <a href="#shipped" className="ml-auto hover:underline" style={{ color: PAPER.red }}>
            ↓ man sma1lboy
          </a>
        </div>
      </section>

      {/* 接缝:一条 ░ 细带,首屏和正文同一个底 */}
      <p aria-hidden="true" className="overflow-hidden leading-none whitespace-nowrap select-none" style={{ color: PAPER.rule }}>
        {"░".repeat(400)}
      </p>

      {/* ══ 正文:手册页 ══ */}
      <div className="mx-auto max-w-[980px] px-6 pt-10 pb-12 sm:px-10">
        <header className="flex justify-between gap-4" style={{ color: PAPER.dim }}>
          <span>SMA1LBOY(1)</span>
          <span className="hidden sm:inline">General Commands Manual</span>
          <span>SMA1LBOY(1)</span>
        </header>

        <Sec id="shipped" title="SHIPPED">
          <div className="grid gap-x-6 gap-y-4 md:grid-cols-2" style={{ color: PAPER.rule }}>
            {flagships.map((e) => (
              <AsciiBox
                key={e.name}
                title={
                  <a href={e.href} target="_blank" rel="noopener noreferrer" className={linkCls} style={{ color: PAPER.red }}>
                    {e.name}
                  </a>
                }
                right={<span style={{ color: PAPER.dim }}>{e.year}</span>}
              >
                <Art lines={ART[e.name]} className="mb-4 overflow-hidden text-[11px]" />
                <p style={{ color: PAPER.ink }}>{e.pitch}</p>
                <p className="mt-2" style={{ color: PAPER.dim }}>
                  {metaOf(e)}
                  {e.live && <span style={{ color: PAPER.red }}> · live</span>}
                </p>
              </AsciiBox>
            ))}
          </div>
        </Sec>

        <Sec id="builds" title="MORE BUILDS">
          {builds.map((e) => (
            <Item key={e.name} name={e.name} pitch={e.pitch} meta={metaOf(e) || e.year} href={e.href} live={e.live} />
          ))}
        </Sec>

        <Sec id="skills" title="SKILLS" art={ART.skills}>
          {skills.map((e) => (
            <Item key={e.name} name={e.name} pitch={e.pitch} meta={metaOf(e) || e.year} href={e.href} />
          ))}
        </Sec>

        <Sec id="history" title="HISTORY" art={ART.history}>
          {jobs.map((e) => (
            <Item
              key={e.id}
              name={e.company ?? ""}
              pitch={e.title}
              meta={`${ym(e.period.start)} – ${e.period.end ? ym(e.period.end) : "now"}`}
              href={e.url}
              live={!e.period.end}
            />
          ))}
          {schools.map((e) => (
            <Item key={e.id} name={e.organization ?? ""} pitch={e.title} meta={`${ym(e.period.start)} – ${ym(e.period.end)}`} />
          ))}
        </Sec>

        <Sec id="lab" title="BUGS" art={ART.bugs}>
          <details>
            <summary className="cursor-pointer list-none">
              <span style={{ color: PAPER.red }}>[+]</span> {experiments.length} things built to find out how
              they work
            </summary>
            <div className="mt-2">
              {experiments.map((e) => (
                <Item key={e.name} name={e.name} pitch={e.pitch} meta={[e.lang, e.stars ? `${e.stars}★` : null].filter(Boolean).join(" · ")} href={e.href} />
              ))}
            </div>
          </details>
        </Sec>

        <Sec id="see-also" title="SEE ALSO" art={ART.seealso}>
          {INTERNAL.map((p) => (
            <div key={p.to} className="py-1">
              <Link to={p.to} className={linkCls} style={{ color: PAPER.red }}>
                {p.title}(7)
              </Link>
              <span style={{ color: PAPER.dim }}> — {p.pitch}</span>
            </div>
          ))}
        </Sec>

        <div className="mt-20 flex items-end justify-between gap-6">
          <Art lines={ART.cat} className="overflow-hidden text-[12px]" />
          <span className="shrink-0 pb-1" style={{ color: PAPER.dim }}>
            (END)
          </span>
        </div>
        <p aria-hidden="true" className="mt-2 overflow-hidden whitespace-nowrap" style={{ color: PAPER.rule }}>
          {"░▒▓█▓▒░ ".repeat(60)}
        </p>
        <footer className="mt-3 flex justify-between gap-4" style={{ color: PAPER.dim }}>
          <span>sma1lboy.me</span>
          <a href="https://github.com/Sma1lboy/sma1lboy.me" target="_blank" rel="noopener noreferrer" className="underline decoration-dotted underline-offset-4" style={{ color: PAPER.red }}>
            source
          </a>
          <span>{new Date().getFullYear()}</span>
        </footer>
      </div>
    </div>
  );
}

export default HomeAscii;
