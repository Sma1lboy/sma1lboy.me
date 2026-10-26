import { useEffect, useRef } from "react";
import { RAMP, blackhole, type Grid } from "./blackhole";

/**
 * 首屏的活字符场,做法借自 Oriku 的 "Digital Bloom" 海报:
 * 右边是一个一直在转的黑洞(blackhole.ts),每帧重算成字符格,亮度决定字符和 4 级颜色;
 * 光标经过,格子被弹开再弹回。背后还有一层很淡的噪声底纹。
 * 画布只是背景(aria-hidden),文字内容都在 DOM 里。
 */

export interface FieldPalette {
  /** 底纹字符色 */
  dust: string;
  /** 主体 1..4 级,暗 → 亮 */
  levels: readonly [string, string, string, string];
}

const DUST = " .,:;-=+*";
const SCRAMBLE = "/\\|<>?!~^";

export function Field({ still, palette }: { still: boolean; palette: FieldPalette }) {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const cv = ref.current;
    if (!cv) return;
    const ctx = cv.getContext("2d");
    if (!ctx) return;

    // 字号小一点,字符画才细;窄屏再小一档,主体才有足够的格数
    const FS = window.innerWidth < 640 ? 7 : 9;
    const font = `${FS}px "SF Mono", Menlo, Consolas, monospace`;
    let cw = 8;
    let chh = 16;
    let cols = 0;
    let rows = 0;
    let n = 0;
    let ox = new Float32Array(0);
    let oy = new Float32Array(0);
    let vx = new Float32Array(0);
    let vy = new Float32Array(0);
    let seed = new Float32Array(0);
    let show = new Uint8Array(0);
    let lum = new Uint8Array(0);
    let step: (s: number) => void = () => {};
    let raf = 0;
    let last = 0;
    let visible = true;
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

      // 主体:压在右下角出血,盘面右侧约 30% 和光圈下沿出画,像镜头只框住了一部分
      const wide = width >= 1024;
      const r = wide ? width * 0.46 : width * 0.8;
      const cx = width - r * 0.4;
      const cy = height * (wide ? 0.68 : 0.7);

      ox = new Float32Array(n);
      oy = new Float32Array(n);
      vx = new Float32Array(n);
      vy = new Float32Array(n);
      show = new Uint8Array(n);
      seed = new Float32Array(n);
      for (let i = 0; i < n; i++) seed[i] = Math.random();
      const grid: Grid = { cols, rows, cw, chh, cx, cy, r, show, lum: new Uint8Array(n) };
      lum = grid.lum;
      step = blackhole(grid);
    };

    const draw = (t: number) => {
      const s = t / 1000;
      show.fill(0);
      step(still ? 8 : s);
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
        if (!show[i] && !ox[i] && !oy[i]) continue;
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
          // 底纹不落到空格:全黑只留给黑洞的阴影,不然底纹里的空白块读起来像好几个黑洞
          v = 0.12 + ((v + 1.6) / 3.2) * 0.38;
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
        for (let i = 0; i < n; i++) {
          if (show[i] !== L) continue;
          // 被弹开的格子乱码
          const disp = Math.abs(ox[i]) + Math.abs(oy[i]);
          const ch = disp > 6 ? SCRAMBLE[Math.floor(seed[i] * 97 + tick) % SCRAMBLE.length] : RAMP[lum[i]];
          ctx.fillText(ch, (i % cols) * cw + ox[i], Math.floor(i / cols) * chh + oy[i]);
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

    const io = new IntersectionObserver(([en]) => (visible = en.isIntersecting));
    io.observe(cv);
    const ro = new ResizeObserver(() => {
      layout();
      draw(performance.now());
    });
    ro.observe(cv);

    layout();
    draw(performance.now());
    if (!still) {
      raf = requestAnimationFrame(loop);
      window.addEventListener("pointermove", onMove);
      document.addEventListener("pointerleave", onLeave);
    }
    return () => {
      cancelAnimationFrame(raf);
      io.disconnect();
      ro.disconnect();
      window.removeEventListener("pointermove", onMove);
      document.removeEventListener("pointerleave", onLeave);
    };
  }, [still, palette]);

  return <canvas ref={ref} aria-hidden="true" className="absolute inset-0 size-full" />;
}
