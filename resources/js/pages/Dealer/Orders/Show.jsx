import React from 'react'
import { Link } from '@inertiajs/react'
import DealerLayout from '../../../components/Dealer/DealerLayout'
import { FaArrowLeft, FaTruck, FaMapMarkerAlt, FaFileAlt } from 'react-icons/fa'

export default function Show({ order = {} }) {
  const statusColors = {
    pending: 'bg-amber-100 text-amber-800 border-amber-200',
    confirmed: 'bg-blue-100 text-blue-800 border-blue-200',
    processing: 'bg-indigo-100 text-indigo-800 border-indigo-200',
    shipped: 'bg-purple-100 text-purple-800 border-purple-200',
    delivered: 'bg-emerald-100 text-emerald-800 border-emerald-200',
    cancelled: 'bg-rose-100 text-rose-800 border-rose-200',
  }

  const { items = [] } = order

  return (
    <DealerLayout>
      <div className="space-y-8 animate-fadeIn">
        {/* Header */}
        <div className="flex items-center gap-3">
          <Link
            href="/dealer/orders"
            className="w-9 h-9 rounded-xl bg-white border border-slate-200 text-slate-500 hover:text-slate-800 flex items-center justify-center shadow-sm hover:scale-105 active:scale-95 transition-all"
            title="Go Back"
          >
            <FaArrowLeft size={12} />
          </Link>
          <div>
            <div className="flex flex-wrap items-center gap-3">
              <h2 className="text-2xl md:text-3xl font-extrabold tracking-tight text-slate-800">
                Wholesale Order #{order.id}
              </h2>
              <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border ${statusColors[order.status] || 'bg-slate-100 text-slate-800'}`}>
                <span className="w-1.5 h-1.5 rounded-full bg-current"></span>
                {order.status}
              </span>
            </div>
            <p className="text-xs text-slate-400 font-bold uppercase tracking-wider mt-1">
              Placed on {new Date(order.created_at).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })} at {new Date(order.created_at).toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' })}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          
          {/* Items breakdown list */}
          <div className="lg:col-span-8 bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden p-6 md:p-8 space-y-6">
            <h3 className="font-extrabold text-slate-800 text-base tracking-wide uppercase border-b border-slate-100 pb-4 flex items-center gap-2">
              <FaFileAlt className="text-indigo-600" /> Customized Products Breakdown
            </h3>

            <div className="space-y-4">
              {items.map((item, idx) => (
                <div
                  key={item.id || idx}
                  className="flex flex-row items-center gap-4 bg-slate-50/50 p-4 rounded-xl border border-slate-100 hover:shadow-md transition-all"
                >
                  {/* Image */}
                  <div className="w-16 h-16 rounded-lg bg-white border border-slate-200 shrink-0 overflow-hidden flex items-center justify-center relative shadow-sm">
                    <img
                      src={item.image || 'https://images.unsplash.com/photo-1551280857-2b9bbe52acf4?w=600&h=400&fit=crop&q=80'}
                      alt={item.product_name}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2">
                      <h4 className="font-extrabold text-slate-800 text-sm truncate">{item.product_name}</h4>
                      <span className="text-xs font-extrabold text-slate-800 shrink-0 bg-white border border-slate-200 px-2.5 py-1 rounded-md shadow-sm">
                        ${parseFloat(item.unit_price).toFixed(2)} x {item.qty}
                      </span>
                    </div>

                    {/* Meta Tags */}
                    <div className="flex flex-wrap gap-1.5 mt-2.5">
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-indigo-50 border border-indigo-100 text-indigo-600">
                        Size: {item.size}
                      </span>
                      {item.custom_name && (
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-rose-50 border border-rose-100 text-rose-600">
                          Name: {item.custom_name.toUpperCase()}
                        </span>
                      )}
                      {item.custom_number && (
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-50 border border-emerald-100 text-emerald-600">
                          No: {item.custom_number}
                        </span>
                      )}
                      {item.saved_design && (
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-blue-50 border border-blue-100 text-blue-600">
                          3D Design: {item.saved_design.name}
                        </span>
                      )}
                    </div>

                    {item.saved_design && item.saved_design.design_data && (
                      <div className="mt-3.5 bg-slate-50 border border-slate-200/60 rounded-xl p-3.5 space-y-3 max-w-xl text-xs text-slate-600">
                        <div className="font-extrabold text-indigo-650 text-[10px] uppercase tracking-wider flex items-center gap-1.5">
                          <span>3D Customization Details</span>
                        </div>
                        
                        {(item.saved_design.design_data.materialFinish || item.saved_design.design_data.globalPattern) && (
                          <div className="flex flex-wrap items-center gap-2">
                            <span className="text-slate-400 font-medium">Material:</span>
                            {item.saved_design.design_data.materialFinish && (
                              <span className="px-2 py-0.5 rounded bg-slate-200 text-slate-700 font-bold uppercase text-[9px] tracking-wide">
                                {item.saved_design.design_data.materialFinish} finish
                              </span>
                            )}
                            {item.saved_design.design_data.globalPattern && (
                              <span className="px-2 py-0.5 rounded bg-slate-800 text-white font-bold uppercase text-[9px] tracking-wide">
                                {item.saved_design.design_data.globalPattern} pattern
                              </span>
                            )}
                          </div>
                        )}

                        {item.saved_design.design_data.meshStates && (
                          <div className="space-y-1">
                            <span className="text-slate-400 font-medium block">Component Colors:</span>
                            <div className="flex flex-wrap gap-1">
                              {Object.entries(item.saved_design.design_data.meshStates).map(([meshId, state]) => state?.color && (
                                <span key={meshId} className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-white border border-slate-200 text-[10px] font-bold text-slate-700">
                                  <span className="w-2.5 h-2.5 rounded-full border border-slate-300" style={{ backgroundColor: state.color }} />
                                  {meshId.replace('.obj', '').replace(/_/g, ' ')}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}

                        {item.saved_design.design_data.decals && (
                          <div className="space-y-2">
                            {item.saved_design.design_data.decals.filter(d => d.type === 'text').length > 0 && (
                              <div>
                                <span className="text-slate-400 font-medium block mb-1">Custom Lettering:</span>
                                {item.saved_design.design_data.decals.filter(d => d.type === 'text').map(decal => (
                                  <div key={decal.id} className="ps-2.5 border-l-2 border-indigo-400 py-0.5 text-[11px] font-semibold text-slate-800">
                                    "{decal.text}" <span className="text-[10px] text-slate-400 font-medium">({decal.font}, color: <span className="inline-block w-2.5 h-2.5 rounded-full border border-slate-350 align-middle" style={{ backgroundColor: decal.color }} />)</span>
                                  </div>
                                ))}
                              </div>
                            )}

                            {item.saved_design.design_data.decals.filter(d => d.type === 'image').length > 0 && (
                              <div>
                                <span className="text-slate-400 font-medium block mb-1">Applied Logos:</span>
                                <div className="flex flex-wrap gap-1.5">
                                  {item.saved_design.design_data.decals.filter(d => d.type === 'image').map(decal => (
                                    <span key={decal.id} className="inline-flex items-center gap-2 px-2 py-1 bg-white border border-slate-200 rounded-lg text-[10px] font-bold text-slate-700">
                                      {decal.imageUrl && <img src={decal.imageUrl} alt="Logo" className="h-4 object-contain" />}
                                      <span>{decal.text || 'Artwork'}</span>
                                    </span>
                                  ))}
                                </div>
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Row Total */}
                  <div className="text-right shrink-0 min-w-[80px] hidden sm:block">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">Row Total</span>
                    <span className="text-sm font-extrabold text-slate-800">
                      ${(parseFloat(item.unit_price) * parseInt(item.qty)).toFixed(2)}
                    </span>
                  </div>

                </div>
              ))}
            </div>
          </div>

          {/* Shipping & Billing Summary cards */}
          <div className="lg:col-span-4 space-y-6">
            
            {/* Delivery address */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 md:p-8 space-y-4">
              <h3 className="font-extrabold text-slate-800 text-sm tracking-wide uppercase border-b border-slate-100 pb-3.5 flex items-center gap-2">
                <FaMapMarkerAlt className="text-indigo-600" /> Shipping Destination
              </h3>
              
              <div className="text-sm space-y-2 text-slate-600">
                <p className="font-semibold text-slate-800">{order.shipping_address}</p>
                <p className="font-medium">{order.city}, {order.country}</p>
              </div>
            </div>

            {/* Order Notes */}
            {order.notes && (
              <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 md:p-8 space-y-4">
                <h3 className="font-extrabold text-slate-800 text-sm tracking-wide uppercase border-b border-slate-100 pb-3.5 flex items-center gap-2">
                  <FaTruck className="text-indigo-600" /> B2B Special Requests
                </h3>
                <p className="text-xs font-semibold text-slate-500 bg-slate-50 p-3 rounded-xl border border-slate-100 italic leading-relaxed">
                  "{order.notes}"
                </p>
              </div>
            )}

            {/* Financial Summary */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 md:p-8 space-y-5">
              <h3 className="font-extrabold text-slate-800 text-sm tracking-wide uppercase border-b border-slate-100 pb-3.5">
                Financial Invoice
              </h3>

              <div className="space-y-3.5 text-sm font-semibold text-slate-500">
                <div className="flex justify-between items-center">
                  <span>Cart Items Count:</span>
                  <span className="text-slate-700">{items.reduce((sum, item) => sum + parseInt(item.qty), 0)} units</span>
                </div>
                <div className="flex justify-between items-center">
                  <span>B2B Shipping Charge:</span>
                  <span className="text-emerald-500 font-bold uppercase text-xs">Free wholesale Shipping</span>
                </div>
                <div className="border-t border-slate-100 pt-3.5 flex justify-between items-center">
                  <span className="text-xs font-extrabold text-slate-800 uppercase tracking-widest">TOTAL PAID:</span>
                  <span className="text-lg md:text-xl font-extrabold text-[#4F46E5]">
                    ${parseFloat(order.total_price).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </span>
                </div>
              </div>
            </div>

          </div>

        </div>
      </div>
    </DealerLayout>
  )
}
