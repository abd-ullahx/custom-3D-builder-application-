import { Palette, Shield, Truck, Users2, BadgeCheck, Zap } from 'lucide-react'
import { motion } from 'framer-motion'
import { COLORS, SPACING, FONT } from '../../config/theme'

const features = [
  {
    icon: <Palette size={24} />,
    title: 'Custom Design',
    desc: 'Create unique sportswear with our intuitive design tool',
    color: 'bg-blue-500'
  },
  {
    icon: <Shield size={24} />,
    title: 'Premium Quality',
    desc: 'Top-tier materials ensuring durability and comfort',
    color: 'bg-pink-500'
  },
  {
    icon: <Truck size={24} />,
    title: 'Fast Delivery',
    desc: 'Express shipping to your doorstep worldwide',
    color: 'bg-emerald-500'
  },
  {
    icon: <Users2 size={24} />,
    title: 'Team Solutions',
    desc: 'Bulk orders with special pricing for teams',
    color: 'bg-orange-500'
  },
  {
    icon: <BadgeCheck size={24} />,
    title: 'Trusted Brand',
    desc: 'Chosen by professional athletes globally',
    color: 'bg-indigo-500'
  },
  {
    icon: <Zap size={24} />,
    title: 'Quick Process',
    desc: 'From design to delivery in record time',
    color: 'bg-amber-500'
  }
]

export const Features = () => {
  return (
    <section className={`${SPACING.sectionLg} bg-gray-50/50`}>
      <div className={`${SPACING.container} text-center`}>
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-5xl  text-slate-800 mb-4"
        >
          Why Choose Us
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
          className="text-lg md:text-xl text-slate-500 mb-16"
        >
          Everything you need for perfect custom sportswear
        </motion.p>

        <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="p-5 sm:p-10 rounded-xl bg-white border border-gray-100 text-left hover:shadow-2xl transition-all hover:-translate-y-2 group"
            >
              <div className={`w-10 h-10 sm:w-14 sm:h-14 ${feature.color} text-white rounded-lg flex items-center justify-center mb-4 sm:mb-8 shadow-lg shadow-gray-200 group-hover:rotate-12 transition-transform`}>
                {feature.icon}
              </div>
              <h3 className="text-lg sm:text-2xl text-slate-900 mb-2 sm:mb-4">{feature.title}</h3>
              <p className="text-[11px] sm:text-base text-slate-500 leading-relaxed font-medium">{feature.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
