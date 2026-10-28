import { createContext, useContext, useEffect, useState } from "react";
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
  type Entry,
  schools,
  skills,
  socials,
  stats,
  ym,
} from "./data";
import { Field } from "./Field";
import { ART } from "./art";

/**
 * 首页:首屏是一张会动的海报 —— 字符场里一个一直在转的黑洞,光标划过会把格子弹散,
 * 四角压小号大写的说明文字(借 Oriku "Digital Bloom" 的版式)。下面的正文和海报同宽同栅格:
 * 每节左栏是编号 + 标题 + 目录,右栏是内容;列表是表格行,橙色只留给 live 和悬停。滚动时左下角有 less 的 --More--(N%)。
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

const caps = "text-[11px] leading-[1.4] tracking-[0.08em] uppercase";
/** 可点的行/格悬停底色:分隔线色压到 22%,比纸色略亮一档,不引入新颜色 */
const HOVER_BG = "hover:bg-[color-mix(in_srgb,var(--rule)_22%,var(--paper))]";
/** 出血行的底部虚线:画在 ::after 上并收回 12px,和栅格边缘对齐 */
const ROW_RULE = "after:absolute after:inset-x-3 after:bottom-0 after:border-b after:border-dashed after:border-[var(--rule)]";
/** 列表行的元信息统一成 "星/备注 · 语言 · 年份":原来没星没语言时才退到年份,同一列里有的写 6★ 有的写 2026,读不齐 */
const withYear = (e: Entry) => [metaOf(e), e.year].filter(Boolean).join(" · ");

/** 正文各节,左栏目录用;和下面 <Sec> 的 n/id/title 一一对应 */
const TOC = [
  ["00", "name", "NAME"],
  ["01", "shipped", "SHIPPED"],
  ["02", "builds", "MORE BUILDS"],
  ["03", "skills", "SKILLS"],
  ["04", "history", "HISTORY"],
  ["05", "lab", "BUGS"],
  ["06", "see-also", "SEE ALSO"],
] as const;

/** 字符画:纯装饰,aria-hidden。hover:放在 .group 里时悬停变亮;带底色,压在点阵上不透底 */
function Art({ lines, className = "", hover }: { lines?: string[]; className?: string; hover?: boolean }) {
  if (!lines) return null;
  return (
    <pre
      aria-hidden="true"
      className={`leading-[1.2] whitespace-pre select-none ${hover ? "bg-[var(--paper)] text-[var(--dim)] transition-colors group-hover:text-[var(--ink)]" : ""} ${className}`}
      style={hover ? undefined : { color: PAPER.dim }}
    >
      {lines.join("\n")}
    </pre>
  );
}

/** 一节:左栏编号/标题/目录(宽屏吸顶),右栏内容。和首屏同一条 1280 栅格 */
function Sec({
  n,
  id,
  title,
  note,
  children,
}: {
  n: string;
  id: string;
  title: string;
  note?: string;
  children: React.ReactNode;
}) {
  const on = useContext(ActiveSec) === id;
  return (
    <section
      id={id}
      className="grid scroll-mt-8 gap-6 border-t py-12 sm:py-16 lg:grid-cols-[260px_minmax(0,1fr)] lg:gap-10"
      style={{ borderColor: PAPER.rule }}
    >
      <header className="self-start lg:sticky lg:top-10">
        {/* 大号编号压成分隔线的颜色:左栏有了分量,又不和标题抢。
            窄屏没有左栏,编号叠在标题上面每节白占一大截高度:改成和标题并排,lg 起再叠起来 */}
        <div className="flex items-baseline gap-[2ch] lg:block">
          <p aria-hidden="true" className="text-[clamp(2.4rem,6vw,5.5rem)] leading-[0.85] font-bold tracking-[-0.06em]" style={{ color: PAPER.rule }}>
            {n}
          </p>
          <h2 className="text-[clamp(1.5rem,2.6vw,2.1rem)] leading-none font-bold tracking-[-0.03em] lg:mt-3">{title}</h2>
        </div>
        {note && (
          <p className={`mt-3 ${caps}`} style={{ color: PAPER.dim }}>
            {note}
          </p>
        )}
        {/* 宽屏左栏标题下面是空的:放一份全页目录,跟着标题吸顶,当前节高亮。
            只有正在读的那节亮出来 —— 每节都挂一份,两节同屏时会叠出两份一模一样的目录。
            用透明度藏而不是不渲染:吸顶的标题高度不变,切换时不跳 */}
        <nav
          aria-label="sections"
          aria-hidden={!on}
          className={`mt-10 hidden transition-opacity duration-300 lg:block ${on ? "" : "pointer-events-none"} ${caps}`}
          style={{ opacity: on ? 1 : 0 }}
        >
          {TOC.map(([k, to, t]) =>
            to === id ? (
              <p key={to} className="py-0.5" style={{ color: PAPER.ink }}>
                <span style={{ color: PAPER.red }}>→</span> {k} {t}
              </p>
            ) : (
              // 藏起来的目录(透明 + aria-hidden)里的链接不能还留在 Tab 顺序里,否则键盘要先穿过 6 份看不见的目录
              <a
                key={to}
                href={`#${to}`}
                tabIndex={on ? undefined : -1}
                className="block py-0.5 text-[var(--rule)] transition-colors hover:text-[var(--ink)] focus-visible:text-[var(--ink)]"
              >
                <span className="whitespace-pre">{"  "}</span>
                {k} {t}
              </a>
            ),
          )}
        </nav>
      </header>
      <div className="min-w-0">{children}</div>
    </section>
  );
}

