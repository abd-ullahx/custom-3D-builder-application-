import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Minus, Plus, Trash2, ShoppingBag, ArrowRight } from 'lucide-react'
import { COLORS, BTN, GRADIENTS } from '../../config/theme'
import { useSelector, useDispatch } from 'react-redux'
import { removeItem, updateQty, checkoutOrder } from '../../store/cartSlice'
import { router } from '@inertiajs/react'
import toast from 'react-hot-toast'

export const Cart = ({ isOpen, onClose }) => {
  const dispatch = useDispatch()
  const items = useSelector((state) => state.cart.items) || []
  const { isAuthenticated } = useSelector((state) => state.auth)
  const { isCheckingOut } = useSelector((state) => state.cart)

  // Fetch B2B partner info if any
  const isDealer = AuthGuardIsDealer(); // We will implement or detect based on store state.
  // Actually, we can check if Auth user role/email corresponds to a dealer, or let's read storefront B2B auth indicator.
  // Let's get dealer context from Redux state or window variables if present!

  useEffect(() => {
    if (isOpen) {
      document.documentElement.classList.add('lenis-stopped')
      document.body.style.overflow = 'hidden'
    } else {
      document.documentElement.classList.remove('lenis-stopped')
      document.body.style.overflow = ''
    }
    return () => {
      document.documentElement.classList.remove('lenis-stopped')
      document.body.style.overflow = ''
    }
  }, [isOpen])

  const subtotal = items.reduce((s, i) => s + i.price * i.qty, 0)

  // Detect B2B Dealer context
  function AuthGuardIsDealer() {
    const authState = useSelector((state) => state.auth)
    // Check if user name or structure indicates a dealer/B2B context
    return authState?.user?.last_name === 'B2B Partner' || window.location.pathname.startsWith('/dealer');
  }

  const shipping = items.length > 0 ? (subtotal > 100 ? 0 : 15.0) : 0
  const tax = subtotal * 0.08
  const total = subtotal + shipping + tax

  const handleUpdateQty = (uniqueKey, currentQty, increment) => {
    const newQty = currentQty + (increment ? 1 : -1)
    if (newQty < 1) {
      dispatch(removeItem(uniqueKey))
      toast.success('Item removed from cart')
    } else {
      dispatch(updateQty({ uniqueKey, qty: newQty }))
    }
  }

  const handleRemoveItem = (uniqueKey) => {
    dispatch(removeItem(uniqueKey))
    toast.success('Item removed from cart')
  }

  const handleCheckout = () => {
    if (!isAuthenticated) {
      toast.error('Please sign in to complete checkout!', { icon: '🔐' })
      onClose()
      router.visit('/auth')
      return
    }
    onClose()
    router.visit('/checkout')
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            key="cart-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/20 backdrop-blur-sm z-[2050]"
          />

          {/* Slide-in Panel */}
          <motion.aside
            key="cart-panel"
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            className="fixed top-0 right-0 h-full w-full max-w-[480px] bg-white z-[2100] flex flex-col shadow-2xl shadow-indigo-100/50"
          >
            {/* Header */}
            {/* Header Title Switch */}
            <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100 bg-gradient-to-r from-[#4F46E5]/5 to-[#7C3AED]/5">
              <div>
                <h2 className="text-2xl text-slate-800">Shopping Cart</h2>
                <p className="text-sm text-slate-400 mt-0.5">
                  {items.length} item{items.length !== 1 ? 's' : ''} in your cart
                </p>
              </div>
              <button
                onClick={onClose}
                className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 hover:bg-red-50 hover:text-red-500 transition-all"
              >
                <X size={20} />
              </button>
            </div>



            {/* Items */}
            <div 
              className="flex-1 overflow-y-auto px-4 py-4 overscroll-contain custom-scrollbar"
              data-lenis-prevent
            >
              {items.length > 0 ? (
                <div className="space-y-2">
                  {items.map((item) => (
                    <motion.div
                      key={item.uniqueKey}
                      layout
                      className="flex items-center gap-3 bg-white rounded-xl border border-gray-100 hover:border-indigo-200 shadow-sm transition-all px-3 py-2.5"
                    >
                      {/* Product Image */}
                      <div className="flex-shrink-0 w-14 h-14 rounded-lg overflow-hidden bg-gray-100">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-full h-full object-cover"
                          onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1551280857-2b9bbe52acf4?w=150&h=150&fit=crop&q=80' }}
                        />
                      </div>

                      {/* Info — name + tags stacked */}
                      <div className="flex-1 min-w-0">
                        <p className="text-slate-800 text-[12px] font-bold leading-tight truncate">{item.name}</p>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {item.tags.map((t) => (
                            <span key={t.label} className="text-[9px] px-1.5 py-[1px] bg-indigo-50 text-indigo-500 rounded-full font-semibold border border-indigo-100 whitespace-nowrap">
                              {t.label}
                            </span>
                          ))}
                        </div>
                      </div>

                      {/* Qty + Price + Delete — right side vertical stack */}
                      <div className="flex-shrink-0 flex flex-col items-end gap-1.5">
                        <span className="text-indigo-600 font-bold text-[13px] leading-none">
                          ${(item.price * item.qty).toFixed(2)}
                        </span>
                        <div className="flex items-center gap-1 bg-gray-50 rounded-full border border-gray-200 px-1.5 py-0.5">
                          <button onClick={() => handleUpdateQty(item.uniqueKey, item.qty, false)} className="w-4 h-4 rounded-full flex items-center justify-center text-slate-500 hover:bg-indigo-100 hover:text-indigo-600 transition-colors">
                            <Minus size={9} />
                          </button>
                          <span className="w-4 text-center text-[11px] font-bold text-slate-800">{item.qty}</span>
                          <button onClick={() => handleUpdateQty(item.uniqueKey, item.qty, true)} className="w-4 h-4 rounded-full flex items-center justify-center text-slate-500 hover:bg-indigo-100 hover:text-indigo-600 transition-colors">
                            <Plus size={9} />
                          </button>
                        </div>
                        <button onClick={() => handleRemoveItem(item.uniqueKey)} className="w-5 h-5 rounded-full flex items-center justify-center text-gray-300 hover:text-red-400 transition-colors">
                          <Trash2 size={11} />
                        </button>
                      </div>
                    </motion.div>
                  ))}
                </div>
              ) : (
                <div className="h-full flex flex-col items-center justify-center text-center py-20">
                  <div className="w-20 h-20 bg-indigo-50 rounded-full flex items-center justify-center text-indigo-500 mb-6">
                    <ShoppingBag size={40} />
                  </div>
                  <h3 className="text-xl font-bold text-slate-700">Your Cart is Empty</h3>
                  <p className="text-slate-400 text-sm mt-1 max-w-[260px] mx-auto">
                    Add custom jerseys or gear from our library to get started!
                  </p>
                  <button
                    onClick={() => {
                      onClose()
                      router.visit('/products')
                    }}
                    className="mt-6 px-6 py-2.5 bg-indigo-600 text-white rounded-full text-sm font-semibold shadow-lg hover:bg-indigo-700 transition-all"
                  >
                    Add Items
                  </button>
                </div>
              )}
            </div>

            {/* Order Summary */}
            {items.length > 0 && (
              <div className="px-4 py-3 border-t border-gray-100 bg-white">

                {/* Summary rows */}
                <div className="space-y-1.5 text-[12px] mb-2">
                  <div className="flex justify-between text-slate-500">
                    <span>Subtotal</span>
                    <span className="font-semibold text-slate-700">${subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-slate-500">
                    <span>Shipping</span>
                    <span className="font-semibold text-slate-700">{shipping === 0 ? 'FREE' : `$${shipping.toFixed(2)}`}</span>
                  </div>
                  <div className="flex justify-between text-slate-500">
                    <span>Tax (8%)</span>
                    <span className="font-semibold text-slate-700">${tax.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-slate-800 pt-2 border-t border-gray-100">
                    <span className="font-semibold text-[13px]">Total</span>
                    <span className="text-indigo-600 font-bold text-[14px]">${total.toFixed(2)}</span>
                  </div>
                </div>

                {/* Buttons */}
                <div className="flex flex-col gap-2 mt-2">
                  <button
                    onClick={handleCheckout}
                    disabled={isCheckingOut}
                    className={`${BTN.primary} w-full !py-2.5 rounded-lg text-[13px] flex items-center justify-center gap-1.5 ${isCheckingOut ? 'opacity-70 cursor-not-allowed' : ''}`}
                  >
                    {isCheckingOut ? 'Processing...' : 'Proceed to Checkout'}
                    {!isCheckingOut && <ArrowRight size={15} />}
                  </button>
                  <button onClick={onClose} className="w-full py-2 rounded-lg text-[12px] text-slate-500 bg-gray-50 border border-gray-200 hover:bg-gray-100 transition-colors flex items-center justify-center gap-1.5">
                    <ShoppingBag size={13} />
                    Continue Shopping
                  </button>
                </div>
              </div>
            )}
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  )
}
