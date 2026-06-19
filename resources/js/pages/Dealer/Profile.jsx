import React from 'react'
import { useForm } from '@inertiajs/react'
import DealerLayout from '../../components/Dealer/DealerLayout'
import { FaUserEdit, FaSave } from 'react-icons/fa'

export default function Profile({ dealer = {} }) {
  const { data, setData, put, processing, errors } = useForm({
    name: dealer.name || '',
    phone: dealer.phone || '',
    address: dealer.address || '',
    city: dealer.city || '',
  })

  const handleSubmit = (e) => {
    e.preventDefault()
    put('/dealer/profile')
  }

  return (
    <DealerLayout>
      <div className="max-w-3xl space-y-8 animate-fadeIn">
        {/* Header */}
        <div>
          <h2 className="text-2xl md:text-3xl font-extrabold tracking-tight text-slate-800 uppercase">Storefront Profile</h2>
          <p className="text-sm text-slate-500 mt-1">Manage corporate representative names, store physical addresses, and B2B wholesale contact info.</p>
        </div>

        {/* Profile Card */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden p-6 md:p-8">
          <div className="flex items-center gap-4 mb-8 border-b border-slate-100 pb-6">
            <div className="w-12 h-12 rounded-xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600 shadow-md">
              <FaUserEdit size={22} />
            </div>
            <div>
              <h3 className="font-extrabold text-slate-800 text-lg tracking-wide uppercase">Corporate B2B Credentials</h3>
              <p className="text-xs text-slate-400 font-bold uppercase tracking-wider mt-0.5">Status: <span className="text-emerald-500 font-extrabold">{dealer.status}</span></p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              {/* Representative Name */}
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Representative Name</label>
                <input
                  type="text"
                  required
                  value={data.name}
                  onChange={(e) => setData('name', e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all font-semibold"
                />
                {errors.name && <p className="text-xs text-red-500 mt-1.5">{errors.name}</p>}
              </div>

              {/* Corporate Email (Read-Only) */}
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Email Address (Read-Only)</label>
                <input
                  type="email"
                  disabled
                  value={dealer.email}
                  className="w-full bg-slate-100 border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-400 cursor-not-allowed font-medium"
                />
              </div>

              {/* Representative Phone */}
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Phone Number</label>
                <input
                  type="text"
                  required
                  value={data.phone}
                  onChange={(e) => setData('phone', e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all font-semibold"
                />
                {errors.phone && <p className="text-xs text-red-500 mt-1.5">{errors.phone}</p>}
              </div>

              {/* Store City */}
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
            </div>

            {/* Store Address */}
            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Full Store / Shipping Address</label>
              <textarea
                required
                rows={3}
                value={data.address}
                onChange={(e) => setData('address', e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all resize-none font-semibold"
              />
              {errors.address && <p className="text-xs text-red-500 mt-1.5">{errors.address}</p>}
            </div>

            {/* Save Button */}
            <div className="pt-4 border-t border-slate-100 flex justify-end">
              <button
                type="submit"
                disabled={processing}
                className="bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white font-bold py-3 px-6 rounded-xl text-sm flex items-center justify-center gap-2 shadow-md hover:scale-[1.02] active:scale-[0.99] transition-all cursor-pointer"
              >
                <FaSave />
                {processing ? 'Saving changes...' : 'Save Profile Details'}
              </button>
            </div>

          </form>
        </div>
      </div>
    </DealerLayout>
  )
}