/** 正在读的那节:顶边已经滚过视口上方 1/3 的最后一节 */
const ActiveSec = createContext<string>(TOC[0][1]);

function useActiveSection() {
  const [active, setActive] = useState<string>(TOC[0][1]);
  useEffect(() => {
    const on = () => {
      let cur: string = TOC[0][1];
      for (const [, id] of TOC) {
        const el = document.getElementById(id);
        if (el && el.getBoundingClientRect().top <= window.innerHeight / 3) cur = id;
      }
      setActive(cur);
    };
    on();
    window.addEventListener("scroll", on, { passive: true });
    window.addEventListener("resize", on);
    return () => {
      window.removeEventListener("scroll", on);
      window.removeEventListener("resize", on);
    };
  }, []);
  return active;
}

/** 表格行:左栏名字 + 元信息,右栏一句话。两栏比三栏少折行,行高也齐。整行是链接,悬停时名字变橙、说明变亮 */
function Row({ name, pitch, meta, href, live }: { name: string; pitch: string; meta?: string; href?: string; live?: boolean }) {
  const body = (
    <>
      <span className="min-w-0">
        <span className="font-bold transition-colors group-hover:text-[var(--red)]">
          {name}
          {live && (
            <span className="ml-[1ch] align-middle text-[10px]" style={{ color: PAPER.red }} title="live">
              ●
            </span>
          )}
        </span>
        <span className={`mt-1 block ${caps}`} style={{ color: PAPER.dim }}>
          {meta}
        </span>
      </span>
      <span className="text-[var(--dim)] transition-colors group-hover:text-[var(--ink)]">{pitch}</span>
    </>
  );
  // 悬停整行垫一层很淡的分隔线色:只靠名字变橙,在长说明旁边几乎看不出来;-mx/px 让底色出血、文字不动。
  // 虚线不能跟着出血,否则会伸出栅格 12px:画在 ::after 上,左右收回 px-3
  const cls = `group relative -mx-3 grid gap-x-8 gap-y-1 px-3 py-4 transition-colors sm:grid-cols-[minmax(0,26ch)_minmax(0,1fr)] sm:items-baseline ${ROW_RULE} ${href ? HOVER_BG : ""}`;
  return href ? (
    <a href={href} target="_blank" rel="noopener noreferrer" className={cls} style={{ borderColor: PAPER.rule }}>
      {body}
    </a>
  ) : (
    <div className={cls} style={{ borderColor: PAPER.rule }}>
      {body}
    </div>
  );
}

/**
 * git log --graph 的一行:左边 5ch 的轨道画竖线和节点,lane 1 是从主线分出去的支线(学校)。
 * 竖线用 1px 实线而不是逐行 | 字形,行高不一也连得上;节点用真字符 * / ●(HEAD)。
 */
