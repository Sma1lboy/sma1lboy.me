import { useEffect, useRef } from "react";
import type { Palette } from "./palettes";

/**
 * 全屏 shader 底噪。
 *
 * 判断:这里不做 3D 建模。旋转的几何体 / 粒子球跟"造终端工具"没有任何关系,
 * 只会变成又一次与产品无关的装饰。真正缺的是"动的底噪" —— 缓慢流动的辉光 +
 * 扫描线 + 噪点,给静止的海报一层呼吸。这个用一张全屏 quad 的 fragment shader 就够,
 * 不需要场景、相机、模型、光照。
 *
 * 不用 three:它 gzip 后 186KB,而这里要的只是"一张全屏 quad + 一个 fragment shader"。
 * 为一层背景纹理拖进整个 3D 引擎是纯粹的浪费 —— 裸 WebGL 大约 30 行就够,零依赖。
 *
 * 降级路径是明确的:reduce-motion 只画一帧静止的;WebGL 拿不到就整个不渲染
 * (父层有纯 CSS 的底色兜底,不会白屏)。
 */

const FRAG = /* glsl */ `
precision highp float;
uniform vec2  uRes;
uniform float uTime;
uniform vec3  uGlowA;
uniform vec3  uGlowB;
uniform vec3  uInk;

// 便宜的 2D 值噪声 —— 不需要 simplex,这里只是底噪
float hash(vec2 p){ return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
float noise(vec2 p){
  vec2 i = floor(p), f = fract(p);
  vec2 u = f * f * (3.0 - 2.0 * f);
  return mix(mix(hash(i), hash(i + vec2(1,0)), u.x),
             mix(hash(i + vec2(0,1)), hash(i + vec2(1,1)), u.x), u.y);
}
float fbm(vec2 p){
  float v = 0.0, a = 0.5;
  for (int i = 0; i < 5; i++){ v += a * noise(p); p *= 2.02; a *= 0.5; }
  return v;
}

void main(){
  vec2 uv = gl_FragCoord.xy / uRes;
  vec2 p  = uv * vec2(uRes.x / uRes.y, 1.0);

  float t = uTime * 0.045;

  // 两团缓慢漂移的辉光,互相推挤
  float n1 = fbm(p * 1.6 + vec2(t, t * 0.6));
  float n2 = fbm(p * 2.3 - vec2(t * 0.8, t * 1.1) + 4.7);

  vec3 col = uInk;
  col = mix(col, uGlowA, smoothstep(0.35, 0.95, n1) * 0.55);
  col = mix(col, uGlowB, smoothstep(0.55, 1.0, n2) * 0.22);

  // 斜向扫描线 —— P5 的印刷/CRT 质感,跟着 uv 走保证不同分辨率一致
  float scan = sin((uv.y * uRes.y * 1.1) + (uv.x * uRes.x * 0.35)) * 0.5 + 0.5;
  col *= 0.94 + 0.06 * scan;

  // 暗角:中心亮一点,边缘沉下去,给内容留可读的底
  float vig = smoothstep(1.25, 0.25, length(uv - 0.5));
  col *= 0.55 + 0.45 * vig;

  // 颗粒 —— 消除色带,也给一点胶片感
  col += (hash(gl_FragCoord.xy + fract(uTime)) - 0.5) * 0.035;

  gl_FragColor = vec4(col, 1.0);
}
`;

const VERT = /* glsl */ `
attribute vec2 aPos;
void main(){ gl_Position = vec4(aPos, 0.0, 1.0); }
`;

const hexToVec3 = (hex: string): [number, number, number] => {
  const h = hex.replace("#", "");
  return [
    parseInt(h.slice(0, 2), 16) / 255,
    parseInt(h.slice(2, 4), 16) / 255,
    parseInt(h.slice(4, 6), 16) / 255,
  ];
};

export function Backdrop({ palette, reduced }: { palette: Palette; reduced: boolean }) {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;

    const gl = canvas.getContext("webgl", { antialias: false, alpha: false });
    if (!gl) return; // 拿不到 WebGL 就什么都不画,body 的兜底色顶上

    const compile = (type: number, src: string) => {
      const sh = gl.createShader(type)!;
      gl.shaderSource(sh, src);
      gl.compileShader(sh);
      return sh;
    };
    const prog = gl.createProgram()!;
    gl.attachShader(prog, compile(gl.VERTEX_SHADER, VERT));
    gl.attachShader(prog, compile(gl.FRAGMENT_SHADER, FRAG));
    gl.linkProgram(prog);
    if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) return;
    gl.useProgram(prog);

    // 一张覆盖整个裁剪空间的三角形带
    const buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]), gl.STATIC_DRAW);
    const loc = gl.getAttribLocation(prog, "aPos");
    gl.enableVertexAttribArray(loc);
    gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);

    const u = (n: string) => gl.getUniformLocation(prog, n);
    gl.uniform3fv(u("uGlowA"), hexToVec3(palette.glowA));
    gl.uniform3fv(u("uGlowB"), hexToVec3(palette.glowB));
    gl.uniform3fv(u("uInk"), hexToVec3(palette.ink));
    const uRes = u("uRes");
    const uTime = u("uTime");

    // ponytail: 上限 1.5 —— 满屏 fbm 在 retina 按 3x 跑纯属烧 GPU,肉眼看不出差别
    const dpr = Math.min(window.devicePixelRatio, 1.5);
    const resize = () => {
      const w = Math.floor((canvas.clientWidth || window.innerWidth) * dpr);
      const h = Math.floor((canvas.clientHeight || window.innerHeight) * dpr);
      canvas.width = w;
      canvas.height = h;
      gl.viewport(0, 0, w, h);
      gl.uniform2f(uRes, w, h);
    };
    resize();
    window.addEventListener("resize", resize);

    const draw = (t: number) => {
      gl.uniform1f(uTime, t);
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
    };

    let raf = 0;
    if (reduced) {
      draw(0); // 减少动效:只画一帧,仍有质感但不动
    } else {
      const start = performance.now();
      const loop = () => {
        draw((performance.now() - start) / 1000);
        raf = requestAnimationFrame(loop);
      };
      loop();
    }

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
      gl.deleteProgram(prog);
      gl.deleteBuffer(buf);
    };
  }, [palette, reduced]);

  return (
    <canvas
      ref={ref}
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 -z-10 size-full"
    />
  );
}
