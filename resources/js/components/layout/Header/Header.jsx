import { useHeader } from './useHeader'
import { Search, ShoppingCart, User, Menu, X, ChevronDown, Info, HelpCircle, Shield, FileText } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { HEADER, BTN, GRADIENTS, SPACING } from '../../../config/theme'
import { router, usePage } from '@inertiajs/react'
import { useEffect, useState, useRef } from 'react'
import { useSelector } from 'react-redux'

const CATEGORIES_WITH_SUBCATEGORIES = [
  {
    name: 'Jerseys',
    slug: 'jerseys',
    subcategories: [
      { name: 'Pro Performance', slug: 'pro-performance' },
      { name: 'Match Jerseys', slug: 'match-jerseys' },
      { name: 'Practice Gear', slug: 'practice-gear' },
    ]
  },
  {
    name: 'T-Shirts',
    slug: 't-shirts',
    subcategories: [
      { name: 'Elite Training', slug: 'elite-training' },
      { name: 'Compression', slug: 'compression' },
      { name: 'Casual Tees', slug: 'casual-tees' },
    ]
  },
  {
    name: 'Hoodies',
    slug: 'hoodies',
    subcategories: [
      { name: 'Team Pullovers', slug: 'team-pullovers' },
      { name: 'Zip Hoodies', slug: 'zip-hoodies' },
      { name: 'Warm-up Fleece', slug: 'warm-up-fleece' },
    ]
  },
  {
    name: 'Shorts',
    slug: 'shorts',
    subcategories: [
      { name: 'Performance Shorts', slug: 'performance-shorts' },
      { name: 'Compression Underwear', slug: 'compression-underwear' },
      { name: 'Training Shorts', slug: 'training-shorts' },
    ]
  },
  {
    name: 'Tracksuits',
    slug: 'tracksuits',
    subcategories: [
      { name: 'Active Jackets', slug: 'active-jackets' },
      { name: 'Jogger Pants', slug: 'jogger-pants' },
      { name: 'Warm-up Suits', slug: 'warm-up-suits' },
    ]
  },
  {
    name: 'Accessories',
    slug: 'accessories',
    subcategories: [
      { name: 'Goalkeeper Gloves', slug: 'goalkeeper-gloves' },
      { name: 'Team Caps', slug: 'team-caps' },
      { name: 'Sports Socks', slug: 'sports-socks' },
    ]
  }
]


