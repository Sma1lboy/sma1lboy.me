/**
 * 首屏主体:黑洞。Field 每帧清空网格,这里往格子里填亮度(0..11,对应 RAMP),颜色级由亮度推出;
 * VOID 表示"这格是黑影",既不画主体也不画底纹。
 * 画面 = 阴影 + 斜着的吸积盘(远半边被挡住)+ 盘面被引力透镜弯到阴影上方的那圈光。
 */

/** 亮度阶梯,暗 → 亮,每 3 阶对应一级颜色 */
export const RAMP = ".,-~:;=!*#$@";
export const VOID = 255;
const TOP = RAMP.length - 1;

export interface Grid {
  cols: number;
  rows: number;
  /** 一格的像素宽高 */
  cw: number;
  chh: number;
  /** 主体中心(像素)和半径(像素):盘面外缘 */
  cx: number;
  cy: number;
  r: number;
  show: Uint8Array;
  lum: Uint8Array;
}

/** 阴影半径、盘内缘,单位是盘外缘半径;盘面倾斜后竖向压成 FLAT */
const H = 0.3;
const INNER = 0.42;
const FLAT = 0.2;

export function blackhole(g: Grid) {
  // 盘是扁的,只扫它可能出现的那条横带:竖向到透镜光圈顶为止
  const x0 = Math.max(0, Math.floor((g.cx - g.r) / g.cw));
  const x1 = Math.min(g.cols, Math.ceil((g.cx + g.r) / g.cw));
  const y0 = Math.max(0, Math.floor((g.cy - g.r * 0.5) / g.chh));
  const y1 = Math.min(g.rows, Math.ceil((g.cy + g.r * 0.5) / g.chh));
  return (s: number) => {
    for (let y = y0; y < y1; y++) {
      const v = ((y + 0.5) * g.chh - g.cy) / g.r;
      for (let x = x0; x < x1; x++) {
        const u = ((x + 0.5) * g.cw - g.cx) / g.r;
        const i = y * g.cols + x;
        const d = Math.hypot(u, v);
        const dz = v / FLAT;
        const rd = Math.hypot(u, dz);
        let b = 0;
        if (rd > INNER && rd < 1 && (v > 0 || d > H)) {
          const f = Math.pow(1 - (rd - INNER) / (1 - INNER), 1.4);
          // 迎面转来的一侧(左)更亮
          b = f * (0.65 + 0.35 * Math.sin(rd * 26 - s * 3 + Math.atan2(dz, u) * 2)) * (1 - 0.35 * (u / rd));
        }
        if (d > H) {
          const ring = Math.exp(-(((d - 0.36) / 0.06) ** 2)) * (0.75 + 0.25 * Math.sin(Math.atan2(v, u) * 3 + s * 2));
          b = Math.max(b, ring * (v < 0 ? 1 : 0.7));
        }
        if (b > 0.04) {
          const q = Math.max(0, Math.min(TOP, Math.floor(b * 11.9)));
          g.lum[i] = q;
          g.show[i] = 1 + Math.floor(q / 3);
        } else if (d < H) g.show[i] = VOID;
      }
    }
  };
}
