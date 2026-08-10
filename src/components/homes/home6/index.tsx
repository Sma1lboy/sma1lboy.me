import { useEffect, useState } from "react";
import { Link } from "@tanstack/react-router";
import { useReducedMotion } from "framer-motion";
import { experiences } from "../../../constants/experiences";
import { socialLinks } from "../../../constants/home";
import { Entry, experiments, flagships, products, skills } from "../../../constants/products";
import { Backdrop } from "./Backdrop";
import { PHANTOM } from "./palettes";

/**
 * Home6 — "PHANTOM"。Persona 5 的视觉语言。
 *
 * 结构判断:主角是人,不是产品。
 * 曾经把巨大的产品名 + ENTER 按钮放首屏 —— 那是 landing page 的逻辑,产品当主角、
 * 人缩在角落当署名。个人网站反过来:名字是首屏最大的东西,产品降级成"证据",
 * 在下面证明"I build tools that run"这句话不是吹的。Lab 那批练手项目再折叠一层。
 *
 * 视觉约束:
 * - 底色是暗红 + 深紫,不用黑。P5 的"黑"是极深的酒红,纯黑会死板。
 * - 海报是按这套配色生成的(见 lan-imag/jobs/sma1lboy-hero.json),
 *   所以不再叠任何双色调滤镜 —— 那只会把它压成一团泥。
 * - 撞色只有酸性黄,且只给可点的东西 —— 它是"行动"的语义,不是装饰。
 * - 斜切:容器 skew,内容反向 skew 回来保持可读。斜是结构不是贴纸。
 * - 破格:分节头出血到容器外并反向歪,巨型编号压在标题背后,台账行按 index 错位。
 *   完全对齐的一摞行是最"板正"的地方。
 * - 背景是一层 shader 底噪(Backdrop),不是 3D 建模 —— 旋转的几何体跟"造终端工具"
 *   没关系,缺的只是缓慢流动的辉光让静止的海报有呼吸。
 */

const SLIDE_MS = 6000;

const C = PHANTOM;

/** 站内其他页面。全是真实路由 —— 加之前先确认 routeTree 里有。 */
const INTERNAL = [
  {
    to: "/apps" as const,
    kicker: "PLAYGROUND",
    title: "Apps",
    pitch: "Interactive toys — a retro typewriter, a 3D receipt with Verlet cloth physics.",
  },
  {
    to: "/cmt" as const,
    kicker: "NOTES",
    title: "Thoughts",
    pitch: "Short notes on what I'm building and what I got wrong. Updated when I have something.",
  },
  {
    to: "/api" as const,
    kicker: "JSON",
    title: "API",
    pitch: "This site's data as endpoints. Take the JSON, build something with it.",
  },
];

const ym = (s?: string) => (s ? `${s.slice(2, 4)}.${s.slice(5, 7)}` : "···");
const metaOf = (e: Entry) =>
  [e.note ?? (e.stars ? `${e.stars}★` : null), e.lang].filter(Boolean).join(" · ");

/** 斜切按钮:外层 skew,内层反向 skew,字才不歪 */
function Slash({
  children,
  className = "",
  ...rest
}: React.ComponentProps<"a"> & { children: React.ReactNode }) {
  return (
    <a
      {...rest}
      className={`inline-block px-4 py-2 font-black tracking-widest uppercase transition-transform duration-150 hover:scale-[1.06] motion-reduce:transition-none motion-reduce:hover:scale-100 ${className}`}
      style={{ background: C.amp, color: C.ink, transform: "skewX(-12deg)", ...rest.style }}
    >
      <span className="inline-block" style={{ transform: "skewX(12deg)" }}>
        {children}
      </span>
    </a>
  );
}

/* ═══════════════════════ 产品轮播(证据,不是首屏) ═══════════════════════ */

