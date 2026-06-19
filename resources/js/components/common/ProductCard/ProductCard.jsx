import { useState, memo } from 'react'
import { motion } from 'framer-motion'
import { Star, Heart, ShoppingCart } from 'lucide-react'
import { GRADIENTS, COLORS } from '../../../config/theme'
import { router } from '@inertiajs/react'
import { useDispatch, useSelector } from 'react-redux'
import { toggleWishlist } from '../../../store/wishlistSlice'
import toast from 'react-hot-toast'

export const StarRow = memo(({ rating, reviews }) => (
  <div className="flex items-center gap-1.5">
    <div className="flex">
      {[1, 2, 3, 4, 5].map(s => (
        <Star key={s} size={13}
          className={s <= Math.round(rating) ? 'text-amber-400 fill-amber-400' : 'text-gray-200 fill-gray-200'}
        />
      ))}
    </div>
    <span className="text-xs text-slate-400">({reviews})</span>
  </div>
))

export const ProductCard = memo(({ product, index = 0, view = 'grid', onNavigate }) => {
  const isList = view === 'list'
  const dispatch = useDispatch()
  const wishlistItems = useSelector((state) => state.wishlist.items)
  const isWished = wishlistItems.some(item => (Number(item.id) || item.id) === (Number(product.id) || product.id))

  const handleToggleWishlist = (e) => {
    e.stopPropagation()
    dispatch(toggleWishlist(product))
    if (isWished) {
      toast.success('Removed from wishlist', { icon: '💔' })
    } else {
      toast.success(`${product.name} saved to wishlist!`, { icon: '❤️' })
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      onClick={() => onNavigate ? onNavigate(`product-details/${product.id}`) : router.visit(`/product-details/${product.id}`)}
      className={`group bg-white rounded-2xl overflow-hidden border border-gray-100 hover:shadow-xl hover:shadow-slate-200/50 transition-all duration-300 cursor-pointer flex ${isList ? 'flex-row h-[220px]' : 'flex-col h-full'}`}
    >
      <div className={`relative overflow-hidden bg-gray-50 flex-shrink-0 ${isList ? 'h-full w-48 border-r border-gray-100' : 'h-36 sm:h-52 w-full'}`}>
        <img src={product.image} alt={product.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5">
          {/* {product.badge && (
            <span className={`px-2.5 py-1 rounded-md text-[10px] font-black text-white shadow-lg ${
              product.badge === 'Best Seller' ? 'bg-amber-500' :
              product.badge === 'Premium'     ? 'bg-[#7C3AED]' :
              'bg-emerald-500'
            }`}>{product.badge}</span>
          )}
          {product.customizable && (
            <span className="px-2.5 py-1 rounded-md text-[10px] font-black text-white bg-[#4F46E5] shadow-lg">Customizable</span>
          )} */}
        </div>
        {/* Wishlist */}
        <button
          onClick={handleToggleWishlist}
          className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center shadow hover:scale-110 transition-transform"
        >
          <Heart size={15} className={isWished ? 'fill-red-500 text-red-500' : 'text-gray-400 hover:text-red-500'} />
        </button>
      </div>

      <div className={`p-3 sm:p-4 flex-1 flex flex-col ${isList ? 'justify-center sm:p-6' : ''}`}>
        <p className="text-slate-600 text-[11px] sm:text-sm leading-tight mb-1">{product.name}</p>
        <StarRow rating={product.rating} reviews={product.reviews} />
        <div className="flex gap-1.5 mt-1.5 sm:mt-2.5">
          {(product.colors || []).map(c => {
            const colorVal = typeof c === 'object' && c !== null ? (c.hex || c.name) : c;
            return (
              <span key={colorVal} className="w-3 h-3 sm:w-4 sm:h-4 rounded-full border-2 border-white shadow-sm ring-1 ring-gray-200" style={{ background: colorVal }} />
            );
          })}
        </div>
        <div className="flex items-center justify-between mt-auto pt-2 sm:pt-4">
          <span className="text-base sm:text-xl text-[#4F46E5] font-semibold">${product.price}</span>
          <button className={`w-7 h-7 sm:w-9 sm:h-9 rounded-lg ${GRADIENTS.button} text-white flex items-center justify-center shadow-lg shadow-indigo-200 hover:scale-110 transition-transform`}>
            <ShoppingCart size={14} className="sm:w-4 sm:h-4" />
          </button>
        </div>
      </div>
    </motion.div>
  )
})
