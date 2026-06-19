import { useState, useMemo, useEffect, useCallback, memo } from 'react'
import { router, usePage } from '@inertiajs/react'
import { motion, AnimatePresence } from 'framer-motion'
import { Pagination } from '../components/common/Pagination/Pagination'
import { ProductCard } from '../components/common/ProductCard/ProductCard'
import {
  Star, Heart, ShoppingCart, SlidersHorizontal,
  ChevronDown, Sparkles, Search, Grid3x3, List
} from 'lucide-react'
import { SPACING } from '../config/theme'

const SORT_OPTIONS = ['Featured', 'Price: Low to High', 'Price: High to Low', 'Top Rated', 'Most Reviews']


const Section = memo(({ id, title, isOpen, toggle, children }) => (
  <div className="border-b border-slate-100 pb-5 mb-5 last:border-0 last:mb-0">
    <button onClick={() => toggle(id)} className="flex items-center justify-between w-full mb-4 group">
      <span className="text-[12px] uppercase tracking-[0.15em] text-slate-500 group-hover:text-[#4F46E5] transition-colors">{title}</span>
      <ChevronDown size={14} className={`text-slate-400 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
    </button>
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: 'auto', opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="overflow-hidden"
        >
          {children}
        </motion.div>
      )}
    </AnimatePresence>
  </div>
))

const FilterSidebar = memo(({
  isMobile, onClose,
  priceRange, setPriceRange, minRating, setMinRating, 
  onlyCustomizable, setOnlyCustomizable,
  selectedColor, setSelectedColor, selectedSize, setSelectedSize
}) => {
  const [openSections, setOpenSections] = useState(['price','rating','colors','size','options'])
  const toggle = useCallback((s) => setOpenSections(prev => prev.includes(s) ? prev.filter(x => x !== s) : [...prev, s]), [])

  const AVAILABLE_COLORS = ['#1D4ED8', '#DC2626', '#16A34A', '#FFFFFF', '#1e293b', '#374151', '#4F46E5']
  const AVAILABLE_SIZES  = ['XS','S','M','L','XL','XXL', 'One Size']

  return (
    <aside className={`${isMobile ? 'fixed inset-0 z-[60] bg-black/50 backdrop-blur-sm' : 'w-[280px] min-w-[280px]'} transition-all duration-300`}>
      <div className={`${isMobile ? 'absolute bottom-0 left-0 w-full bg-white rounded-t-[32px] p-6 pb-20 max-h-[90vh] overflow-y-auto shadow-2xl scrollbar-hide' : 'bg-white rounded-2xl border border-slate-100 p-6 shadow-xl shadow-slate-200/20 sticky top-28'}`}>
        {/* Header */}
        <div className="flex items-center justify-between mb-6 pb-5 border-b border-slate-100">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#4F46E5]/10 flex items-center justify-center">
              <SlidersHorizontal size={14} className="text-[#4F46E5]" />
            </div>
            <span className="text-slate-600 text-base font-medium">Filters</span>
          </div>
          <div className="flex items-center gap-4">
            <button
              onClick={() => { setPriceRange(200); setMinRating(0); setOnlyCustomizable(false); setSelectedColor(null); setSelectedSize(null); }}
              className="text-xs text-slate-400 hover:text-[#4F46E5] transition-colors"
            >
              Clear
            </button>
            {isMobile && (
              <button onClick={onClose} className="p-2 -mr-2 text-slate-400 hover:text-slate-600">
                <ChevronDown size={20} className="rotate-0" />
              </button>
            )}
          </div>
        </div>

        {/* Price Range */}
        <Section id="price" title="Price" isOpen={openSections.includes('price')} toggle={toggle}>
          <div className="px-1 pt-2">
            <div className="flex justify-between items-center mb-4">
              <span className="text-xs font-semibold text-slate-400">$0</span>
              <span className="text-sm text-[#4F46E5] bg-[#4F46E5]/10 px-3 py-1 rounded-lg">${priceRange}</span>
            </div>
            <input
              type="range" min={0} max={200} value={priceRange}
              onChange={e => setPriceRange(Number(e.target.value))}
              className="w-full accent-[#4F46E5] cursor-pointer h-1.5 bg-slate-200 rounded-full appearance-none"
            />
          </div>
        </Section>

        {/* Colors */}
        <Section id="colors" title="Colors" isOpen={openSections.includes('colors')} toggle={toggle}>
          <div className="flex flex-wrap gap-2 pt-1">
            {AVAILABLE_COLORS.map(c => (
              <button
                key={c}
                onClick={() => setSelectedColor(selectedColor === c ? null : c)}
                className={`w-7 h-7 rounded-full border-2 transition-all ${selectedColor === c ? 'border-[#4F46E5] scale-110 shadow-md' : 'border-transparent hover:scale-110 shadow-sm'}`}
                style={{ backgroundColor: c === '#FFFFFF' ? '#F8fafc' : c }}
                title={c}
              >
                {c === '#FFFFFF' && <span className="w-full h-full border border-gray-200 rounded-full block" />}
              </button>
            ))}
          </div>
        </Section>

        {/* Size */}
        <Section id="size" title="Size" isOpen={openSections.includes('size')} toggle={toggle}>
          <div className="flex flex-wrap gap-2 pt-1">
            {AVAILABLE_SIZES.map(sz => (
              <button
                key={sz}
                onClick={() => setSelectedSize(selectedSize === sz ? null : sz)}
                className={`px-3 py-1.5 rounded-lg border text-xs transition-all ${
                  selectedSize === sz 
                    ? 'border-[#4F46E5] bg-[#4F46E5] text-white shadow-md' 
                    : 'border-slate-200 text-slate-500 hover:border-[#4F46E5] hover:text-[#4F46E5]'
                }`}
              >
                {sz}
              </button>
            ))}
          </div>
        </Section>

        {/* Rating */}
        <Section id="rating" title="Rating" isOpen={openSections.includes('rating')} toggle={toggle}>
          <div className="space-y-1">
            {[4, 3, 2, 0].map(r => (
              <label
                key={r}
                className={`flex items-center gap-3 cursor-pointer px-3 py-2 rounded-lg transition-all ${minRating === r ? 'bg-[#4F46E5]/5 text-[#4F46E5]' : 'hover:bg-slate-50 text-slate-500'}`}
              >
                <input type="radio" checked={minRating === r} onChange={() => setMinRating(r)} className="accent-[#4F46E5] w-3.5 h-3.5" />
                {r > 0 ? (
                  <div className="flex items-center gap-1.5">
                    <div className="flex gap-0.5">
                      {[1,2,3,4,5].map(s => (
                        <Star key={s} size={12} className={s <= r ? 'text-amber-400 fill-amber-400' : 'text-slate-200 fill-slate-200'} />
                      ))}
                    </div>
                    <span className="text-xs ml-1">& up</span>
                  </div>
                ) : (
                  <span className="text-xs">All Ratings</span>
                )}
              </label>
            ))}
          </div>
        </Section>

        {/* Options */}
        <Section id="options" title="Options" isOpen={openSections.includes('options')} toggle={toggle}>
          <label className="flex items-center justify-between cursor-pointer px-1 py-1 group">
            <span className="text-sm text-slate-500 group-hover:text-[#4F46E5] transition-colors">Customizable Only</span>
            <button
              onClick={() => setOnlyCustomizable(!onlyCustomizable)}
              className={`relative w-10 h-5 rounded-full transition-all duration-300 ${onlyCustomizable ? 'bg-[#4F46E5]' : 'bg-slate-200'}`}
            >
              <span className={`absolute top-0.5 w-4 h-4 rounded-full bg-white shadow-sm transition-all duration-300 ${onlyCustomizable ? 'left-5' : 'left-1'}`} />
            </button>
          </label>
        </Section>
      </div>
    </aside>
  )
})


/* ─── MAIN EXPORT (page content only) ────── */
export const Products = ({ onNavigate }) => {
  const { products = [], filters = {}, categories = [], pagination = {} } = usePage().props
  const searchParams = new URLSearchParams(window.location.search)
  const categoryParam = searchParams.get('category')
  const subcategoryParam = searchParams.get('subcategory')

  const [activeCategory, setActiveCategory] = useState('all')

  // Sync category param with activeCategory state
  useEffect(() => {
    if (categoryParam) {
      const matched = categories.find(c => c.slug.toLowerCase() === categoryParam.toLowerCase())
      if (matched) {
        setActiveCategory(matched.slug)
      } else {
        setActiveCategory('all')
      }
    } else {
      setActiveCategory('all')
    }
  }, [categoryParam, categories])

  const [isSearching, setIsSearching] = useState(false)

  const handleCategoryClick = useCallback((catSlug) => {
    setIsSearching(true)
    const params = new URLSearchParams(window.location.search)
    if (catSlug === 'all') {
      params.delete('category')
      params.delete('subcategory')
    } else {
      params.set('category', catSlug)
      params.delete('subcategory') // clear subcategory when category changes
    }
    router.visit(`/products?${params.toString()}`, { 
      preserveState: true, 
      preserveScroll: true, 
      replace: true,
      onFinish: () => setIsSearching(false)
    })
  }, [])

  // Initialize filters from server props for perfect state preservation
  const [searchQuery, setSearchQuery]       = useState(filters.search || '')
  const [priceRange, setPriceRange]         = useState(Number(filters.price_max) || 200)
  const [minRating, setMinRating]           = useState(0)
  const [onlyCustomizable, setOnlyCustomizable] = useState(false)
  const [sortBy, setSortBy]                 = useState(
    filters.sort === 'low_high' ? 'Price: Low to High' :
    filters.sort === 'high_low' ? 'Price: High to Low' : 'Featured'
  )
  const [view, setView]                     = useState('grid')
  const [selectedColor, setSelectedColor]   = useState(null)
  const [selectedSize, setSelectedSize]     = useState(null)
  const [isFilterOpen, setIsFilterOpen]     = useState(false)

  // Server-side pagination state — page comes from the server via Inertia
  const currentPage  = pagination.current_page || 1
  const totalPages   = pagination.last_page    || 1
  const totalItems   = pagination.total        || products.length

  // Sync state when filters change externally (e.g. from search overlay or direct navigations)
  useEffect(() => {
    if (filters.search !== undefined) {
      setSearchQuery(filters.search || '')
    }
  }, [filters.search])

  useEffect(() => {
    if (filters.price_max !== undefined) {
      setPriceRange(Number(filters.price_max) || 200)
    }
  }, [filters.price_max])

  useEffect(() => {
    if (filters.sort !== undefined) {
      setSortBy(
        filters.sort === 'low_high' ? 'Price: Low to High' :
        filters.sort === 'high_low' ? 'Price: High to Low' : 'Featured'
      )
    }
  }, [filters.sort])

  // Reactively sync primary search, price limits, and sorting with server-side SQL queries
  useEffect(() => {
    const isSearchDiff = searchQuery !== (filters.search || '')
    const isPriceDiff  = priceRange !== (Number(filters.price_max) || 200)
    const isSortDiff   = sortBy !== (filters.sort === 'low_high' ? 'Price: Low to High' : filters.sort === 'high_low' ? 'Price: High to Low' : 'Featured')

    if (isSearchDiff || isPriceDiff || isSortDiff) {
      setIsSearching(true)
    }

    const delayDebounceFn = setTimeout(() => {
      const params = new URLSearchParams(window.location.search)
      
      if (searchQuery.trim()) {
        params.set('search', searchQuery)
      } else {
        params.delete('search')
      }
      
      if (priceRange < 200) {
        params.set('price_max', priceRange)
      } else {
        params.delete('price_max')
      }
      
      let sortVal = 'featured'
      if (sortBy === 'Price: Low to High') sortVal = 'low_high'
      if (sortBy === 'Price: High to Low') sortVal = 'high_low'
      params.set('sort', sortVal)
      
      router.visit(`/products?${params.toString()}`, {
        preserveState: true,
        preserveScroll: true,
        replace: true,
        only: ['products', 'filters', 'pagination'], // optimized partial reload
        onFinish: () => setIsSearching(false)
      })
    }, 400) // 400ms debounce
    
    return () => clearTimeout(delayDebounceFn)
  }, [searchQuery, priceRange, sortBy])

  // Apply local micro-filters (rating, customizable, color, size) on the already-paginated server results
  const filtered = useMemo(() => {
    let list = products
    if (minRating > 0)    list = list.filter(p => p.rating >= minRating)
    if (onlyCustomizable) list = list.filter(p => p.customizable)
    if (selectedColor)    list = list.filter(p => p.colors && p.colors.includes(selectedColor))
    if (selectedSize)     list = list.filter(p => p.sizes && p.sizes.includes(selectedSize))
    return list
  }, [products, minRating, onlyCustomizable, selectedColor, selectedSize])

  // Navigate to a specific page — server fetches the correct slice
  const handlePageChange = useCallback((page) => {
    const params = new URLSearchParams(window.location.search)
    params.set('page', page)
    router.visit(`/products?${params.toString()}`, {
      preserveState: true,
      preserveScroll: false,
      replace: true,
      only: ['products', 'filters', 'pagination'],
    })
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }, [])

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="pt-28 pb-20 min-h-screen bg-[#F8F9FF]"
    >
      {/* Page Hero */}
      <div className={`${SPACING.container} mb-10`}>
        <div className="flex flex-col items-center text-center mb-10">
          <span className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-white border border-indigo-100 shadow-sm text-sm text-indigo-500 mb-5">
            <Sparkles size={15} className="text-yellow-500" />
            {filtered.length} Premium Products
          </span>
          <h1 className="text-3xl md:text-6xl text-slate-600 mb-2">Our Collection</h1>
          <p className="text-sm md:text-xl text-slate-500">Discover premium custom sportswear</p>
        </div>

        {/* Search + Sort */}
        <div className="flex flex-col sm:flex-row items-center gap-4 mb-6">
          <div className="flex-1 w-full flex items-center gap-3 bg-white border border-gray-200 rounded-lg px-5 py-3.5 focus-within:border-[#4F46E5] transition-colors shadow-sm">
            <Search size={18} className="text-[#4F46E5] flex-shrink-0" />
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Search products..."
              className="flex-1 bg-transparent text-slate-600 text-sm placeholder:text-slate-400 focus:outline-none"
            />
          </div>
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <button 
              onClick={() => setIsFilterOpen(true)}
              className="lg:hidden flex items-center gap-2 bg-white border border-gray-200 rounded-lg px-4 py-3.5 text-sm text-slate-600 shadow-sm"
            >
              <SlidersHorizontal size={16} />
              <span>Filters</span>
            </button>
            <select
              value={sortBy}
              onChange={e => setSortBy(e.target.value)}
              className="flex-1 sm:flex-none bg-white border border-gray-200 rounded-lg px-4 py-3.5 text-sm text-slate-600 focus:outline-none focus:border-[#4F46E5] shadow-sm cursor-pointer"
            >
              {SORT_OPTIONS.map(o => <option key={o}>{o}</option>)}
            </select>
            <div className="hidden sm:flex items-center gap-1 bg-white border border-gray-200 rounded-lg p-1 shadow-sm">
              <button onClick={() => setView('grid')} className={`p-2.5 rounded-xl transition-all ${view==='grid' ? 'bg-[#4F46E5] text-white shadow' : 'text-gray-400 hover:text-gray-600'}`}><Grid3x3 size={16}/></button>
              <button onClick={() => setView('list')} className={`p-2.5 rounded-xl transition-all ${view==='list' ? 'bg-[#4F46E5] text-white shadow' : 'text-gray-400 hover:text-gray-600'}`}><List size={16}/></button>
            </div>
          </div>
        </div>

        {/* Category Chips */}
        <div className="flex flex-wrap gap-2 mb-8">
          {categories.map(cat => (
            <button
              key={cat.slug}
              onClick={() => handleCategoryClick(cat.slug)}
              className={`px-5 py-2.5 rounded-full text-sm transition-all ${
                activeCategory === cat.slug
                  ? 'bg-gradient-to-r from-[#4F46E5] to-[#7C3AED] text-white shadow-lg shadow-indigo-200'
                  : 'bg-white border border-gray-200 text-slate-600 hover:border-indigo-200 hover:text-[#4F46E5]'
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>

        {/* Desktop Sidebar */}
        <div className="flex gap-8 items-start">
          <div className="hidden lg:block">
            <FilterSidebar
              priceRange={priceRange} setPriceRange={setPriceRange}
              minRating={minRating}   setMinRating={setMinRating}
              onlyCustomizable={onlyCustomizable} setOnlyCustomizable={setOnlyCustomizable}
              selectedColor={selectedColor} setSelectedColor={setSelectedColor}
              selectedSize={selectedSize} setSelectedSize={setSelectedSize}
            />
          </div>

          {/* Mobile Sidebar (Drawer) */}
          <AnimatePresence>
            {isFilterOpen && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="lg:hidden"
              >
                <FilterSidebar
                  isMobile
                  onClose={() => setIsFilterOpen(false)}
                  priceRange={priceRange} setPriceRange={setPriceRange}
                  minRating={minRating}   setMinRating={setMinRating}
                  onlyCustomizable={onlyCustomizable} setOnlyCustomizable={setOnlyCustomizable}
                  selectedColor={selectedColor} setSelectedColor={setSelectedColor}
                  selectedSize={selectedSize} setSelectedSize={setSelectedSize}
                />
              </motion.div>
            )}
          </AnimatePresence>

          <div className="flex-1 relative min-h-[400px]">
            <AnimatePresence>
              {isSearching && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="absolute inset-0 bg-[#F8F9FF]/60 backdrop-blur-[1px] z-10 flex items-start justify-center pt-24 rounded-2xl"
                >
                  <div className="flex flex-col items-center gap-4 bg-white/95 border border-indigo-50/50 p-8 rounded-2xl shadow-xl shadow-slate-200/50 sticky top-48">
                    <div className="w-12 h-12 rounded-full border-[3.5px] border-indigo-100 border-t-[#4F46E5] animate-spin" />
                    <span className="text-sm font-semibold text-slate-500 tracking-wide">Updating Catalog...</span>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {filtered.length === 0 ? (
              <div className="text-center py-24 bg-white rounded-xl border border-gray-100">
                <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Search size={32} className="text-gray-300" />
                </div>
                <p className="text-slate-500 text-lg">No products found</p>
                <p className="text-slate-400 text-sm mt-1">Try adjusting your filters</p>
              </div>
            ) : (
              <>
                <div className={view === 'grid'
                  ? 'grid grid-cols-2 lg:grid-cols-3 gap-4 md:gap-5'
                  : 'flex flex-col gap-4'
                }>
                  {filtered.map((product, i) => (
                    <ProductCard key={product.id} product={product} index={i} view={view} onNavigate={onNavigate} />
                  ))}
                </div>
                
                <Pagination 
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={handlePageChange}
                />
              </>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  )
}
