import { Link } from "@tanstack/react-router";
import { useThemeStore } from "@/store/themeStore";

export function BrutalistNav() {
  const { resolvedTheme, toggleTheme } = useThemeStore();

  return (
    <nav className="fixed top-0 right-0 left-0 z-50 border-b-8 border-black bg-white dark:border-white dark:bg-black">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4">
        <div className="flex items-center gap-4">
          <Link
            to="/"
            className="border-4 border-black bg-black px-6 py-3 text-xl font-bold text-white uppercase transition-transform hover:translate-x-1 hover:translate-y-1 dark:border-white dark:bg-white dark:text-black"
          >
            ← CLASSIC
          </Link>
          <span className="text-2xl font-black uppercase">JACKSON CHEN</span>
        </div>
        <button
          onClick={toggleTheme}
          className="border-4 border-black bg-yellow-400 px-6 py-3 font-bold text-black uppercase transition-colors hover:bg-yellow-300 dark:border-white"
        >
          {resolvedTheme === "dark" ? "☀" : "🌙"} {resolvedTheme === "dark" ? "LIGHT" : "DARK"}
        </button>
      </div>
    </nav>
  );
}
