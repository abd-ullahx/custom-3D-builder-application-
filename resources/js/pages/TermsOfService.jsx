import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { FileText, Calendar, Scale, Award, ShieldAlert, Sparkles, BookOpen, Mail, ShieldCheck } from 'lucide-react'
import { SPACING } from '../config/theme'

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5, delay },
})

const terms = [
  {
    id: 'acceptance',
    icon: Scale,
    title: 'Acceptance of Terms',
    content: 'By accessing the storefront, utilizing our interactive 3D apparel customizer, or registering as a B2B partner, you agree to comply with and be bound by the following Terms of Service. Please read them carefully. If you do not agree with any part of these terms, you must discontinue your use of our platform and customizer services immediately.'
  },
  {
    id: 'wholesale',
    icon: BookOpen,
    title: '1. Wholesale Business Account',
    content: 'By registering as a wholesale dealer, you represent that you hold valid corporate tax credentials, business status, or localized team-sports uniform authorization status. You are solely responsible for keeping login credentials confidential and monitoring all activities under your wholesale login. EAY Sports reserves the right to suspend accounts with suspicious or unauthorized activities.'
  },
  {
    id: 'customizer',
    icon: Sparkles,
    title: '2. 3D Customizer Design Guidelines',
    content: 'All custom apparel designs, custom logo vectors, and colors created or uploaded inside the EAY 3D customizer studio must not infringe on existing trademarks, copyrights, or official team logo rights. EAY Sports reserves the right to reject production on items featuring unauthorized intellectual property or offensive graphics.'
  },
  {
    id: 'production',
    icon: Award,
    title: '3. Customized Production & Fulfillments',
    content: 'Because custom team jerseys, hoodies, and jackets are manufactured bespoke based on your dimensional orders, production commences immediately upon receipt of credit authorization. Orders cannot be cancelled, returned, or altered after production authorization has been granted.'
  },
  {
    id: 'quality',
    icon: ShieldAlert,
    title: '4. Fabric Specifications & Quality',
    content: 'While we strive to match 3D customizer visual models as accurately as possible, slight color variations may occur between physical dry-fit sublimation fabrics and digital models. If products carry clear sewing defects, spelling errors, or fabric damage, replacements are processed instantly upon verification.'
  },
  {
    id: 'governance',
    icon: ShieldCheck,
    title: '5. Governance & Jurisdiction',
    content: 'These terms are governed and construed in accordance with the laws of the State. EAY Sports reserves the right to modify these terms at any time. Partner updates are posted promptly. Continued use of the platform after updates constitutes acceptance of the new terms.'
  }
]

export const TermsOfService = () => {
  const [activeSection, setActiveSection] = useState('acceptance')

  // Scroll spy to highlight active section in sidebar
  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY + 200

      for (const section of terms) {
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
            <FileText size={14} className="text-yellow-300 animate-pulse" />
            <span className="text-xs text-indigo-100 uppercase tracking-widest font-semibold">Legal & Policies</span>
          </motion.div>
          <motion.h1 {...fadeUp(0.1)} className="text-[36px] md:text-[54px] text-white leading-tight font-extrabold mb-4 tracking-tight">
            TERMS OF SERVICE
          </motion.h1>
          <p className="text-indigo-200 text-sm max-w-lg mx-auto">
            Please read these terms carefully before customising apparel or initiating bulk order requests.
          </p>
          <div className="flex items-center justify-center gap-2 text-indigo-300 text-xs font-semibold uppercase tracking-wider mt-6 bg-white/5 py-2 px-4 rounded-full w-fit mx-auto border border-white/5">
            <Calendar size={12} className="text-yellow-300" />
            <span>Effective Date: May 2026</span>
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
                <BookOpen size={14} className="text-indigo-600" /> Document Sections
              </h3>
              <nav className="space-y-1">
                {terms.map((item) => {
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
                <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wide mb-2">Need Legal Assistance?</h4>
                <p className="text-xs text-slate-400 leading-relaxed mb-4">
                  For wholesale terms, contract revisions, or customized order agreements:
                </p>
                <a 
                  href="mailto:legal@eaysports.com" 
                  className="w-full flex items-center justify-center gap-2 bg-slate-900 text-white hover:bg-slate-800 py-2.5 px-4 rounded-xl text-xs font-semibold shadow-sm transition-all"
                >
                  <Mail size={13} /> Email Legal Team
                </a>
              </div>
            </div>
          </div>

          {/* Right Column: Main Document Content */}
          <div className="lg:col-span-8 bg-white border border-slate-200/60 shadow-lg shadow-slate-100 rounded-3xl p-6 md:p-12 space-y-12">
            {terms.map((term, i) => {
              const Icon = term.icon
              const isActive = activeSection === term.id
              return (
                <motion.div 
                  key={term.id} 
                  id={term.id}
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
                        {term.title}
                      </h2>
                      <p className="text-xs md:text-sm text-slate-500 leading-relaxed font-normal">
                        {term.content}
                      </p>
                    </div>
                  </div>
                </motion.div>
              )
            })}

            {/* Quick Mobile Action for Legal Support */}
            <div className="lg:hidden mt-8 pt-8 border-t border-slate-100 flex flex-col items-center text-center">
              <h4 className="text-sm font-bold text-slate-800 uppercase tracking-wide mb-1">Need Legal Assistance?</h4>
              <p className="text-xs text-slate-400 max-w-xs mb-4">
                For wholesale terms, contract revisions, or customized order agreements.
              </p>
              <a 
                href="mailto:legal@eaysports.com" 
                className="inline-flex items-center gap-2 bg-slate-900 text-white hover:bg-slate-800 py-3 px-6 rounded-xl text-xs font-semibold shadow-sm transition-all"
              >
                <Mail size={14} /> Email Legal Team
              </a>
            </div>

          </div>

        </div>
      </section>

    </div>
  )
}

export const LegalConditions = TermsOfService // For safety references
export default TermsOfService
