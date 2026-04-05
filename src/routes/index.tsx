import { createFileRoute } from "@tanstack/react-router";
import { lazy, Suspense, useMemo, useRef } from "react";
import { Home1 } from "../components";
import { useCursorTrail } from "../hooks/useCursorTrail";

const Home2 = lazy(() => import("../components/homes/home2").then((m) => ({ default: m.Home2 })));
const Home3 = lazy(() => import("../components/homes/home3").then((m) => ({ default: m.Home3 })));
const Home4 = lazy(() => import("../components/homes/home4").then((m) => ({ default: m.Home4 })));

const homeVariants = [Home1, Home2, Home3, Home4] as const;

function RandomHome() {
  const idx = useMemo(() => Math.floor(Math.random() * homeVariants.length), []);
  const HomeComponent = homeVariants[idx];
  const containerRef = useRef<HTMLDivElement>(null);
  useCursorTrail(containerRef);

  return (
    <div ref={containerRef}>
      <Suspense fallback={<div className="min-h-screen bg-white dark:bg-black" />}>
        <HomeComponent />
      </Suspense>
    </div>
  );
}

export const Route = createFileRoute("/")({
  component: RandomHome,
});
