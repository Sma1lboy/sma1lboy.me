export type RGB = [number, number, number]
export type HSL = [number, number, number]

export interface ColorShades {
  [key: string]: string
}

export interface FunctionalColor {
  hue: number
  saturationFactor: number
}

export interface Colors {
  primary: ColorShades
  success: string
  warning: string
  danger: string
  secondary: string
}

export const hslToHex = (h: number, s: number, l: number): string => {
  l /= 100
  const a = (s * Math.min(l, 1 - l)) / 100
  const f = (n: number) => {
    const k = (n + h / 30) % 12
    const color = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1)

    return Math.round(255 * color)
      .toString(16)
      .padStart(2, '0')
  }

  return `#${f(0)}${f(8)}${f(4)}`
}

export const hexToHSL = (hex: string): HSL => {
  const r = parseInt(hex.slice(1, 3), 16) / 255
  const g = parseInt(hex.slice(3, 5), 16) / 255
  const b = parseInt(hex.slice(5, 7), 16) / 255
  const max = Math.max(r, g, b)
  const min = Math.min(r, g, b)
  let h: number,
    s: number,
    l = (max + min) / 2

  if (max === min) {
    h = s = 0
  } else {
    const d = max - min

    s = l > 0.5 ? d / (2 - max - min) : d / (max + min)
    switch (max) {
      case r:
        h = (g - b) / d + (g < b ? 6 : 0)
        break
      case g:
        h = (b - r) / d + 2
        break
      case b:
        h = (r - g) / d + 4
        break
      default:
        h = 0
    }
    h /= 6
  }

  return [h * 360, s * 100, l * 100]
}

export const calculateColors = (primaryColor: string): Colors => {
  const [h, s, l] = hexToHSL(primaryColor)
  const shades: ColorShades = {
    100: hslToHex(h, s, 95),
    200: hslToHex(h, s, 90),
    300: hslToHex(h, s, 80),
    400: hslToHex(h, s, 70),
    50: hslToHex(h, s, 98),
    500: primaryColor,
    600: hslToHex(h, s, 50),
    700: hslToHex(h, s, 40),
    800: hslToHex(h, s, 30),
    900: hslToHex(h, s, 20),
  }
  const functionalColors: { [key: string]: FunctionalColor } = {
    danger: { hue: 0, saturationFactor: 0.8 },
    secondary: { hue: (h + 180) % 360, saturationFactor: 1 },
    success: { hue: 120, saturationFactor: 0.6 },
    warning: { hue: 30, saturationFactor: 0.7 },
  }
  const otherColors = Object.entries(functionalColors).reduce<{
    [key: string]: string
  }>((acc, [name, { hue, saturationFactor }]) => {
    const adjustedSaturation = s * saturationFactor

    acc[name] = hslToHex(hue, adjustedSaturation, l)

    return acc
  }, {})

  return { primary: shades, ...otherColors } as Colors
}

interface ThemeConfig {
  name: string
  primaryColor: string
}
interface ColorConfig {
  colors: {
    background: string
    danger: string
    foreground: string
    primary: {
      100: string
      200: string
      300: string
      400: string
      50: string
      500: string
      600: string
      700: string
      800: string
      900: string
      DEFAULT: string
    }
    secondary: string
    success: string
    warning: string
  }
}

export function generateThemes(configs: ThemeConfig[]) {
  const themes: Record<string, ColorConfig> = {}

  configs.forEach(({ name, primaryColor }) => {
    const colors: Colors = calculateColors(primaryColor)

    themes[name] = {
      colors: {
        background: name === 'dark' ? '#0F0F0F' : '#FFFFFF',
        danger: colors.danger,
        foreground: name === 'dark' ? '#FFFFFF' : '#1F1F1F',
        primary: {
          100: colors.primary['100'],
          200: colors.primary['200'],
          300: colors.primary['300'],
          400: colors.primary['400'],
          50: colors.primary['50'],
          500: colors.primary['500'],
          600: colors.primary['600'],
          700: colors.primary['700'],
          800: colors.primary['800'],
          900: colors.primary['900'],
          DEFAULT: colors.primary['500'],
        },
        secondary: colors.secondary,
        success: colors.success,
        warning: colors.warning,
      },
    }
  })

  return themes
}
