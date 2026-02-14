import Matter from "matter-js";
import { motion } from "framer-motion";
import { useCallback, useEffect, useRef, useState } from "react";
import { ArrowUpRight, Github, Linkedin, Mail, Play, Twitter } from "lucide-react";
import { featuredProjects, socialLinks } from "../../../constants/home";
import { sortedExperiences } from "../../../constants/experiences";

const iconMap: Record<string, React.ComponentType<{ size?: number; className?: string }>> = {
  Twitter,
  Play,
  Github,
  Linkedin,
  Mail,
};

const topSkills = [
  "TypeScript",
  "React",
  "Java",
  "Rust",
  "Python",
  "Node.js",
  "Spring Boot",
  "Docker",
  "PostgreSQL",
  "Tailwind",
  "Next.js",
  "GraphQL",
];

const latestWork = sortedExperiences.filter((e) => e.type === "work" || e.type === "internship");
const topProject = featuredProjects[0];

function clamp(v: number, min: number, max: number) {
  return Math.min(max, Math.max(min, v));
}

type DragTarget = "col-r0" | "col-r1-a" | "col-r1-b" | "row-0" | "row-1";

const fadeIn = (delay: number) => ({
  initial: { opacity: 0, y: 12 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.45, delay, ease: [0.25, 0.46, 0.45, 0.94] as const },
});

const lineColor = "bg-gray-200 dark:bg-[#1a1a1a]";

