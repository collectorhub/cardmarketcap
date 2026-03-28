"use client"

import React, { createContext, useContext, useState } from 'react'

interface MobileMenuContextType {
  isOpen: boolean
  openMenu: () => void
  closeMenu: () => void
  toggleMenu: () => void
}

const MobileMenuContext = createContext<MobileMenuContextType | undefined>(undefined)

export function MobileMenuProvider({ children }: { children: React.ReactNode }) {
  const [isOpen, setIsOpen] = useState(false)

  const openMenu = () => setIsOpen(true)
  const closeMenu = () => setIsOpen(false)
  const toggleMenu = () => setIsOpen((prev) => !prev)

  return (
    <MobileMenuContext.Provider value={{ isOpen, openMenu, closeMenu, toggleMenu }}>
      {children}
    </MobileMenuContext.Provider>
  )
}

export function useMobileMenu() {
  const context = useContext(MobileMenuContext)
  if (!context) throw new Error("useMobileMenu must be used within MobileMenuProvider")
  return context
}