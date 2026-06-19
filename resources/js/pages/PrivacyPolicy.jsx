import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { ShieldCheck, Calendar, Lock, Eye, RefreshCw, FileText, Mail, ShieldAlert } from 'lucide-react'
import { SPACING } from '../config/theme'

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5, delay },
})

const sections = [
  {
    id: 'commitment',
    icon: ShieldCheck,
    title: 'Our Commitment To Your Privacy',
    content: 'At EAY Sports, we value the trust you place in our custom sportswear solutions. This Privacy Policy details how we manage and safeguard your wholesale business account data, storefront actions, and private proprietary designs. We are committed to maintaining the confidentiality, integrity, and security of all personal and corporate information entrusted to us.'
  },
  {
    id: 'collect',
    icon: Lock,
    title: '1. Information We Collect',
    content: 'We collect data necessary to manufacture custom products and secure partner storefront accounts. This includes your business name, representative credentials, corporate shipping addresses, contact telephone, tax identifiers, and vector or 3D customizer image files submitted during layout design.'
  },
  {
    id: 'use',
    icon: Eye,
    title: '2. How We Use Information',
    content: 'Collected details are used directly to fulfill wholesale orders, customize team assets, route parcel shipments via international carriers, calculate tax rates, process invoice credits, authenticate secure dashboard actions, and send critical production step notifications.'
  },
  {
    id: 'security',
    icon: ShieldAlert,
    title: '3. Data Security Measures',
    content: 'EAY Sports employs bank-grade database security systems. All active dealer passwords, customer credit card authorization payloads, and private 3D asset vector data are transmitted over high-grade secure layers (TLS/SSL) and stored with advanced encryption methods.'
  },
  {
    id: 'cookies',
    icon: RefreshCw,
    title: '4. Cookies & Trackers Policy',
    content: 'We utilize localized browser tracking to persist your active customizer session and retain storefront shopping cart layouts. Localized indicators do not track external browsing history or compromise partner credentials.'
  },
  {
    id: 'contact',
    icon: FileText,
    title: '5. Legal Inquiries & Contact',
    content: 'If you have concerns about corporate data handling, data deletion requests, or custom artwork licensing compliance, feel free to reach out to our legal department. We will address your concerns within 48 business hours.'
  }
]

