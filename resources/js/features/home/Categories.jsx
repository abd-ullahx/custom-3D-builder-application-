import { useState } from 'react'
import { motion } from 'framer-motion'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { COLORS, SPACING } from '../../config/theme'
import { router } from '@inertiajs/react'

export const Categories = ({ homeCategories }) => {
  // Use dynamic categories from database, fallback to hardcoded list
  const activeCategories = homeCategories && homeCategories.length > 0
    ? homeCategories
    : [
      {
        name: 'Jerseys',
        count: '50+ Designs',
        gradient: 'from-[#0EA5E9]/70 via-[#0284C7]/60 to-[#1D4ED8]/80',
        image: 'https://images.unsplash.com/photo-1551280857-2b9bbe52acf4?w=600&h=700&fit=crop&q=80',
      },
      {
        name: 'T-Shirts',
        count: '40+ Styles',
        gradient: 'from-[#EC4899]/70 via-[#C026D3]/60 to-[#9333EA]/80',
        image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=600&h=700&fit=crop&q=80',
      },
      {
        name: 'Hoodies',
        count: '30+ Options',
        gradient: 'from-[#10B981]/70 via-[#059669]/60 to-[#047857]/80',
        image: 'https://images.unsplash.com/photo-1556821840-3a63f15732ce?w=600&h=700&fit=crop&q=80',
      },
      {
        name: 'Shorts',
        count: '25+ Variants',
        gradient: 'from-[#FB923C]/70 via-[#F97316]/60 to-[#DC2626]/80',
        image: 'https://images.unsplash.com/photo-1591195853828-11db59a44f43?w=600&h=700&fit=crop&q=80',
      },
    ]

  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 8

  const totalPages = Math.ceil(activeCategories.length / itemsPerPage)
  const indexOfLastItem = currentPage * itemsPerPage
  const indexOfFirstItem = indexOfLastItem - itemsPerPage
  const currentItems = activeCategories.slice(indexOfFirstItem, indexOfLastItem)

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber)
    const section = document.getElementById('categories-section')
    if (section) {
      section.scrollIntoView({ behavior: 'smooth' })
    }
  }

  return (
    <section id="categories-section" className="py-24 bg-[#F8F9FF] scroll-mt-20">
      <div className={`${SPACING.container} text-center`}>
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-5xl text-slate-800 mb-4"
        >
          Shop by Category
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
          className="text-lg md:text-xl text-slate-500 mb-16"
        >
          Find your perfect sportswear style
        </motion.p>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {currentItems.map((cat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.05, duration: 0.5 }}
              whileHover={{ y: -6 }}
              onClick={() => {
                const slug = cat.slug || cat.name.toLowerCase().replace(/\s+/g, '-')
                router.visit(`/products?category=${slug}`)
              }}
              className="relative h-[220px] sm:h-[380px] rounded-xl overflow-hidden cursor-pointer group shadow-xl shadow-gray-200/60"
            >
              {/* Real Background Image */}
              <img
                src={cat.image}
                alt={cat.name}
                className="absolute inset-0 w-full h-full object-cover object-center transition-transform duration-700 group-hover:scale-110"
              />

              {/* Colored Gradient Overlay - exactly like Figma */}
              <div
                className={`absolute inset-0 bg-gradient-to-b ${cat.gradient} transition-opacity duration-300 group-hover:opacity-90`}
              />

              {/* Content */}
              <div className="absolute inset-0 flex flex-col items-center justify-center text-white p-6">
                <h3 className="text-2xl sm:text-4xl mb-2 sm:mb-4 tracking-tight drop-shadow-lg group-hover:scale-105 transition-transform duration-300">
                  {cat.name}
                </h3>
                <div className="bg-white/25 backdrop-blur-md px-4 py-1.5 sm:px-6 sm:py-2 rounded-full text-[10px] sm:text-sm border border-white/30">
                  {cat.count}
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Premium Styled Pagination Controls */}
        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-2 mt-16">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className={`p-2.5 rounded-full border border-slate-200 transition-all flex items-center justify-center ${currentPage === 1
                  ? 'opacity-40 cursor-not-allowed bg-slate-50 text-slate-400'
                  : 'bg-white text-slate-600 hover:bg-slate-50 active:scale-95 shadow-sm'
                }`}
            >
              <ChevronLeft size={18} />
            </button>

            {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
              <button
                key={pageNum}
                onClick={() => handlePageChange(pageNum)}
                className={`w-10 h-10 rounded-full font-medium transition-all flex items-center justify-center text-sm ${currentPage === pageNum
                    ? 'bg-[#4F46E5] text-white shadow-md shadow-indigo-100'
                    : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50 active:scale-95 shadow-sm'
                  }`}
              >
                {pageNum}
              </button>
            ))}

            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className={`p-2.5 rounded-full border border-slate-200 transition-all flex items-center justify-center ${currentPage === totalPages
                  ? 'opacity-40 cursor-not-allowed bg-slate-50 text-slate-400'
                  : 'bg-white text-slate-600 hover:bg-slate-50 active:scale-95 shadow-sm'
                }`}
            >
              <ChevronRight size={18} />
            </button>
          </div>
        )}
      </div>
    </section>
  )
}

