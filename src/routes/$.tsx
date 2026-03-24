import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";

export const Route = createFileRoute("/$")({
  component: NotFound,
});

/** A single falling digit particle */
interface Particle {
  char: string;
  x: number;
  y: number;
  vx: number;
  vy: number;
  rotation: number;
  vr: number;
  opacity: number;
  size: number;
}

function useParticles() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particlesRef = useRef<Particle[]>([]);
  const animRef = useRef<number>(0);
  const [scattered, setScattered] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d")!;

    const resize = () => {
      canvas.width = canvas.offsetWidth * 2;
      canvas.height = canvas.offsetHeight * 2;
      ctx.scale(2, 2);
    };
    resize();
    window.addEventListener("resize", resize);

    // Create "404" character particles in a grid
    const chars = "404".split("");
    const particles: Particle[] = [];
    const w = canvas.offsetWidth;
    const h = canvas.offsetHeight;
    const fontSize = Math.min(w * 0.18, 160);
    const startX = w / 2 - fontSize * 1.2;
    const centerY = h * 0.4;

    chars.forEach((char, ci) => {
      const cx = startX + ci * fontSize * 0.85;
      // Each character broken into sub-particles
      for (let r = 0; r < 5; r++) {
        for (let c = 0; c < 3; c++) {
          particles.push({
            char,
            x: cx + c * (fontSize * 0.25),
            y: centerY - fontSize * 0.3 + r * (fontSize * 0.18),
            vx: 0,
            vy: 0,
            rotation: 0,
            vr: 0,
            opacity: 1,
            size: fontSize * 0.35,
          });
        }
      }
    });

    particlesRef.current = particles;

    // Scatter after a brief pause
    const timer = setTimeout(() => {
      setScattered(true);
      for (const p of particlesRef.current) {
        p.vx = (Math.random() - 0.5) * 8;
        p.vy = -Math.random() * 6 - 2;
        p.vr = (Math.random() - 0.5) * 0.3;
      }
    }, 1200);

    const gravity = 0.15;

    const animate = () => {
      ctx.clearRect(0, 0, canvas.offsetWidth, canvas.offsetHeight);

      const isDark = document.documentElement.classList.contains("dark");
      ctx.fillStyle = isDark ? "rgba(255,255,255,0.85)" : "rgba(0,0,0,0.85)";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";

      for (const p of particlesRef.current) {
        p.vy += gravity;
        p.x += p.vx;
        p.y += p.vy;
        p.rotation += p.vr;

        // Fade out as they fall off screen
        if (p.y > canvas.offsetHeight * 0.85) {
          p.opacity = Math.max(0, p.opacity - 0.02);
        }

        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rotation);
        ctx.globalAlpha = p.opacity;
        ctx.font = `bold ${p.size}px ui-monospace, monospace`;
        ctx.fillText(p.char, 0, 0);
        ctx.restore();
      }

      animRef.current = requestAnimationFrame(animate);
    };

    animRef.current = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(animRef.current);
      clearTimeout(timer);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return { canvasRef, scattered };
}

const links = [
  { to: "/" as const, label: "Home" },
  { to: "/apps" as const, label: "Lab" },
  { to: "/cmt" as const, label: "Thoughts" },
  { to: "/profile" as const, label: "Profile" },
];

export function NotFound() {
  const { canvasRef, scattered } = useParticles();

  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-white dark:bg-black">
      {/* Particle canvas */}
      <canvas
        ref={canvasRef}
        className="pointer-events-none absolute inset-0 h-full w-full"
      />

      {/* Content overlay — fades in after scatter */}
      <motion.div
        className="relative z-10 flex flex-col items-center gap-6 px-6 text-center"
        initial={{ opacity: 0, y: 20 }}
        animate={scattered ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.6, delay: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}
      >
        <p className="text-lg font-light text-gray-500 dark:text-gray-400">
          This page doesn&apos;t exist.
        </p>

        <div className="flex flex-wrap justify-center gap-3">
          {links.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className="rounded-lg border border-gray-200 px-4 py-2 text-sm font-medium text-gray-700 transition-all hover:border-gray-400 hover:text-gray-900 dark:border-gray-800 dark:text-gray-300 dark:hover:border-gray-600 dark:hover:text-gray-100"
            >
              {link.to === "/" ? "← " : ""}
              {link.label}
            </Link>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
