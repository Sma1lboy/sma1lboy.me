import { Moon, Sun, Monitor } from "lucide-react";
import { useThemeStore } from "../../store/themeStore";

export function ThemeToggle() {
  const { theme, resolvedTheme, toggleTheme } = useThemeStore();

  const getIcon = () => {
    if (theme === "system") {
      return Monitor;
    }
    return resolvedTheme === "dark" ? Moon : Sun;
  };

  const Icon = getIcon();

  const themeLabel = theme === "system" ? "System" : theme === "dark" ? "Dark" : "Light";

  return (
    <button
      type="button"
      onClick={toggleTheme}
      className="cursor-pointer"
      aria-label={`Toggle theme, current: ${themeLabel}`}
      title={`Theme: ${themeLabel}`}
    >
      <Icon
        size={18}
        className="text-gray-700 transition-colors duration-200 sm:size-5 dark:text-gray-300"
      />
    </button>
  );
}
