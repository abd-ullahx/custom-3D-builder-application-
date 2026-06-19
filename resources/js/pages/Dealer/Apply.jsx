import React, { useState } from 'react'
import { Link, useForm } from '@inertiajs/react'
import { FaHandshake, FaChevronLeft } from 'react-icons/fa'
import toast from 'react-hot-toast'

export default function Apply({ areas = [], flash = {} }) {
  const { data, setData, post, processing, errors, wasSuccessful } = useForm({
    name: '',
    business_name: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    country: 'United States',
    area_id: '',
    custom_zip_code: '',
    custom_latitude: '',
    custom_longitude: '',
    message: '',
  })

  const handleSubmit = (e) => {
    e.preventDefault()
    post('/dealer/apply', {
      onSuccess: () => {
        toast.success('Your wholesale application has been submitted successfully!', {
          duration: 6000,
          icon: '🤝'
        })
      }
    })
  }

  const handleAreaChange = (val) => {
    setData(prev => ({
      ...prev,
      area_id: val,
      custom_zip_code: val === 'other' ? prev.custom_zip_code : '',
      custom_latitude: val === 'other' ? prev.custom_latitude : '',
      custom_longitude: val === 'other' ? prev.custom_longitude : ''
    }))
  }

  if (wasSuccessful) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col justify-center py-12 px-6 lg:px-8 relative overflow-hidden font-sans">
        <div className="absolute inset-0 bg-grid-white/[0.02] bg-[size:30px_30px]" />
        <div className="absolute -top-40 -left-40 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl" />

        <div className="sm:mx-auto sm:w-full sm:max-w-2xl relative z-10 animate-fadeIn">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl p-10 md:p-12 text-center">
            
            <div className="w-20 h-20 bg-gradient-to-tr from-emerald-500 to-teal-400 rounded-2xl flex items-center justify-center text-white shadow-xl shadow-emerald-500/20 mx-auto mb-8 animate-bounce">
              <FaHandshake size={42} />
            </div>

            <h2 className="text-3xl font-extrabold tracking-tight text-white uppercase mb-4">
              Application Under Review
            </h2>
            
            <div className="h-1 w-20 bg-gradient-to-r from-indigo-500 to-purple-500 mx-auto mb-6 rounded-full" />

            <p className="text-base text-slate-300 leading-relaxed max-w-lg mx-auto mb-8">
              Thank you for applying to become an Eay Sports Wholesale Partner! Your business credentials and area coverage request are now being reviewed by our corporate sales team.
            </p>

            <div className="bg-slate-950/60 border border-slate-800 rounded-2xl p-6 mb-8 text-left max-w-md mx-auto space-y-3">
              <div className="flex items-center gap-2.5 text-slate-400 text-xs font-bold uppercase tracking-wider">
                <span className="w-2 h-2 rounded-full bg-indigo-500"></span>
                Next Steps
              </div>
              <ul className="text-xs text-slate-400 space-y-2 list-disc list-inside">
                <li>Our team will verify your corporate tax credentials and location details.</li>
                <li>Upon approval, a secure B2B partner account will be created automatically.</li>
                <li>Your secure portal password will be generated and sent directly to your registered email.</li>
                <li>In case of rejection or missing details, you will be notified promptly with a clear reason.</li>
              </ul>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/"
                className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-bold py-3.5 px-8 rounded-xl shadow-lg hover:scale-[1.02] active:scale-[0.98] transition-all text-sm uppercase tracking-wider cursor-pointer"
              >
                Return to Storefront
              </Link>
            </div>

          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-center py-12 px-6 lg:px-8 relative overflow-hidden font-sans">
      <div className="absolute -top-40 -left-40 w-96 h-96 bg-indigo-600/5 rounded-full blur-3xl" />
      <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-purple-600/5 rounded-full blur-3xl" />

      {/* Back button */}
      <div className="sm:mx-auto sm:w-full sm:max-w-2xl mb-4 relative z-10">
        <Link 
          href="/" 
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-800 uppercase tracking-wider transition-colors"
        >
          <FaChevronLeft size={10} /> Back to Storefront
        </Link>
      </div>

      <div className="sm:mx-auto sm:w-full sm:max-w-2xl relative z-10 animate-fadeIn">
        <div className="bg-white border border-slate-100 rounded-3xl shadow-xl shadow-slate-200/50 p-8 md:p-10">
          
          {/* Form Header */}
          <div className="text-center mb-8">
            <div className="w-14 h-14 bg-indigo-600 rounded-2xl flex items-center justify-center text-white shadow-xl shadow-indigo-500/20 mx-auto mb-4 animate-pulse">
              <FaHandshake size={28} />
            </div>
            <h2 className="text-2xl md:text-3xl font-extrabold tracking-tight text-slate-800 uppercase">Become a Wholesale Partner</h2>
            <p className="text-sm text-slate-500 mt-2 max-w-md mx-auto">
              Submit your dealer locator information below. Our corporate sales team will review your business credentials.
            </p>
          </div>

          {/* Success Notification */}
          {flash.success && (
            <div className="mb-6 p-4 rounded-xl bg-emerald-50 border border-emerald-100 text-emerald-800 text-sm font-semibold flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span>
              {flash.success}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              
              {/* Name */}
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Representative Name</label>
                <input
                  type="text"
                  required
                  value={data.name}
                  onChange={(e) => setData('name', e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all font-semibold"
                  placeholder="e.g. John Doe"
                />
                {errors.name && <p className="text-xs text-red-500 mt-1.5">{errors.name}</p>}
              </div>

              {/* Business Name */}
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Company / Business Name</label>
                <input
                  type="text"
                  required
                  value={data.business_name}
                  onChange={(e) => setData('business_name', e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all font-semibold"
                  placeholder="e.g. Champion Sports LLC"
                />
                {errors.business_name && <p className="text-xs text-red-500 mt-1.5">{errors.business_name}</p>}
              </div>

              {/* Email */}
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Corporate Email Address</label>
                <input
                  type="email"
                  required
                  value={data.email}
                  onChange={(e) => setData('email', e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all font-semibold"
                  placeholder="e.g. partner@business.com"
                />
                {errors.email && <p className="text-xs text-red-500 mt-1.5">{errors.email}</p>}
              </div>

              {/* Phone */}
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Business Phone Number</label>
                <input
                  type="text"
                  required
                  value={data.phone}
                  onChange={(e) => setData('phone', e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all font-semibold"
                  placeholder="e.g. +1 (555) 123-4567"
                />
                {errors.phone && <p className="text-xs text-red-500 mt-1.5">{errors.phone}</p>}
              </div>

              {/* Area select */}
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Zip Area Coverage</label>
                <select
                  required
                  value={data.area_id}
                  onChange={(e) => handleAreaChange(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all cursor-pointer font-semibold"
                >
                  <option value="">Select your local area ZIP...</option>
                  {areas.map(area => (
                    <option key={area.id} value={area.id}>ZIP {area.zip_code}</option>
                  ))}
                  <option value="other">Other (Write custom ZIP code)</option>
                </select>
                {errors.area_id && <p className="text-xs text-red-500 mt-1.5">{errors.area_id}</p>}
              </div>

              {/* Conditional Custom Area Coordinate Inputs */}
              {data.area_id === 'other' ? (
                <div className="col-span-1 md:col-span-2 grid grid-cols-1 md:grid-cols-3 gap-4 bg-slate-50 p-4 rounded-2xl border border-slate-100">
                  <div>
                    <label className="block text-xs font-bold text-indigo-600 uppercase tracking-widest mb-2">Custom ZIP Code</label>
                    <input
                      type="text"
                      required
                      value={data.custom_zip_code}
                      onChange={(e) => setData('custom_zip_code', e.target.value)}
                      className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all font-semibold"
                      placeholder="e.g. 90210"
                    />
                    {errors.custom_zip_code && <p className="text-xs text-red-500 mt-1.5">{errors.custom_zip_code}</p>}
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-indigo-600 uppercase tracking-widest mb-2">Latitude</label>
                    <input
                      type="number"
                      step="any"
                      required
                      value={data.custom_latitude}
                      onChange={(e) => setData('custom_latitude', e.target.value)}
                      className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all font-semibold"
                      placeholder="e.g. 34.0522"
                    />
                    {errors.custom_latitude && <p className="text-xs text-red-500 mt-1.5">{errors.custom_latitude}</p>}
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-indigo-600 uppercase tracking-widest mb-2">Longitude</label>
                    <input
                      type="number"
                      step="any"
                      required
                      value={data.custom_longitude}
                      onChange={(e) => setData('custom_longitude', e.target.value)}
                      className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all font-semibold"
                      placeholder="e.g. -118.2437"
                    />
                    {errors.custom_longitude && <p className="text-xs text-red-500 mt-1.5">{errors.custom_longitude}</p>}
                  </div>
                </div>
              ) : (
                /* City */
                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">City</label>
                  <input
                    type="text"
                    required
                    value={data.city}
                    onChange={(e) => setData('city', e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all font-semibold"
                    placeholder="e.g. New York"
                  />
                  {errors.city && <p className="text-xs text-red-500 mt-1.5">{errors.city}</p>}
                </div>
              )}
            </div>

            {/* Render City field below grid if ZIP select is 'other' so both are visible */}
            {data.area_id === 'other' && (
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">City</label>
                <input
                  type="text"
                  required
                  value={data.city}
                  onChange={(e) => setData('city', e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all font-semibold"
                  placeholder="e.g. New York"
                />
                {errors.city && <p className="text-xs text-red-500 mt-1.5">{errors.city}</p>}
              </div>
            )}

            {/* Address */}
            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Full Store / Corporate Address</label>
              <textarea
                required
                rows={2}
                value={data.address}
                onChange={(e) => setData('address', e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all resize-none font-semibold"
                placeholder="e.g. 123 Wholesale Blvd, Suite 400"
              />
              {errors.address && <p className="text-xs text-red-500 mt-1.5">{errors.address}</p>}
            </div>

            {/* Message */}
            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Wholesale Intention Message (Optional)</label>
              <textarea
                rows={3}
                value={data.message}
                onChange={(e) => setData('message', e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all resize-none font-semibold"
                placeholder="Describe your active team uniform sales, clientele, and target volume..."
              />
              {errors.message && <p className="text-xs text-red-500 mt-1.5">{errors.message}</p>}
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={processing}
              className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 disabled:opacity-50 text-white font-bold py-3.5 px-6 rounded-xl shadow-lg hover:scale-[1.01] active:scale-[0.99] transition-all text-sm uppercase tracking-wider cursor-pointer"
            >
              {processing ? 'Submitting Application...' : 'Submit Wholesale Application'}
            </button>
          </form>

          {/* Footer logins */}
          <div className="mt-8 text-center border-t border-slate-100 pt-6">
            <p className="text-sm text-slate-500 font-medium">
              Already registered as a B2B partner?{' '}
              <Link 
                href="/dealer/login" 
                className="font-bold text-indigo-600 hover:text-indigo-800 hover:underline transition-colors"
              >
                Log in to Partner Portal
              </Link>
            </p>
          </div>

        </div>
      </div>
    </div>
  )
}
