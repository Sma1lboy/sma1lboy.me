import { Link } from '@tanstack/react-router';
import { useThemeStore } from '@/store/themeStore';

export function BrutalistNav() {
  const { resolvedTheme, toggleTheme } = useThemeStore();

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white dark:bg-black border-b-8 border-black dark:border-white">
      <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link
            to="/"
            className="px-6 py-3 bg-black dark:bg-white text-white dark:text-black font-bold text-xl border-4 border-black dark:border-white hover:translate-x-1 hover:translate-y-1 transition-transform uppercase"
          >
            ← CLASSIC
          </Link>
          <span className="text-2xl font-black uppercase">JACKSON CHEN</span>
        </div>
        <button
          onClick={toggleTheme}
          className="px-6 py-3 bg-yellow-400 text-black font-bold border-4 border-black dark:border-white hover:bg-yellow-300 transition-colors uppercase"
        >
          {resolvedTheme === 'dark' ? '☀' : '🌙'} {resolvedTheme === 'dark' ? 'LIGHT' : 'DARK'}
        </button>
      </div>
    </nav>
  );
}
