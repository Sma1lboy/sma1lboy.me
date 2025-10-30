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

  return (
    <div
      onClick={toggleTheme}
      className="cursor-pointer"
      title={`Theme: ${theme === "system" ? "System" : theme === "dark" ? "Dark" : "Light"}`}
    >
      <Icon
        size={18}
        className="text-gray-700 transition-colors duration-200 sm:size-5 dark:text-gray-300"
      />
    </div>
  );
}

