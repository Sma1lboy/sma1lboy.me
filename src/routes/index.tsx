import { createFileRoute } from "@tanstack/react-router";
import { useMemo } from "react";
import { Home1, Home2 } from "../components";

const homeVariants = [Home1, Home2];

function RandomHome() {
  const HomeComponent = useMemo(
    () => homeVariants[Math.floor(Math.random() * homeVariants.length)],
    [],
  );
  return <HomeComponent />;
}

export const Route = createFileRoute("/")({
  component: RandomHome,
});
