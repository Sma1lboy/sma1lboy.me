'use client'
import React, { useState } from 'react'
import {
  Navbar,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
  NavbarMenuToggle,
  NavbarMenu,
  NavbarMenuItem,
} from '@nextui-org/navbar'
import { Link } from '@nextui-org/link'
import NextLink from 'next/link'
import { usePathname } from 'next/navigation'
import dynamic from 'next/dynamic'

import { defaultConfig } from '@/config/siteConfig'

interface NavItem {
  href: string
  label: string
}

interface NavLinkProps {
  href: string
  label: string
  isActive: boolean
  onPress?: () => void
}

const NavLink: React.FC<NavLinkProps> = ({
  href,
  label,
  isActive,
  onPress,
}) => (
  <NextLink legacyBehavior passHref href={href}>
    <Link
      className={isActive ? 'font-bold' : ''}
      color={isActive ? 'primary' : 'foreground'}
      onPress={onPress}
    >
      {label}
    </Link>
  </NextLink>
)

const DynamicCustomThemeToggle = dynamic(
  () => import('./CustomThemeToggle').then(mod => mod.CustomThemeToggle),
  { ssr: false }
)

export const NavbarComp: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false)
  const pathname = usePathname()
  const closeMenu = () => setIsMenuOpen(false)

  const navItems = defaultConfig.navItems.map((item: NavItem) => (
    <NavLink
      key={item.href}
      href={item.href}
      isActive={pathname === item.href}
      label={item.label}
      onPress={closeMenu}
    />
  ))

  return (
    <Navbar isMenuOpen={isMenuOpen} onMenuOpenChange={setIsMenuOpen}>
      <NavbarContent className="sm:hidden" justify="start">
        <NavbarMenuToggle
          aria-label={isMenuOpen ? 'Close menu' : 'Open menu'}
        />
      </NavbarContent>
      <NavbarContent className="pr-3" justify="center">
        <NavbarBrand>
          <NavLink href="/" isActive={false} label={defaultConfig.name} />
        </NavbarBrand>
      </NavbarContent>
      <NavbarContent className="hidden gap-4 sm:flex" justify="center">
        <DynamicCustomThemeToggle />
        {navItems.map((item, index) => (
          <NavbarItem
            key={index}
            isActive={pathname === defaultConfig.navItems[index].href}
          >
            {item}
          </NavbarItem>
        ))}
      </NavbarContent>
      <NavbarMenu>
        {navItems.map((item, index) => (
          <NavbarMenuItem key={index}>{item}</NavbarMenuItem>
        ))}
      </NavbarMenu>
    </Navbar>
  )
}