export const Header = ({ onCartOpen, onProfileOpen, onSearchOpen, onProductsOpen, onHomeOpen, onAboutOpen, onContactOpen, onBuilderOpen }) => {
  const { categories = [], auth } = usePage().props
  const activeCategories = categories.length > 0 ? categories : CATEGORIES_WITH_SUBCATEGORIES

  const { activeTab, setActiveTab, navLinks, isMenuOpen, toggleMenu } = useHeader()
  const cartItems = useSelector((state) => state.cart.items) || []
  const cartCount = cartItems.reduce((acc, item) => acc + item.qty, 0)

  const [isProductsDropdownOpen, setIsProductsDropdownOpen] = useState(false)
  const [isPagesDropdownOpen, setIsPagesDropdownOpen] = useState(false)
  const [isMobileProductsOpen, setIsMobileProductsOpen] = useState(false)
  const [isMobilePagesOpen, setIsMobilePagesOpen] = useState(false)
  const closeTimeoutRef = useRef(null)
  const pagesTimeoutRef = useRef(null)

  const handleMouseEnter = () => {
    if (closeTimeoutRef.current) clearTimeout(closeTimeoutRef.current)
    setIsProductsDropdownOpen(true)
  }

  const handleMouseLeave = () => {
    closeTimeoutRef.current = setTimeout(() => {
      setIsProductsDropdownOpen(false)
    }, 150)
  }

  const handlePagesMouseEnter = () => {
    if (pagesTimeoutRef.current) clearTimeout(pagesTimeoutRef.current)
    setIsPagesDropdownOpen(true)
  }

  const handlePagesMouseLeave = () => {
    pagesTimeoutRef.current = setTimeout(() => {
      setIsPagesDropdownOpen(false)
    }, 150)
  }

  useEffect(() => {
    return () => {
      if (closeTimeoutRef.current) clearTimeout(closeTimeoutRef.current)
      if (pagesTimeoutRef.current) clearTimeout(pagesTimeoutRef.current)
    }
  }, [])

  // Sync active tab with URL (including nested routes like product details)
  useEffect(() => {
    const currentPath = window.location.pathname
    let foundTab = ''

    if (currentPath === '/') {
      foundTab = 'Home'
    } else if (currentPath.startsWith('/product-details') || currentPath.startsWith('/products')) {
      foundTab = 'Products'
    } else if (currentPath.startsWith('/builder')) {
      foundTab = 'Custom Builder'
    } else if (['/about', '/faq', '/privacy-policy', '/terms-of-service'].some(path => currentPath.startsWith(path))) {
      foundTab = 'Company'
    } else {
      const activeLink = navLinks.find(link => currentPath.startsWith(link.href) && link.href !== '/')
      if (activeLink) foundTab = activeLink.name
    }

    setActiveTab(foundTab)
  }, [window.location.pathname, navLinks, setActiveTab])

  const handleNavClick = (linkName) => {
    setActiveTab(linkName)
    const link = navLinks.find(l => l.name === linkName)
    if (link) {
      router.visit(link.href)
    }
  }

  return (
    <header className={`fixed top-0 left-0 w-full z-[2000] ${HEADER.bg} backdrop-blur-md border-b ${HEADER.border} shadow-lg shadow-indigo-900/30`}>
      <div className={`${SPACING.container}`}>
        <div className="flex justify-between items-center h-20">

          {/* Logo Section */}
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => router.visit('/')}>
            <div className="w-11 h-11 rounded-xl bg-white/15 border border-white/20 flex items-center justify-center text-white font-[600] text-lg shadow-md">
              ES
            </div>
            <span className="text-xl font-[500] tracking-tight text-white">
              EAY SPORTS
            </span>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            {navLinks.filter(l => l.name !== 'Custom Builder' && l.name !== 'Contact').map((link) => {
              const isActive = activeTab === link.name;
              if (link.name === 'Products') {
                return (
                  <div
                    key={link.name}
                    className="relative group py-2"
                    onMouseEnter={handleMouseEnter}
                    onMouseLeave={handleMouseLeave}
                  >
                    <button
                      onClick={() => handleNavClick(link.name)}
                      className={`text-[13px] font-medium transition-all duration-300 flex items-center gap-1 ${isActive
                        ? 'text-white'
                        : 'text-white/80 hover:text-white'
                        }`}
                    >
                      {link.name}
                      <ChevronDown size={14} className={`transition-transform duration-300 ${isProductsDropdownOpen ? 'rotate-180' : ''}`} />
                    </button>
                    <span className={`absolute bottom-0 left-0 h-[2px] bg-white transition-all duration-300 ${isActive ? 'w-full' : 'w-0 group-hover:w-full'
                      }`} />
                  </div>
                )
              }
              return (
                <div key={link.name} className="relative group py-2">
                  <button
                    onClick={() => handleNavClick(link.name)}
                    className={`text-[13px] font-medium transition-all duration-300 ${isActive
                      ? 'text-white'
                      : 'text-white/80 hover:text-white'
                      }`}
                  >
                    {link.name}
                  </button>
                  <span className={`absolute bottom-0 left-0 h-[2px] bg-white transition-all duration-300 ${isActive ? 'w-full' : 'w-0 group-hover:w-full'
                    }`} />
                </div>
              )
            })}

            {/* Company Dropdown Trigger (Desktop Only) */}
            <div
              className="relative group py-2"
              onMouseEnter={handlePagesMouseEnter}
              onMouseLeave={handlePagesMouseLeave}
            >
              <button
                className={`text-[13px] font-medium transition-all duration-300 flex items-center gap-1 ${activeTab === 'Company' ? 'text-white' : 'text-white/80 hover:text-white'
                  }`}
              >
                Company
                <ChevronDown size={14} className={`transition-transform duration-300 ${isPagesDropdownOpen ? 'rotate-180' : ''}`} />
              </button>
              <span className={`absolute bottom-0 left-0 h-[2px] bg-white transition-all duration-300 ${activeTab === 'Company' ? 'w-full' : 'w-0 group-hover:w-full'
                }`} />
            </div>

            {/* Custom Builder & Contact Nav Links (Rendered after Company) */}
            {navLinks.filter(l => l.name === 'Custom Builder' || l.name === 'Contact').map((link) => {
              const isActive = activeTab === link.name;
              return (
                <div key={link.name} className="relative group py-2">
                  <button
                    onClick={() => handleNavClick(link.name)}
                    className={`text-[13px] font-medium transition-all duration-300 ${isActive
                      ? 'text-white'
                      : 'text-white/80 hover:text-white'
                      }`}
                  >
                    {link.name}
                  </button>
                  <span className={`absolute bottom-0 left-0 h-[2px] bg-white transition-all duration-300 ${isActive ? 'w-full' : 'w-0 group-hover:w-full'
                    }`} />
                </div>
              )
            })}
          </nav>

          {/* Right Icons & CTA */}
          <div className="hidden md:flex items-center gap-5">
            <div className="flex items-center gap-4 text-white/75">
              <button onClick={onSearchOpen} className="hover:text-white transition-colors"><Search size={21} /></button>
              <button onClick={onCartOpen} className="relative hover:text-white transition-colors">
                <ShoppingCart size={21} />
                {cartCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-red-500 text-white text-[10px] w-5 h-5 flex items-center justify-center rounded-full border-2 border-[#4F46E5]">
                    {cartCount}
                  </span>
                )}
              </button>
              <button onClick={onProfileOpen} className="hover:text-white transition-colors"><User size={21} /></button>
            </div>
            {auth?.user && auth.user.role === 'dealer' && (
              <button
                onClick={() => router.visit('/dealer/dashboard')}
                className="bg-white text-[#4F46E5] px-6 py-2.5 rounded-full font-medium text-[13px] shadow-md hover:bg-indigo-50 hover:scale-105 transition-all"
              >
                Dealer Portal
              </button>
            )}
          </div>

          {/* Mobile Menu Toggle */}
          <div className="md:hidden">
            <button onClick={toggleMenu} className="text-white">
              {isMenuOpen ? <X size={26} /> : <Menu size={26} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation Drawer */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-[#4338CA] border-t border-white/10"
          >
            <div data-lenis-prevent="true" className="px-4 py-6 space-y-2 overflow-y-auto max-h-[calc(100dvh-80px)] pb-10">
              {navLinks.filter(l => l.name !== 'Custom Builder' && l.name !== 'Contact').map((link) => {
                if (link.name === 'Products') {
                  return (
                    <div key={link.name} className="space-y-1">
                      <div className="flex items-center justify-between w-full px-4 py-3 rounded-xl hover:bg-white/10 text-white/80 hover:text-white transition-all">
                        <button
                          onClick={() => {
                            router.visit('/products')
                            toggleMenu()
                          }}
                          className="text-left text-base font-medium flex-grow"
                        >
                          {link.name}
                        </button>
                        <button
                          onClick={() => {
                            setIsMobileProductsOpen(!isMobileProductsOpen)
                          }}
                          className="p-1 text-white/70 hover:text-white"
                        >
                          <ChevronDown
                            size={18}
                            className={`transition-transform duration-300 ${isMobileProductsOpen ? 'rotate-180' : ''}`}
                          />
                        </button>
                      </div>
                      <AnimatePresence>
                        {isMobileProductsOpen && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            className="pl-6 space-y-2 overflow-hidden pb-3"
                          >
                            {activeCategories.map((category) => (
                              <div key={category.name} className="space-y-1 py-1">
                                <button
                                  onClick={() => {
                                    router.visit(`/products?category=${category.slug}`)
                                    toggleMenu()
                                  }}
                                  className="text-left text-[14px] font-semibold text-white/90 hover:text-white block"
                                >
                                  {category.name}
                                </button>
                                <div className="pl-4 space-y-1 border-l border-white/10">
                                  {category.subcategories.map((sub) => (
                                    <button
                                      key={sub.name}
                                      onClick={() => {
                                        router.visit(`/products?category=${category.slug}&subcategory=${sub.slug}`)
                                        toggleMenu()
                                      }}
                                      className="text-left text-[13px] text-white/60 hover:text-white block py-0.5"
                                    >
                                      {sub.name}
                                    </button>
                                  ))}
                                </div>
                              </div>
                            ))}
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  )
                }
                return (
                  <button
                    key={link.name}
                    onClick={() => {
                      handleNavClick(link.name)
                      toggleMenu()
                    }}
                    className="w-full text-left px-4 py-3 rounded-xl text-base font-medium text-white/80 hover:bg-white/10 hover:text-white transition-all"
                  >
                    {link.name}
                  </button>
                )
              })}

              {/* Mobile Responsive Accordion Company Dropdown */}
              <div className="space-y-1">
                <div className="flex items-center justify-between w-full px-4 py-3 rounded-xl hover:bg-white/10 text-white/80 hover:text-white transition-all">
                  <button
                    onClick={() => setIsMobilePagesOpen(!isMobilePagesOpen)}
                    className="text-left text-base font-medium flex-grow"
                  >
                    Company
                  </button>
                  <button
                    onClick={() => setIsMobilePagesOpen(!isMobilePagesOpen)}
                    className="p-1 text-white/70 hover:text-white"
                  >
                    <ChevronDown
                      size={18}
                      className={`transition-transform duration-300 ${isMobilePagesOpen ? 'rotate-180' : ''}`}
                    />
                  </button>
                </div>
                <AnimatePresence>
                  {isMobilePagesOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="pl-6 space-y-2 overflow-hidden pb-3 border-l border-white/10 ml-4"
                    >
                      {[
                        { label: 'Our Story', href: '/about' },
                        { label: 'Help Center', href: '/faq' },
                        { label: 'Privacy Policy', href: '/privacy-policy' },
                        { label: 'Terms & Conditions', href: '/terms-of-service' },
                      ].map((item) => (
                        <button
                          key={item.label}
                          onClick={() => {
                            router.visit(item.href)
                            toggleMenu()
                          }}
                          className="text-left text-[14px] text-white/80 hover:text-white block py-1.5"
                        >
                          {item.label}
                        </button>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Mobile Responsive Custom Builder & Contact Links (Rendered after Company) */}
              {navLinks.filter(l => l.name === 'Custom Builder' || l.name === 'Contact').map((link) => (
                <button
                  key={link.name}
                  onClick={() => {
                    handleNavClick(link.name)
                    toggleMenu()
                  }}
                  className="w-full text-left px-4 py-3 rounded-xl text-base font-medium text-white/80 hover:bg-white/10 hover:text-white transition-all"
                >
                  {link.name}
                </button>
              ))}

              <div className="pt-4 border-t border-white/10 flex gap-6 px-4">
                <button onClick={() => { onSearchOpen?.(); toggleMenu(); }}><Search size={22} className="text-white/70 hover:text-white transition-colors" /></button>
                <button onClick={() => { onCartOpen?.(); toggleMenu(); }} className="relative">
                  <ShoppingCart size={22} className="text-white/70 hover:text-white transition-colors" />
                  {cartCount > 0 && (
                    <span className="absolute -top-2 -right-2 bg-red-500 text-white text-[9px] w-4.5 h-4.5 flex items-center justify-center rounded-full border border-[#4338CA]">
                      {cartCount}
                    </span>
                  )}
                </button>
                <button onClick={() => { onProfileOpen?.(); toggleMenu(); }}><User size={22} className="text-white/70 hover:text-white transition-colors" /></button>
              </div>
              {auth?.user && auth.user.role === 'dealer' && (
                <button
                  onClick={() => { router.visit('/dealer/dashboard'); toggleMenu(); }}
                  className="w-full mt-3 bg-white text-[#4F46E5] py-3 rounded-xl font-medium shadow-md hover:bg-indigo-50 transition-all text-sm"
                >
                  Dealer Portal
                </button>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      {/* Products Mega Dropdown (Desktop Only) */}
      <AnimatePresence>
        {isProductsDropdownOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            className="absolute top-20 left-0 w-full bg-white/95 backdrop-blur-md border-b border-indigo-100 shadow-2xl z-[90] text-slate-800"
          >
            <div className={`${SPACING.container} py-8 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8`}>
              {activeCategories.map((category) => (
                <div key={category.name} className="space-y-3">
                  <button
                    onClick={() => {
                      router.visit(`/products?category=${category.slug}`)
                      setIsProductsDropdownOpen(false)
                    }}
                    className="text-left font-semibold text-[#4F46E5] hover:text-[#7C3AED] transition-colors text-xs uppercase tracking-wider block"
                  >
                    {category.name}
                  </button>
                  <ul className="space-y-1.5">
                    {category?.subcategories?.map((sub) => (
                      <li key={sub.name}>
                        <button
                          onClick={() => {
                            router.visit(`/products?category=${category.slug}&subcategory=${sub.slug}`)
                            setIsProductsDropdownOpen(false)
                          }}
                          className="text-left text-[12px] text-slate-500 hover:text-[#4F46E5] transition-colors block"
                        >
                          {sub.name}
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      {/* Company Mega Dropdown (Desktop Only) */}
      <AnimatePresence>
        {isPagesDropdownOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            onMouseEnter={handlePagesMouseEnter}
            onMouseLeave={handlePagesMouseLeave}
            className="absolute top-20 left-0 w-full bg-white/95 backdrop-blur-md border-b border-indigo-100 shadow-2xl z-[90] text-slate-800"
          >
            <div className={`${SPACING.container} py-8 grid grid-cols-2 md:grid-cols-4 gap-6`}>
              {[
                { label: 'Our Story', href: '/about', icon: Info, desc: 'Learn about EAY Sports and our mission' },
                { label: 'Help Center', href: '/faq', icon: HelpCircle, desc: 'Frequently asked questions & support' },
                { label: 'Privacy Policy', href: '/privacy-policy', icon: Shield, desc: 'How we protect your data' },
                { label: 'Terms & Conditions', href: '/terms-of-service', icon: FileText, desc: 'Our terms of service & policies' },
              ].map((item) => (
                <button
                  key={item.label}
                  onClick={() => {
                    router.visit(item.href)
                    setIsPagesDropdownOpen(false)
                  }}
                  className="text-left group flex items-start gap-4 p-4 rounded-xl hover:bg-indigo-50/60 transition-all duration-200"
                >
                  <div className="w-10 h-10 rounded-lg bg-indigo-100 flex items-center justify-center flex-shrink-0 group-hover:bg-indigo-200 transition-colors">
                    <item.icon size={20} className="text-[#4F46E5]" />
                  </div>
                  <div>
                    <span className="font-semibold text-sm text-slate-800 group-hover:text-[#4F46E5] transition-colors block">
                      {item.label}
                    </span>
                    <span className="text-xs text-slate-400 mt-0.5 block">
                      {item.desc}
                    </span>
                  </div>
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}
