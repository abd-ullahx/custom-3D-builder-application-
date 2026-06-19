import React, { useState } from 'react'
import { Link, useForm } from '@inertiajs/react'
import { FaChevronLeft, FaShieldAlt, FaEye, FaEyeSlash } from 'react-icons/fa'

export default function ResetPassword({ token, email, errors = {}, flash = {} }) {
  const { data, setData, post, processing } = useForm({
    token: token || '',
    email: email || '',
    password: '',
    password_confirmation: '',
  })

  const [showPassword, setShowPassword] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)

  const handleSubmit = (e) => {
    e.preventDefault()
    post('/dealer/reset-password')
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-center py-12 px-6 lg:px-8 relative overflow-hidden font-sans animate-fadeIn">
      <div className="absolute -top-40 -left-40 w-96 h-96 bg-indigo-600/5 rounded-full blur-3xl" />
      <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-emerald-600/5 rounded-full blur-3xl" />

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
            <div className="w-14 h-14 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl flex items-center justify-center text-white shadow-xl shadow-emerald-500/20 mx-auto mb-4">
              <FaShieldAlt size={22} />
            </div>
            <h2 className="text-2xl md:text-3xl font-extrabold tracking-tight text-slate-800 uppercase">New Password</h2>
            <p className="text-sm text-slate-500 mt-2 max-w-sm mx-auto">
              Choose a strong new password for your dealer account. Make sure it's at least 6 characters long.
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
            
            {/* Email (readonly) */}
            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Dealer Email</label>
              <input
                type="email"
                value={data.email}
                readOnly
                className="w-full bg-slate-100 border border-slate-200 rounded-xl px-4 py-3.5 text-sm text-slate-500 cursor-not-allowed font-semibold"
              />
              {errors.email && <p className="text-xs text-red-500 mt-1.5">{errors.email}</p>}
            </div>

            {/* New Password */}
            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">New Password</label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={data.password}
                  onChange={(e) => setData('password', e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3.5 pr-12 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all font-semibold"
                  placeholder="Minimum 6 characters"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                >
                  {showPassword ? <FaEyeSlash size={16} /> : <FaEye size={16} />}
                </button>
              </div>
              {errors.password && <p className="text-xs text-red-500 mt-1.5">{errors.password}</p>}
            </div>

            {/* Confirm Password */}
            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Confirm Password</label>
              <div className="relative">
                <input
                  type={showConfirm ? 'text' : 'password'}
                  required
                  value={data.password_confirmation}
                  onChange={(e) => setData('password_confirmation', e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3.5 pr-12 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all font-semibold"
                  placeholder="Re-enter your password"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirm(!showConfirm)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                >
                  {showConfirm ? <FaEyeSlash size={16} /> : <FaEye size={16} />}
                </button>
              </div>
            </div>

            {/* Password strength indicator */}
            {data.password && (
              <div className="space-y-2">
                <div className="flex gap-1">
                  {[1, 2, 3, 4].map((level) => (
                    <div
                      key={level}
                      className={`h-1.5 flex-1 rounded-full transition-all duration-300 ${
                        data.password.length >= level * 3
                          ? level <= 1
                            ? 'bg-red-400'
                            : level <= 2
                            ? 'bg-amber-400'
                            : level <= 3
                            ? 'bg-emerald-400'
                            : 'bg-emerald-600'
                          : 'bg-slate-200'
                      }`}
                    />
                  ))}
                </div>
                <p className="text-xs text-slate-400 font-medium">
                  {data.password.length < 6
                    ? 'Too short'
                    : data.password.length < 8
                    ? 'Fair'
                    : data.password.length < 12
                    ? 'Good'
                    : 'Strong'}
                </p>
              </div>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={processing || data.password.length < 6 || data.password !== data.password_confirmation}
              className="w-full bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold py-3.5 px-6 rounded-xl shadow-lg hover:scale-[1.01] active:scale-[0.99] transition-all text-sm uppercase tracking-wider cursor-pointer"
            >
              {processing ? 'Updating Password...' : 'Set New Password'}
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
