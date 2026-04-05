import { useLanguageStore } from "@/store/languageStore";
import en, { type Translations } from "./en";
import zh from "./zh";

const translations: Record<string, Translations> = { en, zh };

function getNestedValue(obj: unknown, path: string): string {
  const keys = path.split(".");
  let current: unknown = obj;
  for (const key of keys) {
    if (current == null || typeof current !== "object") return path;
    current = (current as Record<string, unknown>)[key];
  }
  return typeof current === "string" ? current : path;
}

export function useTranslation() {
  const language = useLanguageStore((s) => s.language);
  const dict = translations[language] ?? en;

  function t(key: string): string {
    return getNestedValue(dict, key);
  }

  return { t, language };
}