export function Home2() {
  const containerRef = useRef<HTMLDivElement>(null);
  const draggingRef = useRef<DragTarget | null>(null);

  // Grid split positions (percentages)
  const [col0, setCol0] = useState(60); // Row 0: Hero | Skills
  const [col1, setCol1] = useState<[number, number]>([38, 72]); // Row 1: Work | About | Featured
  const [rowH, setRowH] = useState<[number, number]>([50, 90]); // Row boundaries

  // Skills physics fall
  const [skillsFallen, setSkillsFallen] = useState(false);
  const skillsCellRef = useRef<HTMLDivElement>(null);
  const skillTagRefs = useRef<(HTMLSpanElement | null)[]>([]);
  const skillPositions = useRef<{ x: number; y: number; angle: number }[]>(
    topSkills.map(() => ({ x: 0, y: 0, angle: 0 })),
  );
  const initialTagPositions = useRef<{ x: number; y: number }[]>([]);
  const engineRef = useRef<Matter.Engine | null>(null);
  const bodiesRef = useRef<Matter.Body[]>([]);
  const rafRef = useRef<number>(0);
  const [, forceRender] = useState(0);

  useEffect(() => {
    if (!skillsFallen) {
      // Reset: stop engine, clear positions
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      if (engineRef.current) Matter.Engine.clear(engineRef.current);
      engineRef.current = null;
      bodiesRef.current = [];
      initialTagPositions.current = [];
      skillPositions.current = topSkills.map(() => ({ x: 0, y: 0, angle: 0 }));
      forceRender((n) => n + 1);
      return;
    }

    const cell = skillsCellRef.current;
    if (!cell) return;

    const cellRect = cell.getBoundingClientRect();
    const engine = Matter.Engine.create({ gravity: { x: 0, y: 2 } });
    engineRef.current = engine;

    // Walls (bottom, left, right)
    const wallThickness = 40;
    const ground = Matter.Bodies.rectangle(
      cellRect.width / 2, cellRect.height + wallThickness / 2,
      cellRect.width, wallThickness,
      { isStatic: true },
    );
    const leftWall = Matter.Bodies.rectangle(
      -wallThickness / 2, cellRect.height / 2,
      wallThickness, cellRect.height * 2,
      { isStatic: true },
    );
    const rightWall = Matter.Bodies.rectangle(
      cellRect.width + wallThickness / 2, cellRect.height / 2,
      wallThickness, cellRect.height * 2,
      { isStatic: true },
    );
    Matter.Composite.add(engine.world, [ground, leftWall, rightWall]);

    // Capture initial positions and create bodies for each tag
    const initPositions: { x: number; y: number }[] = [];
    const bodies: Matter.Body[] = [];
    skillTagRefs.current.forEach((el) => {
      if (!el) return;
      const tagRect = el.getBoundingClientRect();
      const x = tagRect.left - cellRect.left + tagRect.width / 2;
      const y = tagRect.top - cellRect.top + tagRect.height / 2;
      initPositions.push({ x, y });
      const body = Matter.Bodies.rectangle(x, y, tagRect.width, tagRect.height, {
        restitution: 0.3,
        friction: 0.4,
        frictionAir: 0.01,
        angle: (Math.random() - 0.5) * 0.3,
      });
      bodies.push(body);
    });
    initialTagPositions.current = initPositions;
    bodiesRef.current = bodies;
    Matter.Composite.add(engine.world, bodies);

    // Physics loop
    let lastTime = performance.now();
    const step = () => {
      const now = performance.now();
      const delta = Math.min(now - lastTime, 32);
      lastTime = now;
      Matter.Engine.update(engine, delta);

      // Sync positions using stored initial positions
      bodies.forEach((body, i) => {
        const orig = initPositions[i];
        if (!orig) return;
        skillPositions.current[i] = {
          x: body.position.x - orig.x,
          y: body.position.y - orig.y,
          angle: body.angle,
        };
      });
      forceRender((n) => n + 1);
      rafRef.current = requestAnimationFrame(step);
    };
    rafRef.current = requestAnimationFrame(step);

    return () => {
      cancelAnimationFrame(rafRef.current);
      Matter.Engine.clear(engine);
    };
  }, [skillsFallen]);

  const startDrag = useCallback((e: React.MouseEvent, target: DragTarget) => {
    e.preventDefault();
    draggingRef.current = target;
    document.body.style.cursor = target.startsWith("col") ? "col-resize" : "row-resize";
    document.body.style.userSelect = "none";
  }, []);

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      if (!draggingRef.current || !containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 100;
      const y = ((e.clientY - rect.top) / rect.height) * 100;

      switch (draggingRef.current) {
        case "col-r0":
          setCol0(clamp(x, 35, 80));
          break;
        case "col-r1-a":
          setCol1((p) => [clamp(x, 20, p[1] - 12), p[1]]);
          break;
        case "col-r1-b":
          setCol1((p) => [p[0], clamp(x, p[0] + 12, 88)]);
          break;
        case "row-0":
          setRowH((p) => [clamp(y, 25, p[1] - 12), p[1]]);
          break;
        case "row-1":
          setRowH((p) => [p[0], clamp(y, p[0] + 12, 92)]);
          break;
      }
    };

    const onUp = () => {
      draggingRef.current = null;
      document.body.style.cursor = "";
      document.body.style.userSelect = "";
    };

    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseup", onUp);
    return () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseup", onUp);
    };
  }, []);

  const border = "border-gray-200 dark:border-[#1a1a1a]";

  return (
    <div
      ref={containerRef}
      className="relative h-screen w-screen overflow-hidden bg-white text-gray-900 dark:bg-black dark:text-gray-100"
    >
      {/* ═══ CELLS (no CSS borders — lines are separate animated elements) ═══ */}

      {/* Hero — Row 0, Left */}
      <div
        className="absolute overflow-hidden"
        style={{ top: 0, left: 0, width: `${col0}%`, height: `${rowH[0]}%` }}
      >
        <motion.div className="flex h-full flex-col justify-between p-8 sm:p-10 lg:p-14" {...fadeIn(0)}>
          <p className="text-[10px] tracking-[0.3em] text-gray-400 uppercase dark:text-gray-600">
            Portfolio
          </p>
          <div>
            <h1 className="text-3xl leading-[1.1] font-bold tracking-tight sm:text-4xl lg:text-5xl xl:text-6xl">
              Hi, I am Jackson
              <br />
              <span className="text-gray-400 dark:text-gray-500">A Full-stack Developer</span>
            </h1>
            <div className="mt-6 flex gap-2">
              {socialLinks.map((link) => {
                const Icon = iconMap[link.icon];
                if (!Icon) return null;
                return (
                  <a
                    key={link.label}
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={link.label}
                    className={`rounded-full border p-2 transition-colors hover:bg-gray-50 dark:hover:bg-[#111] ${border}`}
                  >
                    <Icon size={14} className="text-gray-500 dark:text-gray-500" />
                  </a>
                );
              })}
            </div>
          </div>
        </motion.div>
      </div>

      {/* Skills — Row 0, Right */}
      <div
        ref={skillsCellRef}
        className="absolute cursor-pointer overflow-hidden"
        style={{ top: 0, left: `${col0}%`, width: `${100 - col0}%`, height: `${rowH[0]}%` }}
        onClick={() => setSkillsFallen((p) => !p)}
      >
        <motion.div className="relative h-full p-8 sm:p-10" {...fadeIn(0.08)}>
          <h2 className="mb-5 text-lg font-semibold tracking-tight">Skills</h2>
          <div className="flex flex-wrap gap-2">
            {topSkills.map((skill, i) => (
              <span
                key={skill}
                ref={(el) => { skillTagRefs.current[i] = el; }}
                className={`rounded-full border px-3 py-1.5 text-xs font-medium text-gray-600 hover:border-gray-400 hover:text-gray-900 dark:text-gray-400 dark:hover:border-[#444] dark:hover:text-gray-200 ${border}`}
                style={{
                  transform: `translate(${skillPositions.current[i]?.x ?? 0}px, ${skillPositions.current[i]?.y ?? 0}px) rotate(${skillPositions.current[i]?.angle ?? 0}rad)`,
                  transition: skillsFallen ? "none" : "transform 0.4s ease-out",
                }}
              >
                {skill}
              </span>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Work — Row 1, Left */}
      <div
        className="absolute overflow-auto"
        style={{
          top: `${rowH[0]}%`,
          left: 0,
          width: `${col1[0]}%`,
          height: `${rowH[1] - rowH[0]}%`,
        }}
      >
        <motion.div className="p-8" {...fadeIn(0.16)}>
          <h2 className="mb-4 text-lg font-semibold tracking-tight">Work</h2>
          <div className="space-y-3">
            {latestWork.slice(0, 3).map((exp) => (
              <div
                key={exp.id}
                className="group rounded-lg border border-gray-100 p-3.5 transition-colors hover:border-gray-300 dark:border-[#151515] dark:hover:border-[#2a2a2a]"
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium">{exp.title}</p>
                    <p className="mt-0.5 text-xs text-gray-500">
                      {exp.company} &middot; {exp.period.start.slice(0, 4)}–
                      {exp.period.end ? exp.period.end.slice(0, 4) : "Present"}
                    </p>
                  </div>
                  {exp.url && (
                    <a
                      href={exp.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="shrink-0 text-gray-400 transition-colors group-hover:text-gray-600 dark:group-hover:text-gray-300"
                    >
                      <ArrowUpRight size={13} />
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* About Me — Row 1, Center */}
      <div
        className="absolute overflow-hidden"
        style={{
          top: `${rowH[0]}%`,
          left: `${col1[0]}%`,
          width: `${col1[1] - col1[0]}%`,
          height: `${rowH[1] - rowH[0]}%`,
        }}
      >
        <motion.div className="flex h-full flex-col items-center justify-center gap-4 p-8" {...fadeIn(0.24)}>
          <img
            src="/home-avatar.png"
            alt="Jackson Chen"
            className="h-24 w-24 shrink-0 rounded-full object-cover grayscale"
          />
          <div className="text-center">
            <h2 className="mb-2 text-lg font-semibold tracking-tight">About Me</h2>
            <p className="text-xs leading-relaxed text-gray-500 dark:text-gray-500">
              CS graduate from UW-Madison, now building at TikTok. Passionate about AI tooling,
              open-source, and crafting developer experiences. GSoC alumnus &amp; hackathon winner.
              Contributed to projects serving 60M+ users.
            </p>
          </div>
        </motion.div>
      </div>

      {/* Featured — Row 1, Right */}
      <div
        className="absolute overflow-hidden"
        style={{
          top: `${rowH[0]}%`,
          left: `${col1[1]}%`,
          width: `${100 - col1[1]}%`,
          height: `${rowH[1] - rowH[0]}%`,
        }}
      >
        {topProject && (
          <motion.a
            href={topProject.url}
            target="_blank"
            rel="noopener noreferrer"
            className="group flex h-full flex-col justify-between p-8"
            {...fadeIn(0.32)}
          >
            <div>
              <p className="mb-1 text-[10px] tracking-[0.2em] text-gray-400 uppercase dark:text-gray-600">
                Featured
              </p>
              <h2 className="text-lg font-semibold tracking-tight">{topProject.title}</h2>
              <p className="mt-2 line-clamp-3 text-xs leading-relaxed text-gray-500">
                {topProject.description}
              </p>
            </div>
            <span className="mt-3 flex items-center gap-1 text-xs font-medium text-gray-400 transition-colors group-hover:text-gray-700 dark:group-hover:text-gray-300">
              View project{" "}
              <ArrowUpRight
                size={11}
                className="transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
              />
            </span>
          </motion.a>
        )}
      </div>

      {/* Contact — Row 2 */}
      <div
        className="absolute overflow-hidden"
        style={{ top: `${rowH[1]}%`, left: 0, width: "100%", height: `${100 - rowH[1]}%` }}
      >
        <motion.div
          className="flex h-full items-center justify-between p-8 sm:p-10"
          {...fadeIn(0.4)}
        >
          <div>
            <h2 className="text-lg font-semibold tracking-tight">Contact Me</h2>
            <p className="mt-1 text-xs text-gray-500">
              Open to opportunities, collaborations, and interesting conversations.
            </p>
          </div>
          <a
            href="mailto:541898146chen@gmail.com"
            className="flex items-center gap-2 text-sm font-medium text-gray-600 transition-colors hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-200"
          >
            <Mail size={14} />
            541898146chen@gmail.com
          </a>
        </motion.div>
      </div>

      {/* ═══ ANIMATED GRID LINES ═══ */}

      {/* Horizontal line 1: Row 0 | Row 1 — draws left → right */}
      <motion.div
        className={`absolute left-0 h-[2px] ${lineColor}`}
        style={{ top: `${rowH[0]}%`, width: "100%", transformOrigin: "left" }}
        initial={{ scaleX: 0 }}
        animate={{ scaleX: 1 }}
        transition={{ duration: 0.8, delay: 0.1, ease: [0.4, 0, 0.2, 1] }}
      />

      {/* Horizontal line 2: Row 1 | Row 2 — draws left → right */}
      <motion.div
        className={`absolute left-0 h-[2px] ${lineColor}`}
        style={{ top: `${rowH[1]}%`, width: "100%", transformOrigin: "left" }}
        initial={{ scaleX: 0 }}
        animate={{ scaleX: 1 }}
        transition={{ duration: 0.8, delay: 0.3, ease: [0.4, 0, 0.2, 1] }}
      />

      {/* Vertical line 1: Hero | Skills — draws top → bottom (after horizontal) */}
      <motion.div
        className={`absolute top-0 w-[2px] ${lineColor}`}
        style={{ left: `${col0}%`, height: `${rowH[0]}%`, transformOrigin: "top" }}
        initial={{ scaleY: 0 }}
        animate={{ scaleY: 1 }}
        transition={{ duration: 0.5, delay: 0.7, ease: [0.4, 0, 0.2, 1] }}
      />

      {/* Vertical line 2: Work | About — draws top → bottom */}
      <motion.div
        className={`absolute w-[2px] ${lineColor}`}
        style={{
          left: `${col1[0]}%`,
          top: `${rowH[0]}%`,
          height: `${rowH[1] - rowH[0]}%`,
          transformOrigin: "top",
        }}
        initial={{ scaleY: 0 }}
        animate={{ scaleY: 1 }}
        transition={{ duration: 0.5, delay: 0.85, ease: [0.4, 0, 0.2, 1] }}
      />

      {/* Vertical line 3: About | Featured — draws top → bottom */}
      <motion.div
        className={`absolute w-[2px] ${lineColor}`}
        style={{
          left: `${col1[1]}%`,
          top: `${rowH[0]}%`,
          height: `${rowH[1] - rowH[0]}%`,
          transformOrigin: "top",
        }}
        initial={{ scaleY: 0 }}
        animate={{ scaleY: 1 }}
        transition={{ duration: 0.5, delay: 1.0, ease: [0.4, 0, 0.2, 1] }}
      />

      {/* ═══ DRAG HANDLES (invisible, on top of lines) ═══ */}

      {/* Vertical: Row 0 Hero | Skills */}
      <div
        className="absolute top-0 z-10 w-1.5 -translate-x-1/2 cursor-col-resize transition-colors hover:bg-gray-400/20 active:bg-gray-400/30 dark:hover:bg-gray-500/20 dark:active:bg-gray-500/30"
        style={{ left: `${col0}%`, height: `${rowH[0]}%` }}
        onMouseDown={(e) => startDrag(e, "col-r0")}
      />

      {/* Vertical: Row 1 Work | About */}
      <div
        className="absolute z-10 w-1.5 -translate-x-1/2 cursor-col-resize transition-colors hover:bg-gray-400/20 active:bg-gray-400/30 dark:hover:bg-gray-500/20 dark:active:bg-gray-500/30"
        style={{ left: `${col1[0]}%`, top: `${rowH[0]}%`, height: `${rowH[1] - rowH[0]}%` }}
        onMouseDown={(e) => startDrag(e, "col-r1-a")}
      />

      {/* Vertical: Row 1 About | Featured */}
      <div
        className="absolute z-10 w-1.5 -translate-x-1/2 cursor-col-resize transition-colors hover:bg-gray-400/20 active:bg-gray-400/30 dark:hover:bg-gray-500/20 dark:active:bg-gray-500/30"
        style={{ left: `${col1[1]}%`, top: `${rowH[0]}%`, height: `${rowH[1] - rowH[0]}%` }}
        onMouseDown={(e) => startDrag(e, "col-r1-b")}
      />

      {/* Horizontal: Row 0 | Row 1 */}
      <div
        className="absolute left-0 z-10 h-1.5 w-full -translate-y-1/2 cursor-row-resize transition-colors hover:bg-gray-400/20 active:bg-gray-400/30 dark:hover:bg-gray-500/20 dark:active:bg-gray-500/30"
        style={{ top: `${rowH[0]}%` }}
        onMouseDown={(e) => startDrag(e, "row-0")}
      />

      {/* Horizontal: Row 1 | Row 2 */}
      <div
        className="absolute left-0 z-10 h-1.5 w-full -translate-y-1/2 cursor-row-resize transition-colors hover:bg-gray-400/20 active:bg-gray-400/30 dark:hover:bg-gray-500/20 dark:active:bg-gray-500/30"
        style={{ top: `${rowH[1]}%` }}
        onMouseDown={(e) => startDrag(e, "row-1")}
      />
    </div>
  );
}
