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
import { Button } from '@nextui-org/button'
import NextLink from 'next/link'
import { usePathname } from 'next/navigation'

import { siteConfig } from '@/config/site'

export const NavbarComp = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const pathname = usePathname()

  const closeMenu = () => setIsMenuOpen(false)

  return (
    <Navbar isBordered isMenuOpen={isMenuOpen} onMenuOpenChange={setIsMenuOpen}>
      <NavbarContent className="sm:hidden" justify="start">
        <NavbarMenuToggle
          aria-label={isMenuOpen ? 'Close menu' : 'Open menu'}
        />
      </NavbarContent>

      <NavbarContent className="sm:hidden pr-3" justify="center">
        <NavbarBrand>
          <NextLink passHref href="/">
            <p className="font-bold text-inherit">{siteConfig.name}</p>
          </NextLink>
        </NavbarBrand>
      </NavbarContent>

      <NavbarContent className="hidden sm:flex gap-4" justify="center">
        <NavbarBrand>
          <NextLink passHref href="/">
            <p className="font-bold text-inherit">{siteConfig.name}</p>
          </NextLink>
        </NavbarBrand>
        {siteConfig.navItems.map(item => (
          <NavbarItem key={item.href} isActive={pathname === item.href}>
            <NextLink passHref href={item.href}>
              <Link
                className={pathname === item.href ? 'font-bold' : ''}
                color={pathname === item.href ? 'primary' : 'foreground'}
              >
                {item.label}
              </Link>
            </NextLink>
          </NavbarItem>
        ))}
      </NavbarContent>

      <NavbarContent justify="end">
        <NavbarItem className="hidden lg:flex">
          <Link isExternal href={siteConfig.links.github}>
            GitHub
          </Link>
        </NavbarItem>
        <NavbarItem>
          <Button as={Link} color="primary" href="#" variant="flat">
            Contact
          </Button>
        </NavbarItem>
      </NavbarContent>

      <NavbarMenu>
        {siteConfig.navItems.map(item => (
          <NavbarMenuItem key={item.href}>
            <NextLink passHref href={item.href}>
              <Link
                className="w-full"
                color={pathname === item.href ? 'primary' : 'foreground'}
                size="lg"
                onClick={closeMenu}
              >
                {item.label}
              </Link>
            </NextLink>
          </NavbarMenuItem>
        ))}
      </NavbarMenu>
    </Navbar>
  )
}
