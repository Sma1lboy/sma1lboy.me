import { useLanguageStore } from "@/store/languageStore";
import { getNestedValue } from "@/lib/i18n-utils";
import en, { type Translations } from "./en";
import zh from "./zh";

const translations: Record<string, Translations> = { en, zh };

export function useTranslation() {
  const language = useLanguageStore((s) => s.language);
  const dict = translations[language] ?? en;

  function t(key: string): string {
    return getNestedValue(dict, key);
  }

  return { t, language };
}
