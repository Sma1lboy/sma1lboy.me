export interface NavItem {
  href: string
  label: string
}

export interface Config {
  colors: {
    dark: string
    light: string
  }
  description: string
  links: {
    bilibili?: string
    github?: string
    instagram?: string
    linkedin?: string
  }
  email?: string
  resume?: string
  maxNotesPerPage: number
  maxProjectsPerPage: number
  name: string
  navItems: NavItem[]
  navMenuItems: NavItem[]
}
