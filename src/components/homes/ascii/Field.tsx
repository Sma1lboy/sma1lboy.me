import { useEffect, useRef } from "react";
import { SUBJECTS, SUBJECT_SIZE } from "./subjects";

/**
 * 首屏的活字符场,做法借自 Oriku 的 "Digital Bloom" 海报:
 * 一个主体被拆成一格一格的字符,按亮度分 4 级上色;光标经过,格子被弹开再弹回;
 * 每隔几秒主体碎开、重组成下一个(名字 → 花 → 狐狸 → 猫),点一下立刻换。
 * 背后还有一层很淡的噪声底纹。画布只是背景(aria-hidden),文字内容都在 DOM 里。
 */

export interface FieldPalette {
  /** 底纹字符色 */
  dust: string;
  /** 主体 1..4 级,暗 → 亮 */
  levels: readonly [string, string, string, string];
}

export const FIGURES = ["sma1lboy", "bloom", "fox", "cat"] as const;
const SOURCES = [null, SUBJECTS.flower, SUBJECTS.fox, SUBJECTS.cat];

const DUST = " .,:;-=+*";
const GLYPH = ["", ".:", "+=", "*#", "@%"];
const SCRAMBLE = "/\\|<>?!~^";

const HOLD = 5.5;
const MORPH = 1.6;

