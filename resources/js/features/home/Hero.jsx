import { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Sparkles, ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react'
import { useHero } from './useHero'
import { usePage } from '@inertiajs/react'
import { GRADIENTS, BTN, COLORS } from '../../config/theme'

export const Hero = () => {
  const { handleStartDesigning, handleBrowseCollection } = useHero()
  const { banners } = usePage().props
  const [currentSlide, setCurrentSlide] = useState(0)

  // Use dynamic banners from database, fallback to empty array
  const IMAGES = banners && banners.length > 0
    ? banners.map(banner => `/images/${banner.image}`)
    : [
      '/images/hero/HXE-Web-Banner-Explore.jpg_v=1.png',
      '/images/hero/S25-BaseballEquipment.jpg_v=1.png',
      '/images/hero/S25-BasketballEquipment.jpg_v=1.png',
      '/images/hero/S25-CustomBaseballApparel.jpg_v=1.png'
    ]

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % IMAGES.length)
    }, 5000)
    return () => clearInterval(timer)
  }, [IMAGES.length])

  const nextSlide = useCallback(() => setCurrentSlide((prev) => (prev + 1) % IMAGES.length), [IMAGES.length])
  const prevSlide = useCallback(() => setCurrentSlide((prev) => (prev - 1 + IMAGES.length) % IMAGES.length), [IMAGES.length])

  return (
    <section className="relative w-full mt-20 bg-[#f4f4f4] overflow-hidden">
      {/* Invisible placeholder sets the exact aspect ratio of the banner images */}
      <img
        src={IMAGES[0]}
        alt="placeholder"
        className="w-full h-auto invisible pointer-events-none"
        fetchPriority="high"
        loading="eager"
      />

      {/* Slider */}
      <div className="absolute inset-0 z-0">
        <AnimatePresence mode='wait'>
          <motion.div
            key={currentSlide}
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -40 }}
            transition={{ duration: 0.7, ease: "easeInOut" }}
            className="absolute inset-0"
          >
            <img
              src={IMAGES[currentSlide]}
              alt="Hero Sports Banner"
              className="w-full h-full object-contain"
              width="1920"
              height="800"
              fetchPriority={currentSlide === 0 ? "high" : "low"}
              loading={currentSlide === 0 ? "eager" : "lazy"}
            />
          </motion.div>
        </AnimatePresence>
        {/* Subtle bottom fade for controls */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent pointer-events-none" />
      </div>

      {/* Text Content — bottom-left, compact glass card */}
      <div className="absolute bottom-14 sm:bottom-16 left-3 sm:left-[5%] lg:left-[8%] xl:left-[12%] z-10 max-w-[92%] sm:max-w-lg">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className=""
        >
          {/* Badge */}
          {/* <div className="flex items-center gap-2 mb-3">
            <Sparkles size={14} className="text-yellow-400 animate-pulse" />
            <span className="text-[10px]  text-yellow-300 uppercase tracking-widest">
              AI-Powered Design Assistant
            </span>
          </div> */}

          {/* Title — smaller */}
          {/* <h1 className="text-[20px] sm:text-[36px] md:text-[42px] lg:text-[48px] font-[600] leading-[1.15] tracking-[-0.03em] mb-1 sm:mb-2 text-white">
            Create Your{' '}
            <span className={GRADIENTS.heroText}>
              Perfect Jersey
            </span>
          </h1> */}

          {/* Subtitle — hidden on mobile to save space */}
          {/* <p className="hidden sm:block text-[14px] text-white/75 leading-relaxed mb-5">
            Premium sportswear designed by you — fast delivery &amp; top quality.
          </p> */}

          {/* Buttons */}
          <div className="flex items-center gap-2 sm:gap-3">
            <button
              onClick={handleStartDesigning}
              className={`group flex items-center gap-1.5 ${BTN.primary} !text-[11px] sm:!text-sm !py-2 sm:!py-2.5 !px-3.5 sm:!px-5 rounded-lg sm:rounded-full whitespace-nowrap`}
            >
              Start Designing
              <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
            </button>
            <button
              onClick={handleBrowseCollection}
              className={`${BTN.ghost} !text-[11px] sm:!text-sm !py-2 sm:!py-2.5 !px-3.5 sm:!px-5 rounded-lg sm:rounded-full whitespace-nowrap`}
            >
              Browse Collection
            </button>
          </div>
        </motion.div>
      </div>

      {/* Slide Indicators — bottom-center */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-10 flex items-center gap-2">
        {IMAGES.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentSlide(index)}
            aria-label={`Go to slide ${index + 1}`}
            className={`h-1.5 transition-all duration-400 rounded-full ${currentSlide === index ? 'w-8 bg-white' : 'w-2 bg-white/40'
              }`}
          />
        ))}
      </div>

      {/* Prev / Next Arrows */}
      <button
        onClick={prevSlide}
        aria-label="Previous Slide"
        className="absolute left-4 top-1/2 -translate-y-1/2 z-20 p-3 rounded-full bg-black/20 hover:bg-black/40 border border-white/10 text-white transition-all hidden md:flex"
      >
        <ChevronLeft size={22} />
      </button>
      <button
        onClick={nextSlide}
        aria-label="Next Slide"
        className="absolute right-4 top-1/2 -translate-y-1/2 z-20 p-3 rounded-full bg-black/20 hover:bg-black/40 border border-white/10 text-white transition-all hidden md:flex"
      >
        <ChevronRight size={22} />
      </button>

    </section>
  )
}
