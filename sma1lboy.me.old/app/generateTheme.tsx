import { defaultConfig } from '@/config/siteConfig'
import { generateThemes } from '@/utils/tailwindThemeGenerator'

export const defaultTheme = generateThemes([
  { name: 'light', primaryColor: defaultConfig.colors.light },
  { name: 'dark', primaryColor: defaultConfig.colors.dark },
])
