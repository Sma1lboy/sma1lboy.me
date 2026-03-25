import { createFileRoute } from "@tanstack/react-router";
import { lazy, Suspense, useMemo } from "react";
import { Home1 } from "../components";

const Home2 = lazy(() =>
  import("../components/homes/home2").then((m) => ({ default: m.Home2 })),
);

const homeVariants = [Home1, Home2] as const;

function RandomHome() {
  const idx = useMemo(() => Math.floor(Math.random() * homeVariants.length), []);
  const HomeComponent = homeVariants[idx];
  return (
    <Suspense fallback={<div className="min-h-screen bg-white dark:bg-black" />}>
      <HomeComponent />
    </Suspense>
  );
}

export const Route = createFileRoute("/")({
  component: RandomHome,
});
