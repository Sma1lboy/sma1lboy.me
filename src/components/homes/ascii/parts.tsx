import { useEffect, useRef } from "react";

const RULE = "─".repeat(400);

/**
 * 用真字符画的框:┌─ title ───┐ / │ … │ / └───┘。
 * 横线是一串超长的 ─ 被 overflow 截断,所以框宽跟着容器走;
 * 竖边不用 │ 字形 —— 字形上下不满 em,逐行拼会断成虚线甚至整段不画;
 * 改成 1ch 列正中一条 1px 的 currentColor 线,和 ─/┌ 的笔画对齐。
 */
export function AsciiBox({
  title,
  right,
  children,
  className = "",
}: {
  title?: React.ReactNode;
  right?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={`min-w-0 ${className}`}>
      <div className="flex whitespace-nowrap" aria-hidden={title ? undefined : true}>
        <span aria-hidden="true">┌─</span>
        {title && <span className="px-[1ch]">{title}</span>}
        <span aria-hidden="true" className="min-w-0 flex-1 overflow-hidden">
          {RULE}
        </span>
        {right && <span className="px-[1ch]">{right}</span>}
        <span aria-hidden="true">{right ? "─┐" : "┐"}</span>
      </div>
      <div className="grid grid-cols-[1ch_minmax(0,1fr)_1ch]">
        <Side />
        <div className="px-[1.5ch] py-[0.6em]">{children}</div>
        <Side />
      </div>
      <div aria-hidden="true" className="flex whitespace-nowrap">
        <span>└</span>
        <span className="min-w-0 flex-1 overflow-hidden">{RULE}</span>
        <span>┘</span>
      </div>
    </div>
  );
}

function Side() {
  return (
    <div aria-hidden="true" className="flex justify-center">
      <div className="w-px bg-current" />
    </div>
  );
}

/**
 * donut.c(Andy Sloane, 2006)的 JS 版,画进一个 <pre>。
 * reduced-motion 下停在一帧;标签页隐藏时 rAF 自己会停。
 */
export function Donut({ cols = 56, rows = 24, still = false, className = "" }: {
  cols?: number;
  rows?: number;
  still?: boolean;
  className?: string;
}) {
  const ref = useRef<HTMLPreElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    let A = 1;
    let B = 1;
    let raf = 0;
    let last = 0;
    const lum = ".,-~:;=!*#$@";
    const n = cols * rows;
    const out = new Array<string>(n);
    const z = new Float32Array(n);

    const frame = () => {
      out.fill(" ");
      z.fill(0);
      const cA = Math.cos(A), sA = Math.sin(A), cB = Math.cos(B), sB = Math.sin(B);
      for (let j = 0; j < 6.28; j += 0.07) {
        const ct = Math.cos(j), st = Math.sin(j);
        for (let i = 0; i < 6.28; i += 0.02) {
          const sp = Math.sin(i), cp = Math.cos(i);
          const h = ct + 2;
          const D = 1 / (sp * h * sA + st * cA + 5);
          const t = sp * h * cA - st * sA;
          const x = Math.floor(cols / 2 + cols * 0.55 * D * (cp * h * cB - t * sB));
          const y = Math.floor(rows / 2 + rows * 0.62 * D * (cp * h * sB + t * cB));
          const o = x + cols * y;
          const N = Math.floor(8 * ((st * sA - sp * ct * cA) * cB - sp * ct * sA - st * cA - cp * ct * sB));
          if (y >= 0 && y < rows && x >= 0 && x < cols && D > z[o]) {
            z[o] = D;
            out[o] = lum[Math.max(0, N)];
          }
        }
      }
      let s = "";
      for (let r = 0; r < rows; r++) s += out.slice(r * cols, (r + 1) * cols).join("") + "\n";
      el.textContent = s;
    };

    const tick = (t: number) => {
      // ~20fps 足够,别每帧烧 CPU
      if (t - last > 50) {
        last = t;
        A += 0.07;
        B += 0.03;
        frame();
      }
      raf = requestAnimationFrame(tick);
    };

    frame();
    if (!still) raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [cols, rows, still]);

  return <pre ref={ref} aria-hidden="true" className={`leading-[1.05] select-none ${className}`} />;
}

/** figlet 横幅。真正的名字放在 sr-only 里,屏幕阅读器不用念一堆方块 */
export function Banner({
  lines,
  label,
  className = "",
  style,
}: {
  lines: string[];
  label: string;
  className?: string;
  style?: React.CSSProperties;
}) {
  return (
    <h1 className={className} style={style}>
      <span className="sr-only">{label}</span>
      <pre aria-hidden="true" className="leading-[1.05] whitespace-pre select-none">
        {lines.join("\n")}
      </pre>
    </h1>
  );
}
