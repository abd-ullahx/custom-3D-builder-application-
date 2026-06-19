import React from 'react'
import { Link, useForm } from '@inertiajs/react'
import { FaChevronLeft, FaEnvelope } from 'react-icons/fa'

export default function ForgotPassword({ errors = {}, flash = {} }) {
  const { data, setData, post, processing } = useForm({
    email: '',
  })

  const handleSubmit = (e) => {
    e.preventDefault()
    post('/dealer/forgot-password')
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-center py-12 px-6 lg:px-8 relative overflow-hidden font-sans animate-fadeIn">
      <div className="absolute -top-40 -left-40 w-96 h-96 bg-indigo-600/5 rounded-full blur-3xl" />
      <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-purple-600/5 rounded-full blur-3xl" />

      {/* Back button */}
      <div className="sm:mx-auto sm:w-full sm:max-w-md mb-4 relative z-10">
        <Link 
          href="/dealer/login" 
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-800 uppercase tracking-wider transition-colors"
        >
          <FaChevronLeft size={10} /> Back to Sign In
        </Link>
      </div>

      <div className="sm:mx-auto sm:w-full sm:max-w-md relative z-10">
        <div className="bg-white border border-slate-100 rounded-3xl shadow-xl shadow-slate-200/50 p-8 md:p-10">
          
          {/* Header */}
          <div className="text-center mb-8">
            <div style={{ background: 'linear-gradient(to bottom right, #6366f1, #a855f7)' }} className="w-14 h-14 rounded-2xl flex items-center justify-center text-white shadow-xl mx-auto mb-4">
              <FaEnvelope size={22} />
            </div>
            <h2 className="text-2xl md:text-3xl font-extrabold tracking-tight text-slate-800 uppercase">Reset Password</h2>
            <p className="text-sm text-slate-500 mt-2 max-w-sm mx-auto">
              Enter the email address associated with your dealer account and we'll help you reset your password.
            </p>
          </div>

          {/* Flash alert messages */}
          {flash.success && (
            <div className="mb-6 p-4 rounded-xl bg-emerald-50 border border-emerald-100 text-emerald-800 text-sm font-semibold flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
              {flash.success}
            </div>
          )}
          {flash.error && (
            <div className="mb-6 p-4 rounded-xl bg-red-50 border border-red-100 text-red-800 text-sm font-semibold flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-red-500"></span>
              {flash.error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            
            {/* Email */}
            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Dealer Email Address</label>
              <input
                type="email"
                required
                value={data.email}
                onChange={(e) => setData('email', e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3.5 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-all font-semibold"
                placeholder="partner@business.com"
              />
              {errors.email && <p className="text-xs text-red-500 mt-1.5">{errors.email}</p>}
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={processing}
              style={{ background: 'linear-gradient(to right, #6366f1, #a855f7)' }}
              className="w-full disabled:opacity-50 text-white font-bold py-3.5 px-6 rounded-xl shadow-lg hover:opacity-90 hover:scale-[1.01] active:scale-[0.99] transition-all text-sm uppercase tracking-wider cursor-pointer"
            >
              {processing ? 'Processing...' : 'Reset Password'}
            </button>
          </form>

          {/* Footer */}
          <div className="mt-8 text-center border-t border-slate-100 pt-6">
            <p className="text-sm text-slate-500 font-medium">
              Remembered your password?{' '}
              <Link 
                href="/dealer/login" 
                className="font-bold text-indigo-600 hover:text-indigo-800 hover:underline transition-colors"
              >
                Sign In
              </Link>
            </p>
          </div>

        </div>
      </div>
    </div>
  )
}