export const PrivacyPolicy = () => {
  const [activeSection, setActiveSection] = useState('commitment')

  // Scroll spy to highlight active section in sidebar
  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY + 200

      for (const section of sections) {
        const el = document.getElementById(section.id)
        if (el) {
          const top = el.offsetTop
          const height = el.offsetHeight
          if (scrollPosition >= top && scrollPosition < top + height) {
            setActiveSection(section.id)
            break
          }
        }
      }
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const scrollToSection = (id) => {
    const el = document.getElementById(id)
    if (el) {
      const headerOffset = 100
      const elementPosition = el.getBoundingClientRect().top
      const offsetPosition = elementPosition + window.pageYOffset - headerOffset

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      })
      setActiveSection(id)
    }
  }

  return (
    <div className="pt-20 bg-slate-50 min-h-screen font-sans antialiased text-slate-700">
      
      {/* Banner Header */}
      <section className="relative bg-gradient-to-r from-indigo-900 via-indigo-800 to-purple-900 py-20 overflow-hidden text-center text-white">
        <div className="absolute inset-0 bg-grid-white/[0.05] bg-[size:20px_20px]" />
        <div className="absolute inset-0 opacity-15">
          <div className="absolute top-10 left-20 w-72 h-72 rounded-full bg-indigo-500 blur-3xl" />
          <div className="absolute bottom-0 right-10 w-96 h-96 rounded-full bg-purple-500 blur-3xl" />
        </div>
        <div className={`${SPACING.container} max-w-4xl relative z-10`}>
          <motion.div {...fadeUp()} className="inline-flex items-center gap-2 bg-white/10 border border-white/20 px-4 py-1.5 rounded-full mb-6">
            <ShieldCheck size={14} className="text-yellow-300 animate-pulse" />
            <span className="text-xs text-indigo-100 uppercase tracking-widest font-semibold">Trust & Security</span>
          </motion.div>
          <motion.h1 {...fadeUp(0.1)} className="text-[36px] md:text-[54px] text-white leading-tight font-extrabold mb-4 tracking-tight">
            PRIVACY POLICY
          </motion.h1>
          <p className="text-indigo-200 text-sm max-w-lg mx-auto">
            How we protect, manage, and safeguard your corporate files and business details.
          </p>
          <div className="flex items-center justify-center gap-2 text-indigo-300 text-xs font-semibold uppercase tracking-wider mt-6 bg-white/5 py-2 px-4 rounded-full w-fit mx-auto border border-white/5">
            <Calendar size={12} className="text-yellow-300" />
            <span>Last Updated: May 2026</span>
          </div>
        </div>
      </section>

      {/* Two-Column Interactive Document Layout */}
      <section className={`${SPACING.container} max-w-6xl py-16 px-4 md:px-8`}>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Column: Sticky Sidebar Index */}
          <div className="lg:col-span-4 sticky top-28 hidden lg:block">
            <div className="bg-white border border-slate-200/60 rounded-2xl p-6 shadow-sm">
              <h3 className="text-xs uppercase font-bold text-slate-400 tracking-widest mb-4 flex items-center gap-2">
                <ShieldCheck size={14} className="text-indigo-600" /> Policy Index
              </h3>
              <nav className="space-y-1">
                {sections.map((item) => {
                  const isActive = activeSection === item.id
                  return (
                    <button
                      key={item.id}
                      onClick={() => scrollToSection(item.id)}
                      className={`w-full text-left px-4 py-3 rounded-xl text-sm font-medium transition-all duration-300 flex items-center justify-between group ${
                        isActive 
                          ? 'bg-indigo-50 text-indigo-600 border border-indigo-100' 
                          : 'text-slate-500 hover:text-slate-800 hover:bg-slate-50'
                      }`}
                    >
                      <span className="truncate">{item.title}</span>
                      <span className={`w-1.5 h-1.5 rounded-full bg-indigo-600 transition-all ${isActive ? 'scale-100 opacity-100' : 'scale-0 opacity-0 group-hover:scale-100 group-hover:opacity-50'}`} />
                    </button>
                  )
                })}
              </nav>

              <div className="mt-8 pt-6 border-t border-slate-100">
                <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wide mb-2">Privacy Questions?</h4>
                <p className="text-xs text-slate-400 leading-relaxed mb-4">
                  For active data deletion requests, custom logo vectors clearance, or information security audits:
                </p>
                <a 
                  href="mailto:security@eaysports.com" 
                  className="w-full flex items-center justify-center gap-2 bg-slate-900 text-white hover:bg-slate-800 py-2.5 px-4 rounded-xl text-xs font-semibold shadow-sm transition-all"
                >
                  <Mail size={13} /> Email Security Team
                </a>
              </div>
            </div>
          </div>

          {/* Right Column: Main Document Content */}
          <div className="lg:col-span-8 bg-white border border-slate-200/60 shadow-lg shadow-slate-100 rounded-3xl p-6 md:p-12 space-y-12">
            {sections.map((sec, i) => {
              const Icon = sec.icon
              const isActive = activeSection === sec.id
              return (
                <motion.div 
                  key={sec.id} 
                  id={sec.id}
                  {...fadeUp(0.05)} 
                  className={`scroll-mt-28 pb-10 border-b border-slate-100 last:border-0 last:pb-0 transition-all duration-500 ${
                    isActive ? 'opacity-100 scale-[1.01]' : 'opacity-85'
                  }`}
                >
                  <div className="flex gap-4 items-start">
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 transition-all ${
                      isActive ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-150' : 'bg-slate-150/80 text-slate-500 bg-slate-100'
                    }`}>
                      <Icon size={22} className={isActive ? 'animate-pulse' : ''} />
                    </div>
                    <div className="space-y-3">
                      <h2 className={`text-base md:text-lg font-bold uppercase tracking-tight transition-colors ${
                        isActive ? 'text-indigo-600' : 'text-slate-800'
                      }`}>
                        {sec.title}
                      </h2>
                      <p className="text-xs md:text-sm text-slate-500 leading-relaxed font-normal">
                        {sec.content}
                      </p>
                    </div>
                  </div>
                </motion.div>
              )
            })}

            {/* Quick Mobile Action for Support */}
            <div className="lg:hidden mt-8 pt-8 border-t border-slate-100 flex flex-col items-center text-center">
              <h4 className="text-sm font-bold text-slate-800 uppercase tracking-wide mb-1">Privacy Questions?</h4>
              <p className="text-xs text-slate-400 max-w-xs mb-4">
                For active data deletion requests or information security audits.
              </p>
              <a 
                href="mailto:security@eaysports.com" 
                className="inline-flex items-center gap-2 bg-slate-900 text-white hover:bg-slate-800 py-3 px-6 rounded-xl text-xs font-semibold shadow-sm transition-all"
              >
                <Mail size={14} /> Email Security Team
              </a>
            </div>

          </div>

        </div>
      </section>

    </div>
  )
}

export default PrivacyPolicy
