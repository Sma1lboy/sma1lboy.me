import { useEffect, useRef } from "react";

interface Particle {
  x: number;
  y: number;
  alpha: number;
  size: number;
  vx: number;
  vy: number;
}

const MAX_PARTICLES = 40;
const SPAWN_INTERVAL = 3; // frames between spawns

export function useCursorTrail(containerRef: React.RefObject<HTMLElement | null>) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const canvas = document.createElement("canvas");
    canvas.style.cssText =
      "position:fixed;top:0;left:0;width:100%;height:100%;pointer-events:none;z-index:9999;";
    document.body.appendChild(canvas);
    canvasRef.current = canvas;

    const ctx = canvas.getContext("2d")!;
    const particles: Particle[] = [];
    const mouse = { x: -1, y: -1 };
    let frameCount = 0;
    let rafId = 0;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    const onMouseMove = (e: MouseEvent) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
    };
    container.addEventListener("mousemove", onMouseMove);

    const onMouseLeave = () => {
      mouse.x = -1;
      mouse.y = -1;
    };
    container.addEventListener("mouseleave", onMouseLeave);

    const tick = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      frameCount++;

      // Spawn particle
      if (mouse.x >= 0 && frameCount % SPAWN_INTERVAL === 0 && particles.length < MAX_PARTICLES) {
        const angle = Math.random() * Math.PI * 2;
        const speed = 0.3 + Math.random() * 0.5;
        particles.push({
          x: mouse.x,
          y: mouse.y,
          alpha: 0.6 + Math.random() * 0.3,
          size: 2 + Math.random() * 2.5,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed,
        });
      }

      // Update & draw
      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        p.x += p.vx;
        p.y += p.vy;
        p.alpha -= 0.012;
        p.size *= 0.985;

        if (p.alpha <= 0 || p.size < 0.3) {
          particles.splice(i, 1);
          continue;
        }

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(167, 139, 250, ${p.alpha})`;
        ctx.fill();
      }

      rafId = requestAnimationFrame(tick);
    };
    rafId = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener("resize", resize);
      container.removeEventListener("mousemove", onMouseMove);
      container.removeEventListener("mouseleave", onMouseLeave);
      canvas.remove();
    };
  }, [containerRef]);
}
