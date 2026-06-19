import React, { useState, useEffect } from 'react'
import { Link, router, useForm } from '@inertiajs/react'
import DealerLayout from '../../../components/Dealer/DealerLayout'
import { FaTrash, FaPlus, FaCartPlus, FaArrowLeft, FaCalculator } from 'react-icons/fa'

export default function Create({ products = [], savedDesigns = [], dealer = {} }) {
  const [rows, setRows] = useState([
    {
      product_id: '',
      saved_design_id: '',
      qty: 1,
      size: 'M',
      custom_name: '',
      custom_number: '',
      unit_price: 0,
      row_total: 0
    }
  ])

  const { data, setData, post, processing, errors } = useForm({
    shipping_address: dealer.address || '',
    city: dealer.city || '',
    country: dealer.country || 'United States',
    notes: '',
    items: []
  })

  // Watch rows and update the parent form items
  useEffect(() => {
    setData('items', rows.map(row => ({
      product_id: row.product_id,
      saved_design_id: row.saved_design_id,
      qty: row.qty,
      size: row.size,
      custom_name: row.custom_name,
      custom_number: row.custom_number,
    })))
  }, [rows])

  // Handles dropdown product select
  const handleProductSelect = (index, productId) => {
    const selectedProduct = products.find(p => p.id === Number(productId))
    const price = selectedProduct ? parseFloat(selectedProduct.price) : 0
    
    setRows(prevRows => prevRows.map((row, idx) => {
      if (idx === index) {
        const qty = row.qty || 1
        return {
          ...row,
          product_id: productId,
          unit_price: price,
          row_total: price * qty
        }
      }
      return row
    }))
  }

  // Handles value changes in text/numeric fields
  const handleRowChange = (index, field, value) => {
    setRows(prevRows => prevRows.map((row, idx) => {
      if (idx === index) {
        const updatedRow = { ...row, [field]: value }
        if (field === 'qty') {
          const qty = parseInt(value) || 0
          updatedRow.row_total = row.unit_price * qty
        }
        return updatedRow
      }
      return row
    }))
  }

  // Adds a new row
  const addRow = () => {
    setRows(prevRows => [
      ...prevRows,
      {
        product_id: '',
        saved_design_id: '',
        qty: 1,
        size: 'M',
        custom_name: '',
        custom_number: '',
        unit_price: 0,
        row_total: 0
      }
    ])
  }

  // Removes a row
  const removeRow = (index) => {
    if (rows.length === 1) {
      alert('You must have at least 1 product row to submit bulk orders.')
      return
    }
    setRows(prevRows => prevRows.filter((_, idx) => idx !== index))
  }

  // Live order total calculations
  const orderTotal = rows.reduce((sum, row) => sum + (row.row_total || 0), 0)

  const handleSubmit = (e) => {
    e.preventDefault()

    // Validate that all rows have selected products
    const incompleteRow = rows.some(r => !r.product_id)
    if (incompleteRow) {
      alert('Please select valid products for all items in your cart.')
      return
    }

    post('/dealer/orders')
  }

  const sizes = ['XS', 'S', 'M', 'L', 'XL', 'XXL', 'XXXL']

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
            <h2 className="text-2xl md:text-3xl font-extrabold tracking-tight text-slate-800 uppercase">Place Wholesale Order</h2>
            <p className="text-sm text-slate-500 mt-1">Submit custom sizes, player specifications, and wholesale item quantities in wholesale bulk.</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          
          {/* Dynamic Order Canvas Card */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden p-6 md:p-8">
            <h3 className="font-extrabold text-slate-800 text-base tracking-wide uppercase mb-6 flex items-center gap-2">
              <FaCalculator className="text-indigo-600" /> Cart Configurator
            </h3>

            {/* Rows list */}
            <div className="space-y-4">
              {rows.map((row, index) => (
                <div 
                  key={index}
                  className="p-3.5 rounded-2xl bg-slate-50/50 border border-slate-100 flex flex-col lg:flex-row items-stretch lg:items-center gap-1.5 relative"
                >
                  {/* Row Indicator */}
                  <span className="absolute -top-2.5 -left-2.5 w-5 h-5 rounded-full bg-slate-200 flex items-center justify-center text-[9px] font-extrabold text-slate-600 border-2 border-white shadow-sm">
                    {index + 1}
                  </span>

                  {/* Product selector */}
                  <div className="flex-1 min-w-[140px]">
                    <label className="block text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-1 text-ellipsis overflow-hidden whitespace-nowrap">Product</label>
                    <select
                      required
                      value={row.product_id}
                      onChange={(e) => handleProductSelect(index, e.target.value)}
                      className="w-full bg-white border border-slate-200 rounded-xl pl-2 pr-7 py-2 text-[11px] font-semibold text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all cursor-pointer"
                    >
                      <option value="">Select Uniform...</option>
                      {products.map(product => (
                        <option key={product.id} value={product.id}>
                          {product.name} (${parseFloat(product.price).toFixed(2)})
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Saved Design Selector (Optional) */}
                  <div className="flex-1 min-w-[130px]">
                    <label className="block text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-1 text-ellipsis overflow-hidden whitespace-nowrap">3D Design (Optional)</label>
                    <select
                      value={row.saved_design_id || ''}
                      onChange={(e) => handleRowChange(index, 'saved_design_id', e.target.value)}
                      className="w-full bg-white border border-slate-200 rounded-xl pl-2 pr-7 py-2 text-[11px] font-semibold text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all cursor-pointer"
                    >
                      <option value="">Plain / Catalog Design</option>
                      {savedDesigns.map(design => (
                        <option key={design.id} value={design.id}>
                          {design.name} ({design.model_name.toUpperCase()})
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Qty */}
                  <div className="w-14">
                    <label className="block text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-1 text-ellipsis overflow-hidden whitespace-nowrap">Qty</label>
                    <input
                      type="number"
                      required
                      min="1"
                      value={row.qty}
                      onChange={(e) => handleRowChange(index, 'qty', e.target.value)}
                      className="w-full bg-white border border-slate-200 rounded-xl px-1.5 py-2 text-[11px] font-bold text-center text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
                    />
                  </div>

                  {/* Size */}
                  <div className="w-18">
                    <label className="block text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-1 text-ellipsis overflow-hidden whitespace-nowrap">Size</label>
                    <select
                      required
                      value={row.size}
                      onChange={(e) => handleRowChange(index, 'size', e.target.value)}
                      className="w-full bg-white border border-slate-200 rounded-xl pl-2 pr-6 py-2 text-[11px] font-bold text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all cursor-pointer"
                    >
                      {sizes.map(size => (
                        <option key={size} value={size}>{size}</option>
                      ))}
                    </select>
                  </div>

                  {/* Custom Name */}
                  <div className="w-28">
                    <label className="block text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-1 text-ellipsis overflow-hidden whitespace-nowrap">Player Name</label>
                    <input
                      type="text"
                      value={row.custom_name}
                      onChange={(e) => handleRowChange(index, 'custom_name', e.target.value)}
                      className="w-full bg-white border border-slate-200 rounded-xl px-2 py-2 text-[11px] font-semibold text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
                      placeholder="SMITH"
                    />
                  </div>

                  {/* Custom Number */}
                  <div className="w-16">
                    <label className="block text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-1 text-ellipsis overflow-hidden whitespace-nowrap">No.</label>
                    <input
                      type="text"
                      value={row.custom_number}
                      onChange={(e) => handleRowChange(index, 'custom_number', e.target.value)}
                      className="w-full bg-white border border-slate-200 rounded-xl px-2 py-2 text-[11px] font-semibold text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
                      placeholder="23"
                    />
                  </div>

                  {/* Unit price */}
                  <div className="w-20">
                    <label className="block text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-1 text-ellipsis overflow-hidden whitespace-nowrap">Unit Price</label>
                    <div className="w-full bg-slate-100 border border-slate-100 rounded-xl px-2 py-2 text-[11px] font-extrabold text-slate-400 cursor-not-allowed text-center">
                      ${row.unit_price.toFixed(2)}
                    </div>
                  </div>

                  {/* Row total */}
                  <div className="w-20">
                    <label className="block text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-1 text-ellipsis overflow-hidden whitespace-nowrap">Row Total</label>
                    <div className="w-full bg-indigo-50 border border-indigo-50 rounded-xl px-2 py-2 text-[11px] font-extrabold text-[#4F46E5] text-center">
                      ${row.row_total.toFixed(2)}
                    </div>
                  </div>

                  {/* Delete row btn */}
                  <button
                    type="button"
                    onClick={() => removeRow(index)}
                    className="self-end lg:self-center p-2 text-rose-500 hover:bg-rose-50 rounded-xl transition-all hover:scale-105 active:scale-95 cursor-pointer mt-4 lg:mt-0"
                    title="Remove Item"
                  >
                    <FaTrash size={12} />
                  </button>

                </div>
              ))}
            </div>

            {/* Add row button */}
            <div className="mt-6 flex justify-start">
              <button
                type="button"
                onClick={addRow}
                className="inline-flex items-center gap-1.5 text-xs font-bold text-indigo-600 hover:text-indigo-800 bg-indigo-50 hover:bg-indigo-100/60 px-4 py-2.5 rounded-xl border border-indigo-100 transition-all hover:scale-[1.02] cursor-pointer"
              >
                <FaPlus size={10} /> Add Another Product
              </button>
            </div>

          </div>

          {/* Shipping & Order Summary */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            
            {/* Shipping Address */}
            <div className="lg:col-span-8 bg-white rounded-2xl border border-slate-200 shadow-sm p-6 md:p-8 space-y-5">
              <h3 className="font-extrabold text-slate-800 text-base tracking-wide uppercase border-b border-slate-100 pb-4">
                Shipping Destination Details
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {/* Street Address */}
                <div className="md:col-span-2">
                  <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Street Address</label>
                  <input
                    type="text"
                    required
                    value={data.shipping_address}
                    onChange={(e) => setData('shipping_address', e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all font-semibold"
                  />
                  {errors.shipping_address && <p className="text-xs text-red-500 mt-1.5">{errors.shipping_address}</p>}
                </div>

                {/* City */}
                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">City</label>
                  <input
                    type="text"
                    required
                    value={data.city}
                    onChange={(e) => setData('city', e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all font-semibold"
                  />
                  {errors.city && <p className="text-xs text-red-500 mt-1.5">{errors.city}</p>}
                </div>

                {/* Country */}
                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Country</label>
                  <input
                    type="text"
                    required
                    value={data.country}
                    onChange={(e) => setData('country', e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all font-semibold"
                  />
                  {errors.country && <p className="text-xs text-red-500 mt-1.5">{errors.country}</p>}
                </div>
              </div>

              {/* Order Notes */}
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Order Notes / Custom Requests</label>
                <textarea
                  rows={2}
                  value={data.notes}
                  onChange={(e) => setData('notes', e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all resize-none font-medium"
                  placeholder="Specify packaging requirements or dynamic customization highlights..."
                />
                {errors.notes && <p className="text-xs text-red-500 mt-1.5">{errors.notes}</p>}
              </div>

            </div>

            {/* Order Total card */}
            <div className="lg:col-span-4 bg-white rounded-2xl border border-slate-200 shadow-sm p-6 md:p-8 space-y-6">
              <h3 className="font-extrabold text-slate-800 text-base tracking-wide uppercase border-b border-slate-100 pb-4">
                Wholesale Summary
              </h3>

              <div className="space-y-4">
                <div className="flex justify-between items-center text-sm font-semibold text-slate-500">
                  <span>Cart Items Count:</span>
                  <span>{rows.length} product entries</span>
                </div>
                <div className="flex justify-between items-center text-sm font-semibold text-slate-500">
                  <span>Shipping Cost:</span>
                  <span className="text-emerald-500 font-extrabold uppercase text-xs bg-emerald-50 px-2 py-0.5 rounded border border-emerald-100">Free B2B Delivery</span>
                </div>
                
                <div className="border-t border-slate-100 pt-4 flex justify-between items-center">
                  <span className="text-sm font-extrabold text-slate-800 uppercase tracking-wide">GRAND TOTAL:</span>
                  <span className="text-xl md:text-2xl font-extrabold text-[#4F46E5]">
                    ${orderTotal.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </span>
                </div>
              </div>

              {errors.items && (
                <div className="p-3.5 bg-red-50 border border-red-200 text-red-800 rounded-xl text-xs font-semibold">
                  {errors.items}
                </div>
              )}

              {/* Submit */}
              <button
                type="submit"
                disabled={processing}
                className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 disabled:opacity-50 text-white font-extrabold py-3.5 px-6 rounded-xl shadow-lg hover:scale-[1.01] active:scale-[0.99] transition-all text-sm uppercase tracking-wider flex items-center justify-center gap-2 cursor-pointer"
              >
                <FaCartPlus />
                {processing ? 'Submitting wholesale Order...' : 'Place wholesale Order'}
              </button>

            </div>

          </div>

        </form>

      </div>
    </DealerLayout>
  )
}
