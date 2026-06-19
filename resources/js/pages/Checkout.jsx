import { useState, useEffect, useMemo } from 'react'
import { motion } from 'framer-motion'
import { useSelector, useDispatch } from 'react-redux'
import { usePage, router } from '@inertiajs/react'
import { ArrowLeft, ShoppingBag, CreditCard, Sparkles, MapPin, Phone, Mail, User, FileText, CheckCircle, Tag } from 'lucide-react'
import { COLORS, TEXT, BG, SPACING, BTN, GRADIENTS } from '../config/theme'
import { checkoutOrder } from '../store/cartSlice'
import toast from 'react-hot-toast'

export default function Checkout() {
  const dispatch = useDispatch()
  const items = useSelector((state) => state.cart.items) || []
  const { isCheckingOut } = useSelector((state) => state.cart)
  const { auth = {} } = usePage().props
  const user = auth.user || null
  const isDealer = user && user.role === 'dealer'

  // Form states
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [address, setAddress] = useState('')
  const [city, setCity] = useState('')
  const [zipCode, setZipCode] = useState('')
  const [notes, setNotes] = useState('')
  const [paymentMethod] = useState('Cash on Delivery')
  const [isPrefilled, setIsPrefilled] = useState(false)

  // Coupon states
  const [couponCode, setCouponCode] = useState('')
  const [appliedCoupon, setAppliedCoupon] = useState(null)
  const [couponError, setCouponError] = useState('')
  const [isApplying, setIsApplying] = useState(false)
  const [autoCouponBanner, setAutoCouponBanner] = useState('')

  // Prefill user details once when loaded
  useEffect(() => {
    if (user && !isPrefilled) {
      const fullName = [user.name, user.last_name].filter(Boolean).join(' ')
      setName(fullName || '')
      setEmail(user.email || '')
      setPhone(user.phone || '')
      setIsPrefilled(true)
    }
  }, [user, isPrefilled])

  const subtotal = useMemo(() => items.reduce((s, i) => s + i.price * i.qty, 0), [items])

  // Fetch Auto Coupons
  useEffect(() => {
    if (subtotal > 0 && !appliedCoupon) {
      fetch(`/api/auto-coupons?cart_total=${subtotal}`)
        .then(res => res.json())
        .then(data => {
          if (data.success && data.coupon_code) {
            setAppliedCoupon({
              code: data.coupon_code,
              discount: data.discount_amount,
              isAuto: true
            })
            setAutoCouponBanner(data.message)
          }
        })
        .catch(err => console.error('Error fetching auto coupons:', err))
    }
  }, [subtotal, appliedCoupon])

  // Guard: Redirect if cart is empty
  useEffect(() => {
    if (items.length === 0) {
      toast.error('Your cart is empty! Add some items first.', { icon: '🛒' })
      router.visit('/products')
    }
  }, [items])

  const handleApplyCoupon = (e) => {
    if (e) e.preventDefault()
    if (!couponCode.trim()) return

    setCouponError('')
    setIsApplying(true)

    fetch('/api/apply-coupon', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || ''
      },
      body: JSON.stringify({
        code: couponCode,
        cart_total: subtotal
      })
    })
      .then(res => res.json())
      .then(data => {
        setIsApplying(false)
        if (data.success) {
          setAppliedCoupon({
            code: data.coupon_code,
            discount: data.discount_amount,
            isAuto: false
          })
          setAutoCouponBanner('')
          toast.success(data.message || 'Coupon applied successfully!', { icon: '🏷️' })
        } else {
          setCouponError(data.message || 'Failed to apply coupon.')
        }
      })
      .catch(err => {
        setIsApplying(false)
        setCouponError('Invalid coupon code or validation error.')
      })
  }

  const handleRemoveCoupon = () => {
    setAppliedCoupon(null)
    setCouponCode('')
    setCouponError('')
    setAutoCouponBanner('')
    toast.success('Coupon removed.')
  }

  const discount = appliedCoupon ? appliedCoupon.discount : 0
  const discountedSubtotal = Math.max(0, subtotal - discount)
  const shipping = items.length > 0 ? (discountedSubtotal > 100 ? 0 : 15.0) : 0
  const tax = discountedSubtotal * 0.08
  const total = discountedSubtotal + shipping + tax

  const handleSubmit = (e) => {
    e.preventDefault()

    if (!name.trim()) return toast.error('Please enter your full name')
    if (!email.trim()) return toast.error('Please enter your email address')
    if (!phone.trim()) return toast.error('Please enter your contact phone number')
    if (!address.trim()) return toast.error('Please enter your shipping address')
    if (!city.trim()) return toast.error('Please enter your city')
    if (!zipCode.trim()) return toast.error('Please enter your ZIP/postal code')

    const toastId = toast.loading('Placing your order...')

    dispatch(checkoutOrder({
      items,
      subtotal,
      shipping,
      tax,
      total,
      billing_name: name.trim(),
      billing_email: email.trim(),
      shipping_address: address.trim(),
      city: city.trim(),
      zip_code: zipCode.trim(),
      phone: phone.trim(),
      payment_method: paymentMethod,
      notes: notes.trim(),
      coupon_code: appliedCoupon ? appliedCoupon.code : null
    }))
      .unwrap()
      .then((data) => {
        toast.success(data.message || 'Order placed successfully!', { id: toastId, icon: '🎉' })
        const type = isDealer ? 'dealer' : 'retail'
        router.visit(`/checkout/success/${type}/${data.id}`)
      })
      .catch((err) => {
        const safeMessage = (typeof err === 'string' && err)
          ? err
          : (err?.message && typeof err.message === 'string' && !err.message.includes('SQLSTATE') && !err.message.includes('Error:'))
            ? err.message
            : 'We could not process your order. Please try again or contact support.'
        toast.error(safeMessage, { id: toastId })
      })
  }

  if (items.length === 0) return null

  return (
    <div className="pt-28 pb-24 min-h-screen bg-[#F8F9FF] font-['Poppins']">
      <div className={`${SPACING.container} max-w-6xl`}>
        
        {/* Navigation / Header */}
        <div className="flex items-center justify-between mb-10">
          <button 
            onClick={() => router.visit('/products')} 
            className="flex items-center gap-2 text-slate-500 hover:text-[#4F46E5] font-medium transition-colors"
          >
            <ArrowLeft size={16} />
            <span>Back to Products</span>
          </button>
          <h1 className="text-2xl md:text-3xl text-slate-700 tracking-tight font-semibold">Secure Checkout</h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* LEFT COLUMN: Customer & Shipping Details Form */}
          <div className="lg:col-span-7 space-y-6">
            <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-slate-100 p-6 md:p-8 shadow-xl shadow-slate-100/40 space-y-6">
              
              <div className="flex items-center gap-3 pb-4 border-b border-slate-100">
                <div className="w-10 h-10 rounded-xl bg-indigo-50 flex items-center justify-center text-[#4F46E5]">
                  <MapPin size={20} />
                </div>
                <div>
                  <h2 className="text-lg text-slate-700 font-semibold leading-none">Shipping & Billing Information</h2>
                  <p className="text-xs text-slate-400 mt-1">Please fill in your delivery details below</p>
                </div>
              </div>

              {/* Personal Details Row */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="flex flex-col gap-1.5">
                  <label htmlFor="name" className="text-xs font-bold text-slate-500 uppercase tracking-wide flex items-center gap-1.5">
                    <User size={13} className="text-slate-400" /> Full Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="name"
                    type="text"
                    required
                    placeholder="John Doe"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full rounded-xl border-gray-200 focus:border-indigo-500 focus:ring-indigo-500 text-sm px-4 py-3 placeholder-gray-400 bg-gray-50/50 transition-all shadow-sm"
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label htmlFor="email" className="text-xs font-bold text-slate-500 uppercase tracking-wide flex items-center gap-1.5">
                    <Mail size={13} className="text-slate-400" /> Email Address <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="email"
                    type="email"
                    required
                    placeholder="john@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full rounded-xl border-gray-200 focus:border-indigo-500 focus:ring-indigo-500 text-sm px-4 py-3 placeholder-gray-400 bg-gray-50/50 transition-all shadow-sm"
                  />
                </div>
              </div>

              {/* Contact Phone & City / Zip Row */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                <div className="flex flex-col gap-1.5 md:col-span-1">
                  <label htmlFor="phone" className="text-xs font-bold text-slate-500 uppercase tracking-wide flex items-center gap-1.5">
                    <Phone size={13} className="text-slate-400" /> Contact Phone <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="phone"
                    type="tel"
                    required
                    placeholder="e.g. +92 300 1234567"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full rounded-xl border-gray-200 focus:border-indigo-500 focus:ring-indigo-500 text-sm px-4 py-3 placeholder-gray-400 bg-gray-50/50 transition-all shadow-sm"
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label htmlFor="city" className="text-xs font-bold text-slate-500 uppercase tracking-wide">
                    City <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="city"
                    type="text"
                    required
                    placeholder="Lahore"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className="w-full rounded-xl border-gray-200 focus:border-indigo-500 focus:ring-indigo-500 text-sm px-4 py-3 placeholder-gray-400 bg-gray-50/50 transition-all shadow-sm"
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label htmlFor="zip" className="text-xs font-bold text-slate-500 uppercase tracking-wide">
                    ZIP / Postal Code <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="zip"
                    type="text"
                    required
                    placeholder="54000"
                    value={zipCode}
                    onChange={(e) => setZipCode(e.target.value)}
                    className="w-full rounded-xl border-gray-200 focus:border-indigo-500 focus:ring-indigo-500 text-sm px-4 py-3 placeholder-gray-400 bg-gray-50/50 transition-all shadow-sm"
                  />
                </div>
              </div>

              {/* Shipping Address */}
              <div className="flex flex-col gap-1.5">
                <label htmlFor="address" className="text-xs font-bold text-slate-500 uppercase tracking-wide flex items-center gap-1.5">
                  <MapPin size={13} className="text-slate-400" /> Shipping Address <span className="text-red-500">*</span>
                </label>
                <textarea
                  id="address"
                  rows="3"
                  required
                  maxLength={350}
                  placeholder="Enter your complete house number, street address, area name..."
                  value={address}
                  onChange={(e) => setAddress(e.target.value.slice(0, 350))}
                  className="w-full rounded-xl border-gray-200 focus:border-indigo-500 focus:ring-indigo-500 text-sm p-4 placeholder-gray-400 bg-gray-50/50 transition-all shadow-sm"
                />
              </div>

              {/* Order Notes */}
              <div className="flex flex-col gap-1.5">
                <label htmlFor="notes" className="text-xs font-bold text-slate-500 uppercase tracking-wide flex items-center gap-1.5">
                  <FileText size={13} className="text-slate-400" /> Order Notes <span className="text-slate-400 font-normal">(Optional)</span>
                </label>
                <textarea
                  id="notes"
                  rows="2"
                  placeholder="Notes about your order, e.g. special delivery instructions..."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full rounded-xl border-gray-200 focus:border-indigo-500 focus:ring-indigo-500 text-sm p-4 placeholder-gray-400 bg-gray-50/50 transition-all shadow-sm"
                />
              </div>

              {/* Payment Method Details */}
              <div className="space-y-3 pt-4 border-t border-slate-100">
                <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wide flex items-center gap-1.5">
                  <CreditCard size={13} className="text-slate-400" /> Payment Method
                </h3>
                <div className="flex items-start gap-3.5 p-4 bg-green-50/70 border border-green-200 rounded-2xl transition-all">
                  <div className="w-6 h-6 rounded-full bg-green-500 text-white flex items-center justify-center text-xs font-bold shrink-0 mt-0.5 shadow-sm">
                    ✓
                  </div>
                  <div>
                    <p className="text-sm font-bold text-green-900 leading-none">{paymentMethod}</p>
                    <p className="text-xs text-green-700/80 mt-1.5 leading-relaxed">
                      Cash on Delivery is standard. You will pay our delivery agent when your custom gear package arrives at your address.
                    </p>
                  </div>
                </div>
              </div>

              <div className="pt-4">
                <button
                  type="submit"
                  disabled={isCheckingOut}
                  className={`${BTN.primary} w-full !py-4 rounded-xl text-base font-semibold shadow-xl shadow-indigo-200/50 transition-all duration-300 flex items-center justify-center gap-2`}
                >
                  {isCheckingOut ? 'Placing Order...' : `Place Order ($${total.toFixed(2)})`}
                </button>
              </div>

            </form>
          </div>

          {/* RIGHT COLUMN: Order Summary & Coupon Sidebar */}
          <div className="lg:col-span-5 space-y-6">
            
            {/* Auto Coupon Alert */}
            {autoCouponBanner && (
              <motion.div 
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-emerald-50 border border-emerald-200 rounded-2xl px-5 py-4 text-emerald-800 text-xs font-semibold flex items-center justify-between shadow-sm"
              >
                <span className="flex items-center gap-2">
                  <Sparkles size={16} className="text-emerald-500" />
                  {autoCouponBanner}
                </span>
                <button 
                  type="button" 
                  onClick={handleRemoveCoupon} 
                  className="text-emerald-500 hover:text-emerald-700 w-5 h-5 rounded-full flex items-center justify-center hover:bg-emerald-100 font-bold transition-all"
                >
                  ✕
                </button>
              </motion.div>
            )}

            <div className="bg-white rounded-2xl border border-slate-100 p-6 shadow-xl shadow-slate-100/40 space-y-6">
              <div className="flex items-center gap-3 pb-4 border-b border-slate-100">
                <div className="w-10 h-10 rounded-xl bg-indigo-50 flex items-center justify-center text-[#4F46E5]">
                  <ShoppingBag size={20} />
                </div>
                <h2 className="text-lg text-slate-700 font-semibold leading-none">Order Summary</h2>
              </div>

              {/* Order Items List */}
              <div className="divide-y divide-slate-100 max-h-[280px] overflow-y-auto pr-2 custom-scrollbar">
                {items.map((item) => (
                  <div key={item.uniqueKey} className="flex items-center gap-3.5 py-4 first:pt-0 last:pb-0">
                    <div className="w-12 h-12 rounded-xl overflow-hidden bg-slate-50 border border-slate-100 shrink-0">
                      <img 
                        src={item.image} 
                        alt={item.name} 
                        className="w-full h-full object-cover" 
                        onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1551280857-2b9bbe52acf4?w=150&h=150&fit=crop&q=80' }}
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="text-slate-800 text-xs font-bold truncate">{item.name}</h4>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {item.tags.map((t) => (
                          <span key={t.label} className="text-[9px] px-1.5 py-[1px] bg-slate-50 border border-slate-200/60 text-slate-500 rounded-full font-medium">
                            {t.label}
                          </span>
                        ))}
                      </div>
                    </div>
                    <div className="text-right shrink-0">
                      <span className="text-slate-700 font-bold text-xs">${(item.price * item.qty).toFixed(2)}</span>
                      <p className="text-[10px] text-slate-400 mt-0.5">Qty: {item.qty}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Coupon Form */}
              <div className="pt-4 border-t border-slate-100">
                {appliedCoupon ? (
                  <div className="flex items-center justify-between bg-emerald-50 border border-emerald-200 rounded-xl px-4 py-2.5">
                    <div className="flex items-center gap-2">
                      <Tag size={14} className="text-emerald-600" />
                      <span className="text-emerald-700 font-bold text-xs uppercase bg-emerald-100 px-2 py-0.5 rounded">{appliedCoupon.code}</span>
                      <span className="text-xs text-emerald-800 font-bold">-${appliedCoupon.discount.toFixed(2)}</span>
                    </div>
                    <button type="button" onClick={handleRemoveCoupon} className="text-emerald-500 hover:text-emerald-700 text-xs font-bold">✕</button>
                  </div>
                ) : (
                  <form onSubmit={handleApplyCoupon} className="flex gap-2">
                    <input
                      type="text"
                      placeholder="PROMO CODE"
                      value={couponCode}
                      onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                      className="flex-1 rounded-xl border-gray-200 focus:border-indigo-500 focus:ring-indigo-500 text-xs px-3.5 py-3.5 uppercase font-semibold bg-gray-50/50"
                    />
                    <button 
                      type="submit" 
                      disabled={isApplying || !couponCode.trim()} 
                      className="bg-[#4F46E5] text-white text-xs font-bold px-4 py-3.5 rounded-xl hover:bg-indigo-700 transition-colors disabled:opacity-50"
                    >
                      {isApplying ? 'Applying...' : 'Apply'}
                    </button>
                  </form>
                )}
                {couponError && <p className="text-red-500 text-[10px] font-bold mt-2 px-1">{couponError}</p>}
              </div>

              {/* Totals Table */}
              <div className="space-y-3 pt-5 border-t border-slate-100 text-sm">
                
                {appliedCoupon && isDealer && (
                  <div className="bg-amber-50 border border-amber-200 text-amber-800 text-[10px] font-bold px-3 py-2 rounded-xl flex items-center gap-1.5 shadow-sm">
                    <Tag size={12} className="text-amber-500 shrink-0" />
                    <span>Dealer Exclusive Discount Applied</span>
                  </div>
                )}

                <div className="flex justify-between text-slate-500 text-xs">
                  <span>Subtotal</span>
                  <span className="font-semibold text-slate-700">${subtotal.toFixed(2)}</span>
                </div>
                {appliedCoupon && (
                  <div className="flex justify-between text-emerald-600 font-bold text-xs">
                    <span>Coupon Discount</span>
                    <span>-${appliedCoupon.discount.toFixed(2)}</span>
                  </div>
                )}
                <div className="flex justify-between text-slate-500 text-xs">
                  <span>Shipping</span>
                  <span className="font-semibold text-slate-700">{shipping === 0 ? 'FREE' : `$${shipping.toFixed(2)}`}</span>
                </div>
                <div className="flex justify-between text-slate-500 text-xs">
                  <span>Tax (8%)</span>
                  <span className="font-semibold text-slate-700">${tax.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-slate-800 pt-3 border-t border-slate-100">
                  <span className="font-bold text-sm">Total Amount</span>
                  <span className="text-[#4F46E5] font-black text-lg">${total.toFixed(2)}</span>
                </div>
              </div>

            </div>
          </div>

        </div>
      </div>
    </div>
  )
}
