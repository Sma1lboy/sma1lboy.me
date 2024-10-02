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

import { CustomThemeToggle } from './CustomThemeToggle'

import { siteConfig } from '@/config/site'

interface NavItem {
  href: string
  label: string
}

interface NavLinkProps {
  href: string
  label: string
  isActive: boolean
  onClick?: () => void
}

const NavLink: React.FC<NavLinkProps> = ({
  href,
  label,
  isActive,
  onClick,
}) => (
  <NextLink legacyBehavior passHref href={href}>
    <Link
      className={isActive ? 'font-bold' : ''}
      color={isActive ? 'primary' : 'foreground'}
      onClick={onClick}
    >
      {label}
    </Link>
  </NextLink>
)

export const NavbarComp: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false)
  const pathname = usePathname()
  const closeMenu = () => setIsMenuOpen(false)

  const navItems = siteConfig.navItems.map((item: NavItem) => (
    <NavLink
      key={item.href}
      href={item.href}
      isActive={pathname === item.href}
      label={item.label}
      onClick={closeMenu}
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
          <NavLink href="/" isActive={false} label={siteConfig.name} />
        </NavbarBrand>
      </NavbarContent>
      <NavbarContent className="hidden gap-4 sm:flex" justify="center">
        <CustomThemeToggle />
        {navItems.map((item, index) => (
          <NavbarItem
            key={index}
            isActive={pathname === siteConfig.navItems[index].href}
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
