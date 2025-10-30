import { create } from "zustand";
import { persist } from "zustand/middleware";

type Theme = "light" | "dark" | "system";

interface ThemeState {
  theme: Theme;
  resolvedTheme: "light" | "dark";
  setTheme: (theme: Theme) => void;
  toggleTheme: () => void;
}

const getSystemTheme = (): "light" | "dark" => {
  if (typeof window === "undefined") return "light";
  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
};

const applyTheme = (theme: "light" | "dark") => {
  if (typeof document === "undefined") return;

  const root = document.documentElement;
  if (theme === "dark") {
    root.classList.add("dark");
  } else {
    root.classList.remove("dark");
  }
};

export const useThemeStore = create<ThemeState>()(
  persist(
    (set, get) => {
      // Initialize resolved theme
      const initResolvedTheme = getSystemTheme();

      return {
        theme: "system",
        resolvedTheme: initResolvedTheme,
        setTheme: (theme: Theme) => {
          const resolvedTheme = theme === "system" ? getSystemTheme() : theme;
          applyTheme(resolvedTheme);
          set({ theme, resolvedTheme });
        },
        toggleTheme: () => {
          const current = get().theme;
          const nextTheme: Theme =
            current === "light" ? "dark" : current === "dark" ? "system" : "light";
          const resolvedTheme = nextTheme === "system" ? getSystemTheme() : nextTheme;
          applyTheme(resolvedTheme);
          set({ theme: nextTheme, resolvedTheme });
        },
      };
    },
    {
      name: "theme-storage",
      onRehydrateStorage: () => (state) => {
        if (state && typeof window !== "undefined") {
          // Apply theme on rehydration
          const resolvedTheme = state.theme === "system" ? getSystemTheme() : state.theme;
          applyTheme(resolvedTheme);
          state.resolvedTheme = resolvedTheme;

          // Listen for system theme changes
          const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
          const handleChange = () => {
            const currentState = useThemeStore.getState();
            if (currentState.theme === "system") {
              const newResolvedTheme = mediaQuery.matches ? "dark" : "light";
              applyTheme(newResolvedTheme);
              useThemeStore.setState({ resolvedTheme: newResolvedTheme });
            }
          };
          mediaQuery.addEventListener("change", handleChange);
        }
      },
    },
  ),
);

// Initialize theme and listen for system changes
if (typeof window !== "undefined") {
  // Apply initial theme
  const initTheme = () => {
    const store = useThemeStore.getState();
    const resolvedTheme = store.theme === "system" ? getSystemTheme() : store.theme;
    applyTheme(resolvedTheme);
    if (store.resolvedTheme !== resolvedTheme) {
      useThemeStore.setState({ resolvedTheme });
    }
  };

  // Apply theme immediately
  initTheme();

  // Listen for system theme changes
  const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
  const handleSystemThemeChange = () => {
    const currentState = useThemeStore.getState();
    if (currentState.theme === "system") {
      const newResolvedTheme = mediaQuery.matches ? "dark" : "light";
      applyTheme(newResolvedTheme);
      useThemeStore.setState({ resolvedTheme: newResolvedTheme });
    }
  };
  mediaQuery.addEventListener("change", handleSystemThemeChange);
}