export function Field({
  still,
  palette,
  onFigure,
}: {
  still: boolean;
  palette: FieldPalette;
  onFigure?: (i: number) => void;
}) {
  const ref = useRef<HTMLCanvasElement>(null);
  const onFig = useRef(onFigure);
  onFig.current = onFigure;

  useEffect(() => {
    const cv = ref.current;
    if (!cv) return;
    const ctx = cv.getContext("2d");
    if (!ctx) return;

    // 窄屏格子缩小,主体才有足够的格数
    const FS = window.innerWidth < 640 ? 8 : 12;
    const font = `${FS}px "SF Mono", Menlo, Consolas, monospace`;
    let cw = 8;
    let chh = 16;
    let cols = 0;
    let rows = 0;
    let n = 0;
    let figs: Uint8Array[] = [];
    let ox = new Float32Array(0);
    let oy = new Float32Array(0);
    let vx = new Float32Array(0);
    let vy = new Float32Array(0);
    let seed = new Float32Array(0);
    let show = new Uint8Array(0);
    let raf = 0;
    let last = 0;
    let visible = true;
    let cur = 0;
    let prev = 0;
    let t0 = -MORPH;
    // px/py = 上一帧位置,用来算划动速度;t = 最后一次移动的时间,底纹涟漪从这刻起衰减
    const mouse = { x: -1e4, y: -1e4, px: -1e4, py: -1e4, t: -1e4 };

    const layout = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const { width, height } = cv.getBoundingClientRect();
      cv.width = Math.round(width * dpr);
      cv.height = Math.round(height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.font = font;
      cw = ctx.measureText("M").width;
      chh = Math.round(FS * 1.25);
      cols = Math.ceil(width / cw);
      rows = Math.ceil(height / chh);
      n = cols * rows;

      // 主体区域:宽屏放右半边,窄屏放正中;格子竖长,行数按 cw/chh 压,画出来才是方的
      const wide = width >= 1024;
      let rw = Math.floor(cols * (wide ? 0.44 : 0.92));
      let rh = Math.round((rw * cw) / chh);
      const maxH = Math.floor(rows * (wide ? 0.86 : 0.5));
      if (rh > maxH) {
        rh = maxH;
        rw = Math.round((rh * chh) / cw);
      }
      const rx = Math.round(cols * (wide ? 0.7 : 0.5) - rw / 2);
      const ry = Math.round(rows * (wide ? 0.5 : 0.47) - rh / 2);

      figs = SOURCES.map((src) => {
        const f = new Uint8Array(n);
        if (src) {
          for (let j = 0; j < rh; j++)
            for (let i = 0; i < rw; i++) {
              const x = rx + i;
              const y = ry + j;
              if (x < 0 || x >= cols || y < 0 || y >= rows) continue;
              const sx = Math.floor((i / rw) * SUBJECT_SIZE);
              const sy = Math.floor((j / rh) * SUBJECT_SIZE);
              f[y * cols + x] = src.charCodeAt(sy * SUBJECT_SIZE + sx) - 48;
            }
          return f;
        }
        // 名字:离屏画 SMA1 / LBOY 两行,每格采样一个像素
        const off = document.createElement("canvas");
        off.width = rw;
        off.height = rh;
        const o = off.getContext("2d")!;
        const face = (s: number) => `900 ${s}px "Helvetica Neue", Arial, sans-serif`;
        o.font = face(100);
        const size = Math.floor((100 * rw * 0.96) / o.measureText("LBOY").width);
        o.font = face(size);
        o.fillStyle = "#fff";
        o.textAlign = "center";
        o.textBaseline = "middle";
        o.save();
        o.translate(rw / 2, rh / 2);
        o.scale(1, cw / chh);
        o.fillText("SMA1", 0, -size * 0.46);
        o.fillText("LBOY", 0, size * 0.46);
        o.restore();
        const px = o.getImageData(0, 0, rw, rh).data;
        for (let j = 0; j < rh; j++)
          for (let i = 0; i < rw; i++) {
            const x = rx + i;
            const y = ry + j;
            if (x < 0 || x >= cols || y < 0 || y >= rows) continue;
            if (px[(j * rw + i) * 4 + 3] > 110) f[y * cols + x] = (i * 7 + j * 13) % 9 === 0 ? 3 : 4;
          }
        return f;
      });

      ox = new Float32Array(n);
      oy = new Float32Array(n);
      vx = new Float32Array(n);
      vy = new Float32Array(n);
      show = new Uint8Array(n);
      seed = new Float32Array(n);
      for (let i = 0; i < n; i++) seed[i] = Math.random();
    };

    const next = (s: number) => {
      prev = cur;
      cur = (cur + 1) % figs.length;
      t0 = s;
      onFig.current?.(cur);
    };

    const draw = (t: number) => {
      const s = t / 1000;
      if (!still && s - t0 > HOLD + MORPH) next(s);
      const p = Math.min(1, Math.max(0, (s - t0) / MORPH));
      // 碎开 → 重组:中段散得最开
      const burst = Math.sin(Math.PI * p);
      const A = figs[prev];
      const B = figs[cur];
      const { width, height } = cv.getBoundingClientRect();
      ctx.clearRect(0, 0, width, height);
      ctx.font = font;
      ctx.textBaseline = "top";
      const tick = Math.floor(s * 3);

      // 1. 物理:光标像一把刷子 —— 沿划动方向把格子带走,拖出尾迹,再慢慢弹回原位。
      //    斥力只占一小部分;主要的力来自光标这一帧移动了多少(速度),停着不动就不扫。
      const mvx = Math.max(-60, Math.min(60, mouse.x - mouse.px));
      const mvy = Math.max(-60, Math.min(60, mouse.y - mouse.py));
      mouse.px = mouse.x;
      mouse.py = mouse.y;
      const R = 80;
      for (let i = 0; i < n; i++) {
        const L = p >= seed[i] ? B[i] : A[i];
        show[i] = L;
        if (!L && !ox[i] && !oy[i]) continue;
        const x = (i % cols) * cw + ox[i];
        const y = Math.floor(i / cols) * chh + oy[i];
        const dx = x - mouse.x;
        const dy = y - mouse.y;
        const d2 = dx * dx + dy * dy;
        if (d2 < R * R && d2 > 0) {
          const d = Math.sqrt(d2);
          const k = 1 - d / R;
          // 每格带一点随机,扫出来是一缕一缕的,不是整块平移
          const drag = k * k * (0.28 + seed[i] * 0.3);
          vx[i] += mvx * drag + (dx / d) * k * 0.5;
          vy[i] += mvy * drag + (dy / d) * k * 0.5;
        }
        vx[i] = (vx[i] - ox[i] * 0.022) * 0.9;
        vy[i] = (vy[i] - oy[i] * 0.022) * 0.9;
        ox[i] += vx[i];
        oy[i] += vy[i];
        if (Math.abs(ox[i]) < 0.05 && Math.abs(vx[i]) < 0.05) ox[i] = vx[i] = 0;
        if (Math.abs(oy[i]) < 0.05 && Math.abs(vy[i]) < 0.05) oy[i] = vy[i] = 0;
      }

      // 2. 底纹:整行一次画,主体占的格留空。光标划过会在底纹里激起涟漪,6 秒内衰减完
      const since = s - mouse.t;
      ctx.fillStyle = palette.dust;
      for (let y = 0; y < rows; y++) {
        let row = "";
        for (let x = 0; x < cols; x++) {
          if (show[y * cols + x]) {
            row += " ";
            continue;
          }
          let v =
            Math.sin(x * 0.09 + s * 0.7) * 0.5 +
            Math.sin(y * 0.21 - s * 0.5 + x * 0.03) * 0.5 +
            Math.sin((x + y) * 0.05 + s * 0.3) * 0.6;
          v = ((v + 1.6) / 3.2) * 0.55;
          if (since < 6) {
            const dx = x * cw - mouse.x;
            const dy = y * chh - mouse.y;
            const d = Math.sqrt(dx * dx + dy * dy);
            v += Math.max(0, 1 - d / 160) * 0.6 + Math.sin(d / 18 - since * 6) * 0.25 * Math.max(0, 1 - d / 420);
          }
          row += DUST[Math.max(0, Math.min(DUST.length - 1, Math.floor(v * DUST.length)))];
        }
        ctx.fillText(row, 0, y * chh);
      }

      // 3. 主体:按级分批画,省掉来回切 fillStyle
      for (let L = 1; L <= 4; L++) {
        ctx.fillStyle = palette.levels[L - 1];
        const g = GLYPH[L];
        for (let i = 0; i < n; i++) {
          if (show[i] !== L) continue;
          const r = seed[i];
          const disp = Math.abs(ox[i]) + Math.abs(oy[i]);
          // 被弹开的格子乱码,散开中的格子沿各自方向飞
          const ch = disp > 6 ? SCRAMBLE[Math.floor(r * 97 + tick) % SCRAMBLE.length] : g[(Math.floor(r * 10) + tick) % 2];
          const ang = r * 6.283;
          const fly = burst * (8 + r * 40);
          ctx.fillText(
            ch,
            (i % cols) * cw + ox[i] + Math.cos(ang) * fly,
            Math.floor(i / cols) * chh + oy[i] + Math.sin(ang) * fly,
          );
        }
      }
    };

    const loop = (t: number) => {
      if (visible && t - last > 33) {
        last = t;
        draw(t);
      }
      raf = requestAnimationFrame(loop);
    };

    const onMove = (e: PointerEvent) => {
      const r = cv.getBoundingClientRect();
      mouse.x = e.clientX - r.left;
      mouse.y = e.clientY - r.top;
      mouse.t = performance.now() / 1000;
      // 光标刚进来时没有上一帧,别把"从屏外飞进来"算成一次猛扫
      if (mouse.px < -1e3) {
        mouse.px = mouse.x;
        mouse.py = mouse.y;
      }
    };
    const onLeave = () => {
      mouse.x = mouse.y = mouse.px = mouse.py = -1e4;
    };
    // 点首屏任意空白处换下一个主体;点到链接不算
    const onClick = (e: MouseEvent) => {
      if ((e.target as HTMLElement).closest("a, button")) return;
      const r = cv.getBoundingClientRect();
      if (e.clientY < r.top || e.clientY > r.bottom) return;
      if (performance.now() / 1000 - t0 > MORPH * 0.8) next(performance.now() / 1000);
    };

    const io = new IntersectionObserver(([en]) => (visible = en.isIntersecting));
    io.observe(cv);
    const ro = new ResizeObserver(() => {
      layout();
      draw(performance.now());
    });
    ro.observe(cv);

    layout();
    onFig.current?.(cur);
    draw(performance.now());
    if (!still) {
      raf = requestAnimationFrame(loop);
      window.addEventListener("pointermove", onMove);
      document.addEventListener("pointerleave", onLeave);
      window.addEventListener("click", onClick);
    }
    return () => {
      cancelAnimationFrame(raf);
      io.disconnect();
      ro.disconnect();
      window.removeEventListener("pointermove", onMove);
      document.removeEventListener("pointerleave", onLeave);
      window.removeEventListener("click", onClick);
    };
  }, [still, palette]);

  return <canvas ref={ref} aria-hidden="true" className="absolute inset-0 size-full" />;
}