function Stage({ items }: { items: Entry[] }) {
  const [i, setI] = useState(0);
  const [paused, setPaused] = useState(false);
  const still = useReducedMotion();
  const n = items.length;
  const cur = items[i];

  const go = (d: number) => setI((v) => (v + d + n) % n);

  // 自动推进。reduce 或用户正在交互时停 —— 自动播放对前庭敏感的人是硬伤,
  // 而且人正在看的时候被抢走画面很烦。
  useEffect(() => {
    if (still || paused) return;
    const t = setInterval(() => setI((v) => (v + 1) % n), SLIDE_MS);
    return () => clearInterval(t);
  }, [n, still, paused]);

  // 左右方向键切换。只接管左右,不碰上下,免得抢走滚动。
  useEffect(() => {
    const h = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") go(-1);
      if (e.key === "ArrowRight") go(1);
    };
    window.addEventListener("keydown", h);
    return () => window.removeEventListener("keydown", h);
  });

  return (
    <section
      aria-roledescription="carousel"
      aria-label="Featured products"
      className="relative aspect-[16/9] max-h-[70vh] w-full overflow-hidden"
      style={{ background: C.ink }}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocusCapture={() => setPaused(true)}
      onBlurCapture={() => setPaused(false)}
    >
      {/* ── 图层:按这套配色生成的产品海报 ── */}
      {items.map((e, k) => (
        <div
          key={e.name}
          aria-hidden={k !== i}
          className={`absolute inset-0 transition-opacity duration-[900ms] ${
            k === i ? "opacity-100" : "opacity-0"
          } motion-reduce:transition-none`}
        >
          {/* 图本身已经是这套配色画的 —— 不要再叠双色调滤镜,那只会把它压成一团泥。
              只做缓慢推近(Ken Burns),让静止的海报有呼吸。 */}
          <img
            src={`/images/shots/${C.shots}/${e.cover}.jpg`}
            alt=""
            loading={k === 0 ? "eager" : "lazy"}
            decoding="async"
            className="no-dark-filter size-full object-cover"
            style={{
              transform: k === i && !still ? "scale(1.08)" : "scale(1)",
              transition: still ? "none" : `transform ${SLIDE_MS + 1600}ms linear`,
            }}
          />
        </div>
      ))}

      {/* 暗角 + 底部沉底,保证大字压得住 */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background: `radial-gradient(120% 90% at 70% 20%, transparent 20%, ${C.ink}cc 78%),
                       linear-gradient(to top, ${C.ink} 6%, ${C.ink}e0 30%, transparent 68%)`,
        }}
      />
      {/* 半调网点 —— 印刷感 */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-25"
        style={{
          backgroundImage: `radial-gradient(${C.ink} 1.1px, transparent 1.2px)`,
          backgroundSize: "5px 5px",
        }}
      />
      {/* 紫色斜块,把右侧压住 */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-[10%] -right-[22%] h-[130%] w-[52vw] opacity-70"
        style={{ background: C.violet, transform: "skewX(-13deg)", mixBlendMode: "multiply" }}
      />

      {/* ── 主体:巨型产品名。整块反时针歪 2.5°,编号横出血到画面外 ── */}
      <div className="absolute inset-x-0 bottom-0 p-6 sm:p-10">
        <div className="mx-auto max-w-[1180px]">
          <div style={{ transform: "rotate(-2.5deg)", transformOrigin: "left bottom" }}>
            {/* 编号从左边缘出血出去 —— 不对齐容器,才不规矩 */}
            <span
              className="ml-[-2.5rem] inline-block py-1 pr-4 pl-10 font-mono text-[11px] font-black tracking-[0.2em] tabular-nums sm:ml-[-4rem]"
              style={{ background: C.amp, color: C.ink, transform: "skewX(-12deg)" }}
            >
              <span className="inline-block" style={{ transform: "skewX(12deg)" }}>
                0{i + 1} / 0{n}
              </span>
            </span>

            <h2
              className="mt-1 -ml-[0.06em] leading-[0.78] font-black tracking-[-0.055em] italic"
              style={{
                color: C.bone,
                fontSize: "clamp(3.5rem, 14vw, 12rem)",
                textShadow: `6px 6px 0 ${C.accent}, 0 8px 50px ${C.ink}`,
              }}
            >
              {cur.name}
            </h2>
          </div>

          <div className="mt-5 flex flex-wrap items-end justify-between gap-5">
            <p
              className="max-w-[52ch] text-[14px] leading-[1.6] sm:text-[15px]"
              style={{ color: `${C.bone}e6`, transform: "rotate(-0.8deg)" }}
            >
              {cur.pitch}
            </p>
            <div className="flex items-center gap-4">
              <span className="font-mono text-[11px] font-bold" style={{ color: C.amp }}>
                {metaOf(cur)}
              </span>
              <Slash
                href={cur.href}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[13px]"
                style={{ transform: "skewX(-12deg) rotate(-2deg)" }}
              >
                Visit ↗
              </Slash>
            </div>
          </div>

          {/* 进度条 + 切片选择 */}
          <div className="mt-7 flex flex-wrap items-center gap-2">
            {items.map((e, k) => (
              <button
                key={e.name}
                onClick={() => setI(k)}
                aria-label={`Show ${e.name}`}
                aria-current={k === i}
                className="group relative h-[3px] flex-1 basis-16 overflow-hidden transition-opacity"
                style={{ background: `${C.bone}33` }}
              >
                <span
                  className="absolute inset-y-0 left-0"
                  style={{
                    background: C.amp,
                    width: k < i ? "100%" : k === i ? "100%" : "0%",
                    opacity: k === i ? 1 : k < i ? 0.35 : 0,
                    transition:
                      k === i && !still && !paused ? `width ${SLIDE_MS}ms linear` : "opacity 200ms",
                  }}
                />
              </button>
            ))}
          </div>
          <div className="mt-2 flex gap-4 font-mono text-[10px]" style={{ color: `${C.bone}88` }}>
            {items.map((e, k) => (
              <button
                key={e.name}
                onClick={() => setI(k)}
                className="font-bold tracking-wider uppercase transition-colors"
                style={{ color: k === i ? C.amp : `${C.bone}88` }}
              >
                {e.name}
              </button>
            ))}
            <span className="ml-auto hidden sm:inline">← → to navigate</span>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ═══════════════════════ 下方:清单 ═══════════════════════ */

function Row({
  lead,
  name,
  pitch,
  meta,
  href,
  live,
  idx = 0,
}: {
  lead: string;
  name: string;
  pitch: string;
  meta?: string;
  href?: string;
  live?: boolean;
  idx?: number;
}) {
  const Tag = href ? "a" : "div";
  // 每行左移量按 index 循环错开 —— 完全对齐的一摞行是整页最"板正"的地方。
  // 幅度小到不伤扫读,大到能看出是故意的。
  const nudge = [0, 14, 5, 20, 9][idx % 5];
  return (
    <Tag
      {...(href ? { href, target: "_blank", rel: "noopener noreferrer" } : {})}
      className="group grid [transform:translateX(var(--nudge))] grid-cols-[4.5rem_1fr] items-baseline gap-x-3 gap-y-1 border-b px-2 py-3 transition-[background-color,transform] duration-150 hover:[transform:translateX(calc(var(--nudge)+14px))] motion-reduce:transition-none sm:grid-cols-[4.5rem_10rem_1fr_auto]"
      style={{ borderColor: `${C.bone}14`, "--nudge": `${nudge}px` } as React.CSSProperties}
      onMouseEnter={(e) => (e.currentTarget.style.background = `${C.blood}55`)}
      onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
    >
      <span
        className="font-mono text-[10px] whitespace-nowrap tabular-nums"
        style={{ color: `${C.bone}b0` }}
      >
        {lead}
      </span>
      <span
        className="flex items-center gap-1.5 text-[14px] font-black tracking-tight"
        style={{ color: C.bone }}
      >
        {name}
        {live && (
          <>
            <span
              aria-hidden="true"
              className="inline-block size-[6px] shrink-0"
              style={{ background: C.amp, transform: "rotate(45deg)" }}
            />
            <span className="sr-only">(active)</span>
          </>
        )}
      </span>
      <span
        className="col-start-2 text-[12.5px] leading-relaxed sm:col-start-3"
        style={{ color: `${C.bone}c8` }}
      >
        {pitch}
      </span>
      <span
        className="col-start-2 font-mono text-[10px] tabular-nums sm:col-start-4 sm:justify-self-end"
        style={{ color: `${C.bone}b0` }}
      >
        {meta}
        {href && (
          <span
            aria-hidden="true"
            className="ml-2 opacity-0 transition-opacity duration-150 group-hover:opacity-100"
            style={{ color: C.amp }}
          >
            ↗
          </span>
        )}
      </span>
    </Tag>
  );
}

/**
 * 分节头。刻意不规矩:整条向左出血到容器外、反向歪 1.5°,
 * 巨大的半透明编号压在标题背后错位 —— 对齐的标题条太板正了。
 */
function Head({
  n,
  label,
  count,
  tilt = -1.5,
}: {
  n: string;
  label: string;
  count: number;
  tilt?: number;
}) {
  return (
    <div
      className="relative mb-8 -ml-6 flex items-center gap-3 sm:-ml-10"
      style={{ transform: `rotate(${tilt}deg)` }}
    >
      {/* 压在背后的巨型编号,一半沉在标题下面 */}
      <span
        aria-hidden="true"
        className="pointer-events-none absolute -top-7 left-6 font-black italic select-none sm:left-10"
        style={{
          fontSize: "clamp(4rem,9vw,7rem)",
          color: C.blood,
          opacity: 0.5,
          lineHeight: 1,
        }}
      >
        {n}
      </span>
      <span
        className="relative py-1 pr-3 pl-6 text-[13px] font-black italic sm:pl-10"
        style={{ background: C.amp, color: C.ink, transform: "skewX(-12deg)" }}
      >
        <span className="inline-block" style={{ transform: "skewX(12deg)" }}>
          {n}
        </span>
      </span>
      <h2
        className="relative text-[26px] font-black tracking-[0.04em] italic sm:text-[34px]"
        style={{ color: C.bone, textShadow: `3px 3px 0 ${C.ink}` }}
      >
        {label}
      </h2>
      <span className="h-[4px] flex-1" style={{ background: C.accent }} />
      <span className="pr-1 font-mono text-[12px] tabular-nums" style={{ color: `${C.bone}b0` }}>
        {String(count).padStart(2, "0")}
      </span>
    </div>
  );
}

export function Home6() {
  const jobs = experiences
    .filter((e) => e.type === "work" || e.type === "internship")
    .sort((a, b) => b.period.start.localeCompare(a.period.start));
  const schools = experiences
    .filter((e) => e.type === "education")
    .sort((a, b) => b.period.start.localeCompare(a.period.start));
  const current = jobs.find((e) => !e.period.end);
  const rest = products.filter((p) => p.tier !== 1);

  const still = useReducedMotion();

  // 兜底色放 body 上,不放根 div —— 根 div 给实色会把 fixed 的 shader canvas 盖死。
  // WebGL 挂了或还没起来时,这个色保证不会白屏。
  useEffect(() => {
    const prev = document.body.style.background;
    document.body.style.background = C.ink;
    return () => {
      document.body.style.background = prev;
    };
  }, []);

  return (
    // 根容器不给实色:Backdrop 是 fixed + -z-10,实色底会把它整个盖住。
    // 只留一个兜底色在 body 级别(见下面 useEffect)。
    <div className="relative">
      {/* 全屏 shader 底噪。不是 3D 建模 —— 旋转的几何体跟"造终端工具"没关系,
          真正缺的是缓慢流动的辉光 + 扫描线,给静止的海报一层呼吸。 */}
      <Backdrop palette={C} reduced={!!still} />

      {/* ══ 首屏:主角是人,不是产品 ══
          之前首屏是巨大的 "kobe" + ENTER 按钮 —— 那是 landing page 的逻辑:
          产品当主角,人缩在角落当署名。个人网站反过来:名字是首屏最大的东西,
          产品降级成"证据",在下面证明这句话不是吹的。 */}
      <section
        className="relative flex min-h-[100dvh] flex-col justify-center overflow-hidden px-6 py-20 sm:px-10"
        style={{ background: "transparent" }}
      >
        <div
          aria-hidden="true"
          className="absolute -top-[30%] -left-[14%] h-[170%] w-[62vw] opacity-45"
          style={{ background: C.blood, transform: "skewX(-14deg)" }}
        />

        <div className="relative mx-auto w-full max-w-[1180px]">
          <p className="font-mono text-[12px] font-bold tracking-[0.34em]" style={{ color: C.amp }}>
            CHONG CHEN · 陈重
          </p>

          {/* 名字就是那个巨大的东西 */}
          <h1
            className="mt-4 leading-[0.8] font-black tracking-[-0.05em] italic"
            style={{
              color: C.bone,
              fontSize: "clamp(4rem,15vw,13rem)",
              textShadow: `7px 7px 0 ${C.accent}`,
              transform: "rotate(-2.5deg)",
              transformOrigin: "left center",
            }}
          >
            SMA1LBOY
          </h1>

          <h2
            className="mt-8 text-[clamp(1.5rem,4.2vw,2.9rem)] leading-[1.05] font-black tracking-[-0.03em] italic"
            style={{ color: C.bone }}
          >
            I build tools{" "}
            <span
              className="inline-block px-3"
              style={{ background: C.amp, color: C.ink, transform: "skewX(-8deg)" }}
            >
              <span className="inline-block" style={{ transform: "skewX(8deg)" }}>
                that run.
              </span>
            </span>
          </h2>

          <div className="mt-8 flex flex-wrap items-start justify-between gap-8">
            <p className="max-w-[56ch] text-[15px] leading-[1.7]" style={{ color: `${C.bone}dd` }}>
              Mostly things that live in a terminal. At TikTok I work on agent infrastructure and
              evaluation — the framework the team's agents run on, and the harness that decides
              whether they got better.
            </p>
            <div className="font-mono text-[11px]" style={{ color: `${C.bone}b0` }}>
              <div className="flex items-center gap-2">
                <span
                  aria-hidden="true"
                  className="inline-block size-[6px]"
                  style={{ background: C.amp, transform: "rotate(45deg)" }}
                />
                <span>{current ? `${current.title} · ${current.company}` : "—"}</span>
              </div>
              <p className="mt-1 pl-[14px]">{current?.location}</p>
              {/* 只留 x / github / linkedin。bilibili 和 email 不放首屏 —— 个人站上
                  链接越少每个越重,想联系的人点得到 linkedin。 */}
              <div className="mt-4 flex flex-wrap gap-x-3 gap-y-1 pl-[14px] font-bold">
                {socialLinks
                  .filter((l) => ["Twitter", "GitHub", "LinkedIn"].includes(l.label))
                  .map((l) => (
                    <a
                      key={l.label}
                      href={l.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="underline-offset-4 transition-colors hover:underline"
                      style={{ color: C.amp }}
                    >
                      {l.label === "Twitter" ? "x" : l.label.toLowerCase()}
                    </a>
                  ))}
              </div>
            </div>
          </div>

          {/* 首屏下半原本是死空白。放一行"证据摘要" —— 数字本身就是内容,
              同时明确告诉人下面有东西可看。 */}
          <div
            className="mt-16 flex flex-wrap items-end gap-x-10 gap-y-4 border-t pt-6"
            style={{ borderColor: `${C.bone}22` }}
          >
            {[
              {
                n: String(products.length + skills.length + experiments.length),
                l: "things built",
              },
              { n: "14k", l: "npm installs / mo" },
              { n: "180+", l: "github stars" },
              { n: String(flagships.length), l: "products shipped" },
            ].map((s) => (
              <div key={s.l}>
                <div
                  className="text-[clamp(1.6rem,3.4vw,2.4rem)] leading-none font-black italic"
                  style={{ color: C.amp }}
                >
                  {s.n}
                </div>
                <div
                  className="mt-1 font-mono text-[10px] tracking-wider uppercase"
                  style={{ color: `${C.bone}aa` }}
                >
                  {s.l}
                </div>
              </div>
            ))}
            <a
              href="#work-shown"
              className="ml-auto font-mono text-[11px] font-bold tracking-wider uppercase underline-offset-4 hover:underline"
              style={{ color: C.amp }}
            >
              ↓ what I shipped
            </a>
          </div>
        </div>
      </section>

      {/* ── 清单 ── */}
      <div className="mx-auto max-w-[1180px] px-6 py-16 sm:px-10 sm:py-24">
        {/* 产品轮播降级成"证据":放在自我介绍之后,证明上面那句话不是吹的 */}
        <section id="work-shown" className="scroll-mt-6 pb-16">
          <Head n="01" label="WHAT I SHIPPED" count={flagships.length} />
          <Stage items={flagships} />
        </section>

        <section id="build" className="scroll-mt-6 pb-16">
          <Head n="02" label="MORE BUILDS" count={rest.length} />
          {rest.map((e, idx) => (
            <Row
              key={e.name}
              idx={idx}
              lead={`'${e.year.slice(2)}`}
              name={e.name}
              pitch={e.pitch}
              href={e.href}
              live={e.live}
              meta={metaOf(e)}
            />
          ))}
        </section>

        <section id="skills" className="scroll-mt-6 pb-16">
          <Head n="03" label="SKILLS" count={skills.length} />
          {skills.map((e, idx) => (
            <Row
              key={e.name}
              idx={idx}
              lead="skill"
              name={e.name}
              pitch={e.pitch}
              href={e.href}
              meta={metaOf(e)}
            />
          ))}
        </section>

        <section id="work" className="scroll-mt-6 pb-16">
          <Head n="04" label="WORK" count={jobs.length + schools.length} />
          {jobs.map((e, idx) => (
            <Row
              key={e.id}
              idx={idx}
              lead={e.type === "internship" ? "intern" : "full"}
              name={e.company ?? ""}
              pitch={e.title}
              href={e.url}
              live={!e.period.end}
              meta={`${ym(e.period.start)} → ${e.period.end ? ym(e.period.end) : "now"}`}
            />
          ))}
          {schools.map((e, idx) => (
            <Row
              key={e.id}
              idx={idx}
              lead="edu"
              name={e.organization ?? ""}
              pitch={e.title}
              meta={`${ym(e.period.start)} → ${ym(e.period.end)}`}
            />
          ))}
        </section>

        {/* Lab 折叠 —— 12 个练手项目不该跟主线抢注意力,想看的人自己点开 */}
        <section id="lab" className="scroll-mt-6 pb-16">
          <details>
            <summary
              className="cursor-pointer list-none text-[13px] font-black tracking-[0.14em] uppercase transition-colors"
              style={{ color: C.amp }}
            >
              ▸ Lab — {experiments.length} things built to find out how they work
            </summary>
            <div className="mt-5">
              {experiments.map((e, idx) => (
                <Row
                  key={e.name}
                  idx={idx}
                  lead={e.lang ?? `'${e.year.slice(2)}`}
                  name={e.name}
                  pitch={e.pitch}
                  href={e.href}
                  meta={e.stars ? `${e.stars}★` : undefined}
                />
              ))}
            </div>
          </details>
        </section>

        {/* 站内其他页面 —— 这些是真实存在的路由,不是装饰性的占位。
            用大卡片而不是一行小链接:它们是页面,不是脚注。 */}
        <section id="elsewhere" className="scroll-mt-6 pb-16">
          <Head n="05" label="ELSEWHERE" count={INTERNAL.length} />
          <div className="grid gap-3 sm:grid-cols-2">
            {INTERNAL.map((p, idx) => (
              <Link
                key={p.to}
                to={p.to}
                className="group relative overflow-hidden p-5 transition-transform duration-200 hover:-translate-y-1 motion-reduce:transition-none motion-reduce:hover:translate-y-0"
                style={{
                  background: `${C.blood}44`,
                  border: `2px solid ${C.bone}1a`,
                  transform: `rotate(${idx % 2 ? 0.6 : -0.6}deg)`,
                }}
              >
                <div className="flex items-baseline gap-2">
                  <span
                    className="font-mono text-[10px] font-black tracking-[0.2em]"
                    style={{ color: C.amp }}
                  >
                    {p.kicker}
                  </span>
                  <span
                    aria-hidden="true"
                    className="ml-auto opacity-0 transition-opacity group-hover:opacity-100"
                    style={{ color: C.amp }}
                  >
                    →
                  </span>
                </div>
                <h3
                  className="mt-2 text-[22px] leading-none font-black tracking-tight italic"
                  style={{ color: C.bone }}
                >
                  {p.title}
                </h3>
                <p className="mt-2 text-[12.5px] leading-relaxed" style={{ color: `${C.bone}c8` }}>
                  {p.pitch}
                </p>
              </Link>
            ))}
          </div>
        </section>

        <footer
          className="flex items-baseline justify-between border-t-[3px] pt-4 font-mono text-[11px]"
          style={{ borderColor: C.accent, color: `${C.bone}b0` }}
        >
          <span>© {new Date().getFullYear()} CHONG CHEN</span>
          <a
            href="https://github.com/Sma1lboy/sma1lboy.me"
            target="_blank"
            rel="noopener noreferrer"
            className="font-bold underline-offset-4 hover:underline"
            style={{ color: C.amp }}
          >
            SOURCE ↗
          </a>
        </footer>
      </div>
    </div>
  );
}

export default Home6;
