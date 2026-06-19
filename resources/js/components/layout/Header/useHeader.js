import { useState } from 'react'

export const useHeader = () => {
  const [activeTab, setActiveTab] = useState('Home')
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const navLinks = [
    { name: 'Home', href: '/' },
    { name: 'Products', href: '/products' },
    { name: 'Custom Builder', href: '/builder' },
    { name: 'Contact', href: '/contact' },
  ]

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen)

  return {
    activeTab,
    setActiveTab,
    isMenuOpen,
    toggleMenu,
    navLinks
  }
}