function Commit({
  lane,
  head,
  name,
  title,
  when,
  href,
  last,
}: {
  lane: 0 | 1;
  head?: boolean;
  name: string;
  title: string;
  when: string;
  href?: string;
  last?: boolean;
}) {
  // 竖线:HEAD 那行从节点往下起笔,最后一行只画到节点为止,不出头也不拖尾
  const line = (ch: number, end?: boolean) => (
    <span
      className="absolute w-px"
      style={{
        left: `calc(${ch}ch + 0.5ch)`,
        top: head ? "0.6em" : 0,
        bottom: end ? "auto" : 0,
        height: end ? "0.6em" : undefined,
        background: PAPER.rule,
      }}
    />
  );
  const Name = href ? "a" : "span";
  return (
    <li className="group grid grid-cols-[5ch_minmax(0,1fr)]">
      <span aria-hidden="true" className="relative">
        {/* 主线在分叉处就交给支线了:支线的行只画自己那条线,不再并排拖一条主线 */}
        {lane === 0 ? line(0, last) : line(2, last)}
        <span
          className="absolute top-[0.15em] leading-none"
          style={{ left: `${lane * 2}ch`, width: "1ch", textAlign: "center", color: head ? PAPER.red : PAPER.ink, background: PAPER.paper }}
        >
          {head ? "●" : "*"}
        </span>
      </span>
      <div className="grid gap-x-6 gap-y-0.5 pb-6 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-baseline">
        <p>
          <Name
            {...(href ? { href, target: "_blank", rel: "noopener noreferrer" } : {})}
            className="font-bold transition-colors group-hover:text-[var(--red)]"
          >
            {name}
          </Name>
          {head && (
            <span className="ml-[1ch]" style={{ color: PAPER.red }}>
              (HEAD -&gt; now)
            </span>
          )}
          <span className="block text-[var(--dim)]">{title}</span>
        </p>
        <span className={`whitespace-nowrap tabular-nums ${caps}`} style={{ color: PAPER.dim }}>
          {when}
        </span>
      </div>
    </li>
  );
}

/**
 * less 翻页时左下角的 --More--(42%):滚进正文后出现,跟着读到第几了;翻到底由页脚的 (END) 接手,自己退场。
 * 只在 sm 以上 —— 手机上一个固定条会压住正文。
 */
function More() {
  const [st, setSt] = useState({ show: false, pct: 0 });
  useEffect(() => {
    const on = () => {
      const h = document.documentElement.scrollHeight;
      const bottom = window.scrollY + window.innerHeight;
      const show = window.scrollY > window.innerHeight * 0.6 && bottom < h - 160;
      const pct = Math.min(99, Math.round((bottom / h) * 100));
      setSt((s) => (s.show === show && s.pct === pct ? s : { show, pct }));
    };
    on();
    window.addEventListener("scroll", on, { passive: true });
    window.addEventListener("resize", on);
    return () => {
      window.removeEventListener("scroll", on);
      window.removeEventListener("resize", on);
    };
  }, []);
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-x-0 bottom-0 z-10 hidden pt-8 transition-opacity duration-300 sm:block"
      // 底下垫一条淡进纸色的带:正文从它下面滚过去先淡掉,状态条不会压在标题上
      style={{ opacity: st.show ? 1 : 0, background: `linear-gradient(to top, ${PAPER.paper} 55%, transparent)` }}
    >
      <div className={`mx-auto w-full max-w-[1280px] px-10 pb-5 ${caps}`}>
        <span className="px-[1ch] tabular-nums" style={{ background: PAPER.ink, color: PAPER.paper }}>
          --More--({st.pct}%)
        </span>
      </div>
    </div>
  );
}

