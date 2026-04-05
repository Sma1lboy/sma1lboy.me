import { createFileRoute } from "@tanstack/react-router";
import { RouteErrorBoundary } from "@/components/ErrorBoundary";
import { lazy, Suspense, useRef } from "react";
import { Home1 } from "../components";
import { useCursorTrail } from "../hooks/useCursorTrail";

const Home2 = lazy(() => import("../components/homes/home2").then((m) => ({ default: m.Home2 })));
const Home3 = lazy(() => import("../components/homes/home3").then((m) => ({ default: m.Home3 })));
const Home4 = lazy(() => import("../components/homes/home4").then((m) => ({ default: m.Home4 })));

const homeVariants = [Home1, Home2, Home3, Home4] as const;

// Pick once at module level so it never changes across re-renders or StrictMode double-invoke
const homeIdx = Math.floor(Math.random() * homeVariants.length);
const ChosenHome = homeVariants[homeIdx];

function RandomHome() {
  const containerRef = useRef<HTMLDivElement>(null);
  useCursorTrail(containerRef);

  return (
    <div ref={containerRef}>
      <Suspense fallback={<div className="min-h-screen bg-white dark:bg-black" />}>
        <ChosenHome />
      </Suspense>
    </div>
  );
}

export const Route = createFileRoute("/")({
  component: RandomHome,
  errorComponent: RouteErrorBoundary,
});
