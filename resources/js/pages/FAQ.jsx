import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { HelpCircle, ChevronDown, ShoppingBag, Truck, CreditCard, RotateCcw } from 'lucide-react'
import { SPACING } from '../config/theme'

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 30 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.6, delay },
})

const categories = [
  { id: 'general', name: 'General', icon: HelpCircle },
  { id: 'orders', name: 'Orders & Bulk', icon: ShoppingBag },
  { id: 'shipping', name: 'Shipping', icon: Truck },
  { id: 'payment', name: 'Payments', icon: CreditCard },
  { id: 'returns', name: 'Returns', icon: RotateCcw },
]

const faqs = [
  {
    category: 'general',
    q: 'What makes EAY Sports jerseys unique?',
    a: 'Every EAY Sports jersey is constructed from specialized dry-fit polyester featuring moisture-wicking and antimicrobial characteristics. We utilize premium sublimation printing which ensures your customized team graphics never crack, fade, or peel.'
  },
  {
    category: 'general',
    q: 'Can I design a custom design offline?',
    a: 'Our online 3D customizer studio offers complete power. However, if you require specialized vectors or complex custom layout illustrations, our corporate design team is happy to assist. Please drop us a message via the Contact page.'
  },
  {
    category: 'orders',
    q: 'Is there a minimum order quantity (MOQ) for wholesale partners?',
    a: 'Wholesale partners can place orders with a highly flexible MOQ. Bulk order quantity starting discounts apply to orders of 15 units or more. You can customize different designs for different batch sizes seamlessly.'
  },
  {
    category: 'orders',
    q: 'How long does production take?',
    a: 'Once your 3D design is finalized and the order is approved, custom apparel manufacturing typically takes 7-10 business days. Large-scale bulk orders (100+ units) may require 12-15 days depending on season peak volume.'
  },
  {
    category: 'shipping',
    q: 'Do you offer worldwide delivery?',
    a: 'Yes, EAY Sports delivers custom sportswear worldwide. Standard carrier partners ensure delivery within 3-5 shipping days across North America, Europe, and Asia.'
  },
  {
    category: 'payment',
    q: 'What payment terms are offered to wholesale dealers?',
    a: 'We support safe credit cards, bank wire transfers, and localized payment channels. Direct B2B wholesale dealers can get net-term credit approvals upon verification by our financial relations team.'
  },
  {
    category: 'returns',
    q: 'What is EAY Sports return policy for customized items?',
    a: 'Because each jersey and customized apparel is manufactured bespoke for your team, custom orders are final. However, in the rare event of spelling errors, size mismatches, or fabric damage due to manufacturing, we will replace the item instantly free of charge.'
  }
]

export const FAQ = () => {
  const [activeCat, setActiveCat] = useState('general')
  const [openIndex, setOpenIndex] = useState(null)

  const toggleFaq = (index) => {
    setOpenIndex(openIndex === index ? null : index)
  }

  const filteredFaqs = faqs.filter(faq => faq.category === activeCat)

  return (
    <div className="pt-20 bg-slate-50 min-h-screen font-sans">
      
      {/* Banner */}
      <section className="relative bg-[#4F46E5] py-20 overflow-hidden text-center">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-20 w-64 h-64 rounded-full bg-white blur-3xl" />
          <div className="absolute bottom-0 right-10 w-96 h-96 rounded-full bg-purple-400 blur-3xl" />
        </div>
        <div className={`${SPACING.container} max-w-4xl relative z-10`}>
          <motion.h1 {...fadeUp()} className="text-[36px] md:text-[54px] text-white leading-tight font-extrabold mb-4 uppercase">
            Frequently Asked Questions
          </motion.h1>
          <motion.p {...fadeUp(0.1)} className="text-lg text-white/80 max-w-xl mx-auto leading-relaxed">
            Need quick answers about sizing, customization, delivery, or custom bulk orders? We've got you covered.
          </motion.p>
        </div>
      </section>

      {/* Main Area Grid */}
      <section className={`${SPACING.container} max-w-5xl py-16 px-4`}>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          
          {/* Navigation Category Tabs */}
          <div className="md:col-span-1 space-y-2">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-widest block mb-4 ps-2">Help Categories</span>
            {categories.map((cat) => {
              const Icon = cat.icon
              const isActive = activeCat === cat.id
              return (
                <button
                  key={cat.id}
                  onClick={() => { setActiveCat(cat.id); setOpenIndex(null); }}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-semibold transition-all text-left ${
                    isActive
                      ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/10'
                      : 'bg-white text-slate-600 border border-slate-200/50 hover:bg-slate-100'
                  }`}
                >
                  <Icon size={16} />
                  <span>{cat.name}</span>
                </button>
              )
            })}
          </div>

          {/* Accordion list */}
          <div className="md:col-span-3 space-y-4">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeCat}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
                className="space-y-4"
              >
                {filteredFaqs.map((faq, index) => {
                  const isOpen = openIndex === index
                  return (
                    <div
                      key={index}
                      className="bg-white border border-slate-200/60 rounded-3xl overflow-hidden hover:shadow-md transition-shadow"
                    >
                      <button
                        onClick={() => toggleFaq(index)}
                        className="w-full flex items-center justify-between p-6 text-left focus:outline-none"
                      >
                        <span className="text-slate-800 font-bold text-sm md:text-base pr-4">
                          {faq.q}
                        </span>
                        <ChevronDown
                          size={18}
                          className={`text-slate-400 transition-transform duration-300 flex-shrink-0 ${
                            isOpen ? 'rotate-180 text-indigo-600' : ''
                          }`}
                        />
                      </button>

                      <AnimatePresence initial={false}>
                        {isOpen && (
                          <motion.div
                            initial={{ height: 0 }}
                            animate={{ height: 'auto' }}
                            exit={{ height: 0 }}
                            transition={{ duration: 0.3 }}
                          >
                            <div className="px-6 pb-6 text-slate-500 text-xs md:text-sm leading-relaxed border-t border-slate-50 pt-4 bg-slate-50/50">
                              {faq.a}
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  )
                })}
              </motion.div>
            </AnimatePresence>
          </div>

        </div>
      </section>

    </div>
  )
}

export default FAQ
