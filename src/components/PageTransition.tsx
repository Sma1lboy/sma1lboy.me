import { Outlet } from "@tanstack/react-router";

export function PageTransition() {
  return (
    <main id="main-content" style={{ minHeight: "100vh" }}>
      <Outlet />
    </main>
  );
}