export function HomeAscii() {
  const still = !!useReducedMotion();
  const T = NIGHT;
  const active = useActiveSection();

  useEffect(() => {
    const prev = document.body.style.background;
    document.body.style.background = T.paper;
    return () => {
      document.body.style.background = prev;
    };
  }, [T.paper]);

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
        <Field still={still} palette={T} />
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
            {/* 黑洞压在右下角出血,说明字落在盘面上;垫一块羽化的底色才读得清,硬边方块会切断盘面 */}
            <div
              className={`text-right ${caps}`}
              style={{ color: PAPER.dim, background: PAPER.paper, boxShadow: `0 0 28px 22px ${PAPER.paper}` }}
            >
              <p>fig.01 — black hole</p>
              {!still && <p className="hidden sm:block">swipe to brush</p>}
              <p className="mt-3" style={{ color: PAPER.ink }}>
                {new Date().getFullYear()}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 接缝:画布底纹到首屏底边是硬切的;盖一条 32px 渐变把它淡进纸色(首屏下内边距 ≥32px,不碰说明字) */}
      <div
        aria-hidden="true"
        className="pointer-events-none relative -mt-8 h-8"
        style={{ background: `linear-gradient(to bottom, transparent, ${PAPER.paper})` }}
      />
      {/* ══ 正文:和海报同宽同栅格的手册页 ══ */}
      <ActiveSec.Provider value={active}>
      {/* 键盘焦点:浏览器默认灰环 oklch(0.45) 压在 #101010 上几乎看不见;正文链接统一换成强调橙,往里收 2px 不被格子线吃掉 */}
      <div className="mx-auto w-full max-w-[1280px] px-6 sm:px-10 [&_a:focus-visible]:outline-2 [&_a:focus-visible]:-outline-offset-2 [&_a:focus-visible]:outline-[var(--red)] [&_a:focus-visible]:outline-solid">
        <header className={`flex justify-between gap-4 pt-10 pb-4 ${caps}`} style={{ color: PAPER.dim }}>
          <span>SMA1LBOY(1)</span>
          <span className="hidden sm:inline">General Commands Manual</span>
          <span>SMA1LBOY(1)</span>
        </header>

        <Sec n="00" id="name" title="NAME">
          {/* 简介右边原来是空的:职位/地点挪上来,和简介顶对齐,小号大写像手册页的元信息 */}
          {/* 46ch 要按简介自己的大字号算,所以宽度放在 <p> 上,不放在栅格列上(列的 ch 是 14px 的) */}
          <div className="grid gap-6 md:grid-cols-[minmax(0,1fr)_auto] md:gap-10">
            <p className="max-w-[46ch] text-[clamp(1.05rem,1.6vw,1.35rem)] leading-[1.5]">{BIO}</p>
            <p className={`md:pt-2 md:text-right ${caps}`} style={{ color: PAPER.dim }}>
              {current?.title}
              <br />@ {current?.company}
              <br />
              {current?.location}
            </p>
          </div>
          <dl className="mt-10 grid grid-cols-2 gap-x-6 gap-y-6 sm:grid-cols-4">
            {stats.map((s) => (
              <div key={s.l} className="flex flex-col-reverse border-t pt-3" style={{ borderColor: PAPER.rule }}>
                <dt className={`mt-2 ${caps}`} style={{ color: PAPER.dim }}>
                  {s.l}
                </dt>
                <dd className="text-[clamp(1.6rem,3vw,2.4rem)] leading-none font-bold tracking-[-0.03em]">{s.n}</dd>
              </div>
            ))}
          </dl>
        </Sec>

        <Sec n="01" id="shipped" title="SHIPPED" note={`${flagships.length} products, in use`}>
          <div className="grid gap-px md:grid-cols-2" style={{ background: PAPER.rule }}>
            {flagships.map((e) => (
              <a
                key={e.name}
                href={e.href}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex flex-col"
                style={{ background: PAPER.paper }}
              >
                {/* 字符画放进一块点阵底的"屏幕",贴满卡片顶部;悬停时画亮起来 */}
                <div
                  className="flex h-[9.5rem] items-center justify-center overflow-hidden border-b sm:h-[11.5rem]"
                  style={{
                    borderColor: PAPER.rule,
                    backgroundImage: `radial-gradient(${PAPER.rule} 1px, transparent 1.2px)`,
                    backgroundSize: "14px 14px",
                    backgroundPosition: "7px 7px",
                  }}
                >
                  <Art lines={ART[e.name]} hover className="px-3 py-2 text-[11px] sm:text-[12px]" />
                </div>
                {/* 单列时卡片没有左右边线,文字缩进 24px 会和整页左边缘错开;两列(md)起才有格子边,才加内边距 */}
                <div className="flex flex-1 flex-col px-0 py-6 md:p-8">
                  <div className="mb-4 flex items-baseline justify-between gap-4">
                    <span className="text-[1.15rem] font-bold transition-colors group-hover:text-[var(--red)]">{e.name} ↗</span>
                    <span style={{ color: PAPER.dim }}>{e.year}</span>
                  </div>
                  <p className="flex-1">{e.pitch}</p>
                  <p className={`mt-4 ${caps}`} style={{ color: PAPER.dim }}>
                    {metaOf(e)}
                    {e.live && <span style={{ color: PAPER.red }}> · live</span>}
                  </p>
                </div>
              </a>
            ))}
          </div>
        </Sec>

        <Sec n="02" id="builds" title="MORE BUILDS" note={`${builds.length} smaller tools`}>
          {builds.map((e) => (
            <Row key={e.name} name={e.name} pitch={e.pitch} meta={withYear(e)} href={e.href} live={e.live} />
          ))}
        </Sec>

        <Sec n="03" id="skills" title="SKILLS" note="agent skills · SKILL.md">
          {skills.map((e) => (
            <Row key={e.name} name={e.name} pitch={e.pitch} meta={withYear(e)} href={e.href} />
          ))}
        </Sec>

        <Sec n="04" id="history" title="HISTORY" note="git log --graph">
          <ol>
            {jobs.map((e, k) => (
              <Commit
                key={e.id}
                lane={0}
                head={!e.period.end}
                name={e.company ?? ""}
                title={e.title}
                when={`${ym(e.period.start)} – ${e.period.end ? ym(e.period.end) : "now"}`}
                href={e.url}
                last={k === jobs.length - 1 && !schools.length}
              />
            ))}
            {schools.length > 0 && (
              <li aria-hidden="true" className="grid grid-cols-[5ch_minmax(0,1fr)] pb-2 leading-[1.4]">
                <span className="relative">
                  {/* 分叉画成一条真斜线,从主线(0.5ch)接到支线(2.5ch);主线到这里结束,支线接着往下 */}
                  <svg className="absolute inset-y-0 left-0 h-full w-[3ch]" viewBox="0 0 3 1" preserveAspectRatio="none">
                    <line x1="0.5" y1="0" x2="2.5" y2="1" stroke={PAPER.rule} strokeWidth="1" vectorEffect="non-scaling-stroke" />
                  </svg>
                </span>
                <span className={caps} style={{ color: PAPER.dim }}>
                  branch: school
                </span>
              </li>
            )}
            {schools.map((e, k) => (
              <Commit
                key={e.id}
                lane={1}
                name={e.organization ?? ""}
                title={e.title}
                when={`${ym(e.period.start)} – ${ym(e.period.end)}`}
                last={k === schools.length - 1}
              />
            ))}
          </ol>
        </Sec>

        <Sec n="05" id="lab" title="BUGS" note={`${experiments.length} things built to see how they work`}>
          <div className="grid gap-x-8 sm:grid-cols-2">
            {experiments.map((e) => (
              <a
                key={e.name}
                href={e.href}
                target="_blank"
                rel="noopener noreferrer"
                className={`group relative -mx-3 block px-3 py-3 transition-colors ${ROW_RULE} ${HOVER_BG}`}
              >
                <span className="flex items-baseline justify-between gap-4">
                  <span className="font-bold transition-colors group-hover:text-[var(--red)]">{e.name}</span>
                  <span className={`whitespace-nowrap ${caps}`} style={{ color: PAPER.dim }}>
                    {[e.lang, e.stars ? `${e.stars}★` : null].filter(Boolean).join(" · ")}
                  </span>
                </span>
                {/* 一行截断会把说明截在半句("fold the directory that…");放两行,还长就悬停看全文 */}
                <span title={e.pitch} className="mt-0.5 line-clamp-2 text-[var(--dim)] transition-colors group-hover:text-[var(--ink)]">
                  {e.pitch}
                </span>
              </a>
            ))}
          </div>
        </Sec>

        <Sec n="06" id="see-also" title="SEE ALSO">
          {/* 宽屏左栏(标题+目录)比三个格子高,格子拉满整节高度,路径压在格子底部,不留一块空 */}
          <div className="grid gap-px sm:grid-cols-3 lg:h-full" style={{ background: PAPER.rule }}>
            {INTERNAL.map((p) => (
              <Link key={p.to} to={p.to} className={`group flex flex-col bg-[var(--paper)] p-6 transition-colors ${HOVER_BG}`}>
                <span className="text-[1.15rem] font-bold transition-colors group-hover:text-[var(--red)]">{p.title}(7) →</span>
                <span className="mt-3 block text-[var(--dim)] transition-colors group-hover:text-[var(--ink)]">{p.pitch}</span>
                {/* 只要格子并排(sm 起)就等高,路径一律压底;单列时 mt-auto 不起作用,pt-6 保底间距 */}
                <span className={`mt-auto pt-6 ${caps}`} style={{ color: PAPER.rule }}>
                  sma1lboy.me{p.to}
                </span>
              </Link>
            ))}
          </div>
        </Sec>

        {/* 收尾像 less 翻到底:猫睡在状态栏上,状态栏是反白的 (END),同一行放站名和源码 */}
        <footer className="border-t pt-14 pb-10" style={{ borderColor: PAPER.rule }}>
          <Art lines={ART.cat} className="text-[12px]" />
          <div className={`mt-1 flex flex-wrap items-center gap-x-[2ch] gap-y-2 border-t pt-3 ${caps}`} style={{ borderColor: PAPER.rule, color: PAPER.dim }}>
            <span className="px-[1ch]" style={{ background: PAPER.ink, color: PAPER.paper }}>
              (END)
            </span>
            <span>sma1lboy.me · {new Date().getFullYear()}</span>
            <a
              href="https://github.com/Sma1lboy/sma1lboy.me"
              target="_blank"
              rel="noopener noreferrer"
              className="ml-auto hover:underline"
              style={{ color: PAPER.red }}
            >
              source ↗
            </a>
          </div>
        </footer>
      </div>
      </ActiveSec.Provider>
      <More />
    </div>
  );
}

export default HomeAscii;
