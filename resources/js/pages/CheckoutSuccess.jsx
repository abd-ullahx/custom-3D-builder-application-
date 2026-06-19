import { useEffect } from 'react'
import { Link, router } from '@inertiajs/react'
import { Check, Printer, ShoppingBag, ArrowRight, MapPin, Mail, Phone, Calendar, User, CreditCard, Tag } from 'lucide-react'
import { motion } from 'framer-motion'
import { COLORS, BTN } from '../config/theme'
import confetti from 'canvas-confetti'

export default function CheckoutSuccess({ order }) {
  // Fire celebration confetti when the page loads
  useEffect(() => {
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 }
    })
  }, [])

  const handlePrint = () => {
    window.print()
  }

  return (
    <div className="pt-28 pb-24 min-h-screen bg-[#F8F9FF] font-['Poppins'] print:bg-white print:pt-6 print:pb-6 print:min-h-0">
      
      {/* Print-specific stylesheet to force page layout and hide unwanted stuff */}
      <style dangerouslySetInnerHTML={{__html: `
        @media print {
          body {
            background-color: white !important;
            color: black !important;
          }
          nav, footer, .no-print {
            display: none !important;
          }
          .print-container {
            width: 100% !important;
            max-width: 100% !important;
            padding: 0 !important;
            margin: 0 !important;
            border: none !important;
            box-shadow: none !important;
          }
          .print-card {
            border: none !important;
            box-shadow: none !important;
            padding: 0 !important;
          }
        }
      `}} />

      <div className="max-w-3xl mx-auto px-4 sm:px-6 print-container">
        
        {/* success banner card (no-print) */}
        <div className="text-center mb-8 no-print">
          <motion.div 
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', stiffness: 260, damping: 20 }}
            className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 mb-4"
          >
            <Check size={32} strokeWidth={3} />
          </motion.div>
          
          <motion.h1 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-3xl font-extrabold text-slate-800 tracking-tight"
          >
            Thank You for Your Order!
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="text-slate-500 mt-2 text-sm max-w-md mx-auto"
          >
            Your order has been placed successfully and is being processed. A receipt copy is shown below.
          </motion.p>
        </div>

        {/* Invoice / Receipt layout */}
        <div className="bg-white rounded-3xl border border-slate-100 shadow-xl shadow-slate-100/40 overflow-hidden print-card">
          
          {/* Receipt Header Banner */}
          <div className="bg-gradient-to-r from-[#4F46E5] to-[#7C3AED] px-8 py-8 text-white flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 print:from-white print:to-white print:text-black print:border-b print:border-slate-200 print:px-0 print:py-4">
            <div>
              <div className="text-xs uppercase tracking-widest font-black text-indigo-200 print:text-slate-500">Invoice / Receipt</div>
              <h2 className="text-2xl font-black mt-1 tracking-tight">EAY SPORTS</h2>
              <p className="text-[11px] text-indigo-100/80 mt-1 print:text-slate-400">Premium Custom Sports Apparel</p>
            </div>
            <div className="sm:text-right">
              <div className="text-xs text-indigo-200 uppercase tracking-wider font-semibold print:text-slate-500">Order ID</div>
              <div className="text-xl font-bold font-mono tracking-tight mt-0.5">{order.order_id}</div>
              <div className="text-[11px] text-indigo-100/80 mt-1 flex items-center gap-1 sm:justify-end print:text-slate-400">
                <Calendar size={11} />
                <span>{order.date}</span>
              </div>
            </div>
          </div>

          <div className="p-8 space-y-8 print:px-0 print:py-6">
            
            {/* Customer Details Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pb-6 border-b border-slate-100">
              
              <div className="space-y-3">
                <h3 className="text-xs font-black text-slate-400 uppercase tracking-wider">Customer Details</h3>
                <div className="space-y-2 text-sm text-slate-700">
                  <p className="font-bold text-slate-800 flex items-center gap-2">
                    <User size={14} className="text-slate-400 shrink-0" />
                    <span>{order.billing_name}</span>
                  </p>
                  <p className="flex items-center gap-2 text-xs text-slate-500">
                    <Mail size={14} className="text-slate-400 shrink-0" />
                    <span>{order.billing_email}</span>
                  </p>
                  {order.phone && (
                    <p className="flex items-center gap-2 text-xs text-slate-500">
                      <Phone size={14} className="text-slate-400 shrink-0" />
                      <span>{order.phone}</span>
                    </p>
                  )}
                </div>
              </div>

              <div className="space-y-3">
                <h3 className="text-xs font-black text-slate-400 uppercase tracking-wider">Delivery Address</h3>
                <div className="space-y-2 text-sm text-slate-700">
                  <p className="flex items-start gap-2 text-xs text-slate-600 leading-relaxed">
                    <MapPin size={14} className="text-slate-400 shrink-0 mt-0.5" />
                    <span>
                      {order.shipping_address}
                      <br />
                      <strong className="text-slate-700">{order.city}</strong>
                      {order.zip_code && <span>, {order.zip_code}</span>}
                    </span>
                  </p>
                  <p className="flex items-center gap-2 text-xs text-slate-500">
                    <CreditCard size={14} className="text-slate-400 shrink-0" />
                    <span>{order.payment_method}</span>
                  </p>
                </div>
              </div>

            </div>

            {/* Order Notes (If Any) */}
            {order.notes && (
              <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100/50 print:bg-white print:border print:border-slate-200">
                <h4 className="text-[11px] font-black text-slate-400 uppercase tracking-wider mb-1">Order Notes</h4>
                <p className="text-xs text-slate-600 italic leading-relaxed">{order.notes}</p>
              </div>
            )}

            {/* Ordered Items Table */}
            <div className="space-y-3">
              <h3 className="text-xs font-black text-slate-400 uppercase tracking-wider">Ordered Items</h3>
              
              <div className="divide-y divide-slate-100 border-t border-b border-slate-100">
                {order.items.map((item, index) => (
                  <div key={index} className="flex items-center justify-between py-4 gap-4">
                    <div className="flex items-center gap-3">
                      {item.image && (
                        <div className="w-12 h-12 rounded-xl overflow-hidden bg-slate-50 border border-slate-100 shrink-0 print:border-slate-200">
                          <img 
                            src={item.image} 
                            alt={item.name} 
                            className="w-full h-full object-cover" 
                            onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1551280857-2b9bbe52acf4?w=100&h=100&fit=crop&q=80' }}
                          />
                        </div>
                      )}
                      <div>
                        <h4 className="text-sm font-bold text-slate-800">{item.name}</h4>
                        <div className="flex flex-wrap gap-1.5 mt-1">
                          {item.size && (
                            <span className="text-[9px] font-bold px-1.5 py-0.5 bg-slate-100 text-slate-600 rounded print:border print:border-slate-200">
                              Size: {item.size}
                            </span>
                          )}
                          {item.color && (
                            <span className="text-[9px] font-bold px-1.5 py-0.5 bg-slate-100 text-slate-600 rounded print:border print:border-slate-200">
                              Color: {item.color}
                            </span>
                          )}
                          {item.custom_name && (
                            <span className="text-[9px] font-bold px-1.5 py-0.5 bg-indigo-50 text-indigo-600 rounded print:border print:border-slate-200">
                              Name: {item.custom_name.toUpperCase()}
                            </span>
                          )}
                          {item.custom_number && (
                            <span className="text-[9px] font-bold px-1.5 py-0.5 bg-indigo-50 text-indigo-600 rounded print:border print:border-slate-200">
                              Number: {item.custom_number}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                    
                    <div className="text-right shrink-0">
                      <span className="text-sm font-bold text-slate-800">${(item.price * item.qty).toFixed(2)}</span>
                      <p className="text-[10px] text-slate-400 mt-0.5">Qty: {item.qty} @ ${item.price.toFixed(2)}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Financial Summary */}
            <div className="flex justify-end pt-2">
              <div className="w-full sm:w-72 space-y-2.5 text-slate-600 text-sm">
                
                <div className="flex justify-between text-xs">
                  <span>Subtotal</span>
                  <span className="font-bold text-slate-800">${order.subtotal.toFixed(2)}</span>
                </div>

                {order.discount > 0 && (
                  <div className="flex justify-between text-xs text-emerald-600 font-bold">
                    <span className="flex items-center gap-1">
                      <Tag size={12} />
                      Discount {order.coupon_code ? `(${order.coupon_code})` : ''}
                    </span>
                    <span>-${order.discount.toFixed(2)}</span>
                  </div>
                )}

                {order.shipping > 0 && (
                  <div className="flex justify-between text-xs">
                    <span>Shipping</span>
                    <span className="font-bold text-slate-800">${order.shipping.toFixed(2)}</span>
                  </div>
                )}

                {order.tax > 0 && (
                  <div className="flex justify-between text-xs">
                    <span>Tax (8%)</span>
                    <span className="font-bold text-slate-800">${order.tax.toFixed(2)}</span>
                  </div>
                )}

                <div className="flex justify-between text-slate-800 pt-3 border-t border-slate-100">
                  <span className="font-black text-sm">Grand Total</span>
                  <span className="text-[#4F46E5] font-black text-xl print:text-black">${order.total.toFixed(2)}</span>
                </div>

              </div>
            </div>

            {/* Notice */}
            <div className="text-center pt-8 border-t border-slate-100 text-[10px] text-slate-400">
              <p>This is a computer-generated receipt for your transaction with EAY SPORTS.</p>
              <p className="mt-1">For any queries regarding your order, please contact support at support@eaysports.com</p>
            </div>

          </div>
        </div>

        {/* Footer Actions (no-print) */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-8 no-print">
          <button
            onClick={handlePrint}
            className="w-full sm:w-auto px-6 py-3 bg-white border border-slate-200 text-slate-700 rounded-xl hover:bg-slate-50 font-semibold transition-all shadow-sm flex items-center justify-center gap-2"
          >
            <Printer size={16} />
            <span>Print / Save Receipt</span>
          </button>
          
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <Link
              href="/products"
              className="flex-1 sm:flex-none px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-semibold transition-all flex items-center justify-center gap-1.5 shadow-lg shadow-indigo-100"
            >
              <ShoppingBag size={16} />
              <span>Continue Shopping</span>
              <ArrowRight size={14} />
            </Link>
          </div>
        </div>

      </div>
    </div>
  )
}
