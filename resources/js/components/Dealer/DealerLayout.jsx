import React, { useState } from 'react'
import { Link, router, usePage } from '@inertiajs/react'
import {
  FaTachometerAlt,
  FaShoppingBag,
  FaPlusCircle,
  FaPalette,
  FaUserAlt,
  FaSignOutAlt,
  FaHandshake,
  FaChevronLeft
} from 'react-icons/fa'

export default function DealerLayout({ children }) {
  const { auth, flash = {} } = usePage().props
  const dealer = auth?.user || {}
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false)

  const handleLogout = (e) => {
    e.preventDefault()
    setIsLogoutModalOpen(true)
  }

  const navItems = [
    { label: 'Dashboard', icon: <FaTachometerAlt />, href: '/dealer/dashboard' },
    { label: 'Orders Log', icon: <FaShoppingBag />, href: '/dealer/orders' },
    { label: 'Place Bulk Order', icon: <FaPlusCircle />, href: '/dealer/orders/create' },
    { label: 'Saved Designs', icon: <FaPalette />, href: '/dealer/designs' },
    { label: 'B2B Profile', icon: <FaUserAlt />, href: '/dealer/profile' },
  ]

  const currentPath = window.location.pathname

  return (
    <div className="min-h-screen bg-slate-50 flex font-sans">
      {/* ─── LEFT SIDEBAR (Dark Navy) ────────────────────────── */}
      <aside className="w-64 bg-slate-900 text-slate-300 flex flex-col border-r border-slate-800 shrink-0">
        {/* Brand Header */}
        <div className="h-16 px-6 bg-slate-950 flex items-center gap-3 border-b border-slate-800">
          <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center text-white font-bold text-base shadow-lg shadow-indigo-500/20">
            ES
          </div>
          <div>
            <h2 className="text-sm font-bold tracking-wider text-white uppercase">Eay Sports</h2>
            <p className="text-[10px] font-semibold text-indigo-400 uppercase tracking-widest">B2B Partner</p>
          </div>
        </div>

        {/* Sidebar Nav */}
        <nav className="flex-1 p-4 space-y-1.5">
          {navItems.map((item, index) => {
            const isActive = currentPath === item.href
            return (
              <Link
                key={index}
                href={item.href}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${isActive
                    ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30'
                    : 'hover:bg-slate-800/60 hover:text-white text-slate-400'
                  }`}
              >
                <span className={isActive ? 'text-white' : 'text-slate-500'}>
                  {item.icon}
                </span>
                <span>{item.label}</span>
              </Link>
            )
          })}
        </nav>

        {/* Logout at bottom */}
        <div className="p-4 border-t border-slate-800">
          <a
            href="#"
            onClick={handleLogout}
            className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-red-400 hover:bg-red-500/10 transition-colors"
          >
            <FaSignOutAlt />
            <span>Logout Portal</span>
          </a>
        </div>
      </aside>

      {/* ─── MAIN CONTENT ────────────────────────────────────── */}
      <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        {/* Top Header bar */}
        <header className="h-16 bg-white border-b border-slate-200 px-6 md:px-8 flex items-center justify-between shrink-0 shadow-sm relative z-10">
          <h1 className="text-lg md:text-xl font-bold tracking-tight text-slate-800 uppercase">
            EAY Sports — Dealer Portal
          </h1>
          <div className="flex items-center gap-4">
            <Link
              href="/"
              className="inline-flex items-center gap-1.5 text-xs font-bold text-indigo-600 hover:text-indigo-800 bg-indigo-50 border border-indigo-100 hover:bg-indigo-100/60 px-4 py-2 rounded-xl shadow-sm transition-all"
            >
              <FaChevronLeft size={10} /> Storefront View
            </Link>
            <span className="text-xs font-bold text-slate-400 uppercase tracking-widest bg-slate-100 border border-slate-200 px-3 py-1 rounded-md">
              B2B Portal
            </span>
            <span className="text-sm font-semibold text-slate-700">
              {dealer.name}
            </span>
          </div>
        </header>

        {/* Main Body */}
        <main className="flex-1 p-6 md:p-8 max-w-[1600px] w-full mx-auto">
          {/* Flash Alert Messages */}
          {flash.success && (
            <div className="mb-6 p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-sm font-semibold flex items-center gap-2 animate-fadeIn shadow-sm">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              {flash.success}
            </div>
          )}
          {flash.error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-800 rounded-xl text-sm font-semibold flex items-center gap-2 animate-fadeIn shadow-sm">
              <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></span>
              {flash.error}
            </div>
          )}

          {children}
        </main>
      </div>

      {/* ─── CUSTOM LOGOUT CONFIRMATION MODAL ────────────────── */}
      {isLogoutModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop Blur Overlay */}
          <div
            className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity duration-300 animate-fadeIn"
            onClick={() => setIsLogoutModalOpen(false)}
          />

          {/* Animated Modal Container */}
          <div className="bg-white rounded-2xl border border-slate-100 shadow-2xl w-full max-w-sm p-6 relative z-10 transform scale-100 transition-all duration-300 animate-fadeIn">
            {/* Warning Icon Badge */}
            <div className="w-12 h-12 rounded-full bg-rose-50 border border-rose-100 flex items-center justify-center text-rose-500 mx-auto mb-4">
              <FaSignOutAlt size={20} />
            </div>

            {/* Typography content */}
            <h3 className="text-lg font-extrabold text-slate-800 text-center uppercase tracking-wide">Confirm Portal Logout</h3>
            <p className="text-xs font-semibold text-slate-500 text-center mt-2 leading-relaxed">
              Are you sure you want to log out from your wholesale B2B partner session? Any unsaved changes inside active orders will be lost.
            </p>

            {/* Actions Grid */}
            <div className="flex items-center gap-3 mt-6">
              <button
                type="button"
                onClick={() => setIsLogoutModalOpen(false)}
                className="flex-1 bg-slate-100 hover:bg-slate-200/80 text-slate-600 hover:text-slate-800 font-extrabold py-2.5 px-4 rounded-xl text-xs uppercase tracking-wider transition-all cursor-pointer text-center border border-slate-200/30 active:scale-[0.98]"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => {
                  setIsLogoutModalOpen(false)
                  router.post('/dealer/logout')
                }}
                className="flex-1 bg-rose-600 hover:bg-rose-500 text-white font-extrabold py-2.5 px-4 rounded-xl text-xs uppercase tracking-wider shadow-lg shadow-rose-600/10 hover:shadow-rose-600/20 transition-all cursor-pointer text-center active:scale-[0.98]"
              >
                Logout B2B
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  )
}
