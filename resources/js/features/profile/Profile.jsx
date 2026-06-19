import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  X, User, Package, Heart, Settings, LogOut, Trash2,
  Camera, Save, ChevronRight, Truck, CheckCircle2, Clock,
  Eye, RefreshCw, ShoppingBag, Bookmark
} from 'lucide-react'
import { COLORS, BTN } from '../../config/theme'
import { ProductCard } from '../../components/common/ProductCard/ProductCard'
import { useSelector, useDispatch } from 'react-redux'
import { fetchOrders } from '../../store/orderSlice'
import { fetchSavedDesigns, deleteSavedDesign } from '../../store/savedDesignSlice'
import { logoutUser, updateUser } from '../../store/authSlice'
import { apiRequest } from '../../store/api'
import toast from 'react-hot-toast'
import { router } from '@inertiajs/react'

const STATUS_CONFIG = {
  Delivered:  { color: 'bg-emerald-50 text-emerald-700 border-emerald-100', icon: <CheckCircle2 size={13} /> },
  'In Transit': { color: 'bg-blue-50 text-blue-700 border-blue-100',    icon: <Truck size={13} /> },
  Processing: { color: 'bg-amber-50 text-amber-700 border-amber-100',    icon: <Clock size={13} /> },
}

const NAV_ITEMS = [
  { key: 'profile',  label: 'Profile',       icon: User },
  { key: 'orders',   label: 'Orders',        icon: Package },
  { key: 'designs',  label: 'Saved Designs', icon: Heart },
  { key: 'wishlist', label: 'Wishlist',      icon: Bookmark },
  { key: 'settings', label: 'Settings',      icon: Settings },
]

export const Profile = ({ isOpen, onClose, onLogout }) => {
  const { user } = useSelector((state) => state.auth)
  const dispatch = useDispatch()
  const [activeTab, setActiveTab] = useState('profile')
  const wishlistItems = useSelector((state) => state.wishlist.items)

  // Dynamic States from Redux
  const { items: orders, loading: ordersLoading } = useSelector((state) => state.orders)
  const { items: designs, loading: designsLoading } = useSelector((state) => state.savedDesigns)

  // Local Profile input states
  const [name, setName] = useState(user?.name || '')
  const [lastName, setLastName] = useState(user?.last_name || '')
  const [phone, setPhone] = useState(user?.phone || '')
  const [savingProfile, setSavingProfile] = useState(false)
  const [uploadingImage, setUploadingImage] = useState(false)
  const fileInputRef = useRef(null)

  // Local Settings State initialized from user model columns
  const [settings, setSettings] = useState({
    email_notifications: !!user?.email_notifications,
    newsletter: !!user?.newsletter,
    two_factor_auth: !!user?.two_factor_auth
  })

  // Accordion state to view order items
  const [expandedOrders, setExpandedOrders] = useState({})

  const displayName = user ? (user.last_name ? `${user.name} ${user.last_name}` : user.name) : 'Customer'
  const displayEmail = user?.email || ''

  // Sync inputs and settings whenever user changes or modal opens
  useEffect(() => {
    if (isOpen && user) {
      setName(user.name || '')
      setLastName(user.last_name || '')
      setPhone(user.phone || '')
      setSettings({
        email_notifications: !!user.email_notifications,
        newsletter: !!user.newsletter,
        two_factor_auth: !!user.two_factor_auth
      })
    }
  }, [isOpen, user])

  // Sync scroll on open
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

  const handleImageUpload = async (e) => {
    const file = e.target.files?.[0]
    if (!file) return

    if (file.size > 2 * 1024 * 1024) {
      toast.error('Image size must be less than 2MB.')
      return
    }

    setUploadingImage(true)
    const toastId = toast.loading('Uploading profile image...')

    const formData = new FormData()
    formData.append('profile_image', file)

    const csrfToken = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || ''

    try {
      const response = await fetch('/api/auth/profile-image', {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'X-CSRF-TOKEN': csrfToken,
        },
        body: formData,
      })

      const data = await response.json()

      if (response.ok && data.success) {
        dispatch(updateUser(data.user))
        toast.success('Avatar updated successfully!', { id: toastId, icon: '📸' })
      } else {
        toast.error(data.message || 'Failed to upload profile image.', { id: toastId })
      }
    } catch (error) {
      toast.error(error.message || 'An error occurred while uploading.', { id: toastId })
    } finally {
      setUploadingImage(false)
      if (e.target) e.target.value = ''
    }
  }

  const handleFetchOrders = () => {
    dispatch(fetchOrders()).unwrap().catch(() => toast.error('Could not retrieve orders from server.'))
  }

  const handleFetchDesigns = () => {
    dispatch(fetchSavedDesigns()).unwrap().catch(() => toast.error('Could not retrieve saved designs from server.'))
  }

  // Fetch logic based on selected tab
  useEffect(() => {
    if (isOpen) {
      if (activeTab === 'orders' && orders.length === 0) {
        handleFetchOrders()
      } else if (activeTab === 'designs' && designs.length === 0) {
        handleFetchDesigns()
      }
    }
  }, [isOpen, activeTab])

  const toggleOrderExpand = (orderId) => {
    setExpandedOrders(prev => ({
      ...prev,
      [orderId]: !prev[orderId]
    }))
  }

  const handleSaveChanges = async () => {
    if (!name.trim()) {
      toast.error('First Name is required.')
      return
    }

    setSavingProfile(true)
    const toastId = toast.loading('Saving profile changes...')

    try {
      const response = await apiRequest('/api/auth/profile', {
        method: 'POST',
        body: {
          name,
          last_name: lastName,
          phone
        }
      })

      if (response.success) {
        dispatch(updateUser(response.user))
        toast.success('Profile details saved cleanly!', { id: toastId, icon: '👤' })
      } else {
        toast.error(response.message || 'Failed to save profile changes.', { id: toastId })
      }
    } catch (error) {
      toast.error(error.message || 'An error occurred while saving profile.', { id: toastId })
    } finally {
      setSavingProfile(false)
    }
  }

  const handleCancelChanges = () => {
    if (user) {
      setName(user.name || '')
      setLastName(user.last_name || '')
      setPhone(user.phone || '')
    }
    toast.success('Changes discarded!')
  }

  const handleToggleSetting = async (key) => {
    const newSettings = {
      ...settings,
      [key]: !settings[key]
    }

    const toastId = toast.loading('Updating preferences...')
    try {
      const response = await apiRequest('/api/auth/settings', {
        method: 'POST',
        body: {
          email_notifications: newSettings.email_notifications,
          newsletter: newSettings.newsletter,
          two_factor_auth: newSettings.two_factor_auth
        }
      })

      if (response.success) {
        setSettings(newSettings)
        dispatch(updateUser(response.user))
        toast.success('Preference updated successfully!', { id: toastId, duration: 1500, icon: '⚙️' })
      } else {
        toast.error(response.message || 'Failed to update preferences.', { id: toastId })
      }
    } catch (error) {
      toast.error(error.message || 'An error occurred while updating settings.', { id: toastId })
    }
  }

  const handleLoadSavedDesign = (design) => {
    onClose()
    const modelId = design.model_name || 'M1'
    router.visit(`/builder/${encodeURIComponent(modelId)}?saved_id=${design.id}`)
  }

  const handleDeleteSavedDesign = (id, e) => {
    e.stopPropagation()
    if (!confirm('Are you sure you want to delete this saved design?')) return

    const toastId = toast.loading('Deleting saved design...')

    dispatch(deleteSavedDesign(id))
      .unwrap()
      .then(() => {
        toast.success('Design successfully deleted.', { id: toastId, icon: '🗑️' })
      })
      .catch((err) => {
        toast.error(err || 'Failed to remove saved design.', { id: toastId })
      })
  }

  const handleLogout = () => {
    const toastId = toast.loading('Signing out safely...')
    dispatch(logoutUser())
      .unwrap()
      .finally(() => {
        onLogout()
        onClose()
        toast.success('Logged out successfully!', { id: toastId, icon: '🔐' })
        router.visit('/')
      })
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            key="profile-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/25 backdrop-blur-sm z-[2050]"
          />

          {/* Full-height panel */}
          <motion.aside
            key="profile-panel"
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', stiffness: 280, damping: 28 }}
            className="fixed top-0 right-0 h-full w-full max-w-[900px] bg-[#F8F9FF] z-[2100] flex flex-row shadow-2xl shadow-indigo-100/60 overflow-hidden"
          >
            {/* ─── LEFT SIDEBAR ─────────────────────────────── */}
            <div className="w-[76px] md:w-[240px] min-w-[76px] md:min-w-[240px] bg-white border-r border-gray-100 flex flex-col py-6 md:py-8 px-2 md:px-5 shrink-0 h-full overflow-y-auto custom-scrollbar">
              {/* Close btn */}
              <button
                onClick={onClose}
                className="self-center md:self-end w-10 h-10 md:w-9 md:h-9 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 hover:bg-red-50 hover:text-red-500 transition-all mb-6"
              >
                <X size={18} />
              </button>

              {/* Avatar */}
              <div className="flex flex-col items-center mb-8">
                <div className="relative">
                  <div className="w-12 h-12 md:w-20 md:h-20 rounded-full border-2 border-indigo-100 flex items-center justify-center shadow-lg shadow-indigo-200 overflow-hidden bg-white">
                    {user?.profile_image ? (
                      <img
                        src={user.profile_image}
                        alt="Profile"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-[#4F46E5] to-[#7C3AED] flex items-center justify-center">
                        <User size={22} className="text-white md:hidden" />
                        <User size={36} className="text-white hidden md:block" />
                      </div>
                    )}
                  </div>
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    disabled={uploadingImage}
                    className="absolute -bottom-1 -right-1 w-5 h-5 md:w-7 md:h-7 bg-white rounded-full border-2 border-indigo-100 flex items-center justify-center text-indigo-500 hover:bg-indigo-50 disabled:bg-gray-100 disabled:text-gray-400 transition-colors shadow-sm cursor-pointer"
                    title="Upload Profile Image"
                  >
                    {uploadingImage ? (
                      <RefreshCw size={10} className="animate-spin md:hidden" />
                    ) : (
                      <Camera size={10} className="md:hidden" />
                    )}
                    {uploadingImage ? (
                      <RefreshCw size={13} className="animate-spin hidden md:block" />
                    ) : (
                      <Camera size={13} className="hidden md:block" />
                    )}
                  </button>
                  {/* Hidden file input */}
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleImageUpload}
                    accept="image/*"
                    className="hidden"
                  />
                </div>
                <p className="hidden md:block mt-4 text-slate-800 text-lg font-medium tracking-tight">{displayName}</p>
                <p className="hidden md:block text-sm text-slate-400 font-medium">{displayEmail}</p>
              </div>

              {/* Nav */}
              <nav className="flex flex-col gap-2 md:gap-1 flex-1">
                {NAV_ITEMS.map(({ key, label, icon: Icon }) => (
                  <button
                    key={key}
                    onClick={() => setActiveTab(key)}
                    title={label}
                    className={`flex items-center justify-center md:justify-start gap-0 md:gap-3 p-3 md:px-4 md:py-3 rounded-xl text-sm transition-all ${
                      activeTab === key
                        ? 'bg-gradient-to-r from-[#4F46E5] to-[#7C3AED] text-white shadow-lg shadow-indigo-200/50 font-medium'
                        : 'text-slate-500 hover:bg-gray-50 hover:text-slate-800'
                    }`}
                  >
                    <Icon className="w-5 h-5 md:w-[17px] md:h-[17px]" />
                    <span className="hidden md:inline">{label}</span>
                    {activeTab !== key && <ChevronRight size={14} className="hidden md:block ml-auto opacity-40" />}
                  </button>
                ))}
              </nav>

              {/* Logout */}
              <button 
                onClick={handleLogout}
                title="Logout"
                className="flex items-center justify-center md:justify-start gap-0 md:gap-3 p-3 md:px-4 md:py-3 rounded-xl text-sm text-red-500 hover:bg-red-50 transition-colors mt-4 font-medium"
              >
                <LogOut className="w-5 h-5 md:w-[17px] md:h-[17px]" />
                <span className="hidden md:inline">Logout</span>
              </button>
            </div>

            {/* ─── MAIN CONTENT ─────────────────────────────── */}
            <div className="flex-1 overflow-y-auto px-5 md:px-8 py-6 md:py-8 custom-scrollbar" data-lenis-prevent>

              {/* Page Header */}
              <div className="mb-6 md:mb-8 flex flex-row items-center justify-between">
                <div>
                  <h1 className="text-2xl md:text-3xl text-slate-800 tracking-tight font-medium">My Account</h1>
                  <p className="text-sm md:text-base text-slate-400 font-medium mt-1">Manage your custom sportswear portfolio</p>
                </div>
                {(activeTab === 'orders' || activeTab === 'designs') && (
                  <button
                    onClick={activeTab === 'orders' ? handleFetchOrders : handleFetchDesigns}
                    className="p-2 text-slate-400 hover:text-[#4F46E5] rounded-full hover:bg-white border border-transparent hover:border-slate-100 transition-all flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider"
                    title="Reload data"
                  >
                    <RefreshCw size={13} className={ordersLoading || designsLoading ? 'animate-spin' : ''} />
                    <span className="hidden sm:inline">Refresh</span>
                  </button>
                )}
              </div>

              {/* ── PROFILE TAB ── */}
              {activeTab === 'profile' && (
                <motion.div
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-white rounded-xl p-8 border border-gray-100 shadow-sm"
                >
                  <h2 className="text-xl text-slate-800 mb-4 md:mb-6 font-medium tracking-tight">Profile Information</h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-5">
                    {[
                      { label: 'First Name', value: name, onChange: (e) => setName(e.target.value), type: 'text' },
                      { label: 'Last Name',  value: lastName, onChange: (e) => setLastName(e.target.value), type: 'text' },
                      { label: 'Email',      value: displayEmail, type: 'email', disabled: true },
                      { label: 'Phone',      value: phone, onChange: (e) => setPhone(e.target.value), type: 'tel' },
                    ].map((field) => (
                      <div key={field.label}>
                        <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                          {field.label}
                        </label>
                        <input
                          type={field.type}
                          value={field.value}
                          onChange={field.onChange}
                          disabled={field.disabled}
                          className={`w-full border rounded-lg px-4 md:px-5 py-2.5 md:py-3.5 text-slate-700 font-medium text-sm transition-all focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-[#4F46E5] ${
                            field.disabled ? 'bg-gray-100 border-gray-100 text-slate-400 cursor-not-allowed' : 'bg-gray-50 border-gray-200'
                          }`}
                        />
                      </div>
                    ))}
                  </div>
                  <div className="mt-6 md:mt-8 flex flex-col sm:flex-row items-stretch sm:items-center gap-3 md:gap-4">
                    <button 
                      onClick={handleSaveChanges}
                      disabled={savingProfile}
                      className={`${BTN.primary} !px-4 md:!px-8 !py-3 md:!py-3.5 text-sm flex items-center justify-center gap-2`}
                    >
                      {savingProfile ? (
                        <RefreshCw size={16} className="animate-spin" />
                      ) : (
                        <Save size={16} />
                      )}
                      Save Changes
                    </button>
                    <button 
                      onClick={handleCancelChanges}
                      className="px-4 md:px-8 py-3 md:py-3.5 rounded-lg text-sm font-semibold text-slate-500 bg-gray-50 border border-gray-200 hover:bg-gray-100 transition-colors flex justify-center"
                    >
                      Cancel
                    </button>
                  </div>
                </motion.div>
              )}

              {/* ── ORDERS TAB ── */}
              {activeTab === 'orders' && (
                <motion.div
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="space-y-4"
                >
                  <h2 className="text-xl text-slate-800 mb-4 font-medium tracking-tight">Recent Orders</h2>

                  {ordersLoading && (
                    <div className="flex flex-col items-center justify-center py-20 bg-white rounded-xl border border-gray-100 shadow-sm gap-3">
                      <div className="w-9 h-9 border-3 border-[#4F46E5] border-t-transparent rounded-full animate-spin" />
                      <p className="text-xs font-semibold text-slate-400 uppercase tracking-widest">Loading order files...</p>
                    </div>
                  )}

                  {!ordersLoading && orders.length === 0 && (
                    <div className="flex flex-col items-center justify-center py-20 bg-white rounded-xl border border-gray-100 shadow-sm px-6 text-center">
                      <div className="w-16 h-16 rounded-full bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-400 mb-4">
                        <ShoppingBag size={28} />
                      </div>
                      <p className="text-slate-700 font-semibold text-lg">No orders placed yet</p>
                      <p className="text-slate-400 text-sm max-w-sm mt-1 mb-6">Create customized team uniforms in the 3D studio and complete your first checkout!</p>
                      <button
                        onClick={() => { onClose(); router.visit('/builder'); }}
                        className={`${BTN.primary} text-sm`}
                      >
                        Enter 3D Customizer
                      </button>
                    </div>
                  )}

                  {!ordersLoading && orders.length > 0 && orders.map((order) => {
                    const cfg = STATUS_CONFIG[order.status] || STATUS_CONFIG['Processing']
                    const isExpanded = !!expandedOrders[order.real_id]

                    return (
                      <div
                        key={order.real_id}
                        className="bg-white rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-all overflow-hidden"
                      >
                        <div
                          onClick={() => toggleOrderExpand(order.real_id)}
                          className="px-5 py-5 flex flex-col sm:flex-row sm:items-center justify-between cursor-pointer gap-4"
                        >
                          <div>
                            <div className="flex items-center gap-2.5">
                              <span className="font-semibold text-slate-800 text-base">Order {order.id}</span>
                              <span className={`flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border ${cfg.color}`}>
                                {cfg.icon}
                                {order.status}
                              </span>
                            </div>
                            <p className="text-xs text-slate-400 mt-1 font-semibold">
                              Placed on {order.date} · {order.items_count} items
                            </p>
                          </div>
                          <div className="flex items-center justify-between sm:justify-end gap-5 self-stretch sm:self-auto border-t sm:border-t-0 pt-3 sm:pt-0 border-gray-50">
                            <div className="text-right">
                              <span className="text-slate-400 text-[10px] font-bold uppercase tracking-wider block">Total Paid</span>
                              <span className="text-lg font-bold text-slate-800">
                                ${order.price.toFixed(2)}
                              </span>
                            </div>
                            <button className={`w-8 h-8 rounded-full bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-400 hover:text-[#4F46E5] hover:bg-slate-100 transition-all ${isExpanded ? 'rotate-90 text-[#4F46E5]' : ''}`}>
                              <ChevronRight size={16} />
                            </button>
                          </div>
                        </div>

                        {/* Accordion detail list of ordered customizations */}
                        <AnimatePresence>
                          {isExpanded && (
                            <motion.div
                              initial={{ height: 0 }}
                              animate={{ height: 'auto' }}
                              exit={{ height: 0 }}
                              className="overflow-hidden border-t border-gray-100 bg-[#FAF9FE]"
                            >
                              <div className="p-5 space-y-3.5">
                                {order.items && order.items.map((item, idx) => (
                                  <div
                                    key={item.id || idx}
                                    className="flex flex-row items-center gap-4 bg-white p-3.5 rounded-lg border border-gray-100"
                                  >
                                    <div className="w-14 h-14 rounded bg-gray-50 border border-gray-100 shrink-0 overflow-hidden flex items-center justify-center relative">
                                      <img
                                        src={item.image || 'https://images.unsplash.com/photo-1551280857-2b9bbe52acf4?w=600&h=400&fit=crop&q=80'}
                                        alt={item.name}
                                        className="w-full h-full object-cover"
                                      />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                      <div className="flex items-start justify-between gap-2">
                                        <h4 className="font-semibold text-slate-800 text-sm truncate">{item.name}</h4>
                                        <span className="text-xs font-bold text-slate-700 shrink-0">
                                          ${item.price.toFixed(2)} x {item.qty}
                                        </span>
                                      </div>
                                      
                                      {/* Sub-item customization metadata tags */}
                                      <div className="flex flex-wrap gap-1.5 mt-2">
                                        {item.size && (
                                          <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-slate-100 border border-slate-200 text-slate-600">
                                            Size: {item.size}
                                          </span>
                                        )}
                                        {item.color && (
                                          <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-indigo-50 border border-indigo-100 text-indigo-600">
                                            Color: {item.color}
                                          </span>
                                        )}
                                        {item.custom_name && (
                                          <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-rose-50 border border-rose-100 text-rose-600">
                                            Name: {item.custom_name.toUpperCase()}
                                          </span>
                                        )}
                                        {item.custom_number !== null && item.custom_number !== undefined && item.custom_number !== '' && (
                                          <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-50 border border-emerald-100 text-emerald-600">
                                            No: {item.custom_number}
                                          </span>
                                        )}
                                        {!item.size && !item.color && !item.custom_name && !item.custom_number && (
                                          <span className="text-[10px] font-medium text-slate-400 italic">
                                            Standard product
                                          </span>
                                        )}
                                      </div>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    )
                  })}
                </motion.div>
              )}

              {/* ── SAVED DESIGNS TAB ── */}
              {activeTab === 'designs' && (
                <motion.div
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  <h2 className="text-xl text-slate-800 mb-6 font-medium tracking-tight">Saved Designs</h2>

                  {designsLoading && (
                    <div className="flex flex-col items-center justify-center py-20 bg-white rounded-xl border border-gray-100 shadow-sm gap-3">
                      <div className="w-9 h-9 border-3 border-[#4F46E5] border-t-transparent rounded-full animate-spin" />
                      <p className="text-xs font-semibold text-slate-400 uppercase tracking-widest">Loading structural saves...</p>
                    </div>
                  )}

                  {!designsLoading && designs.length === 0 && (
                    <div className="flex flex-col items-center justify-center py-20 bg-white rounded-xl border border-gray-100 shadow-sm px-6 text-center">
                      <div className="w-16 h-16 rounded-full bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-400 mb-4">
                        <Heart size={28} />
                      </div>
                      <p className="text-slate-700 font-semibold text-lg">No saved designs yet</p>
                      <p className="text-slate-400 text-sm max-w-sm mt-1 mb-6">You can save your exact structural modifications in the 3D Builder workspace to edit later!</p>
                      <button
                        onClick={() => { onClose(); router.visit('/builder'); }}
                        className={`${BTN.primary} text-sm`}
                      >
                        Start Designing
                      </button>
                    </div>
                  )}

                  {!designsLoading && designs.length > 0 && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                      {designs.map((design) => (
                        <div
                          key={design.id}
                          onClick={() => handleLoadSavedDesign(design)}
                          className="bg-white rounded-xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all cursor-pointer group flex flex-col relative"
                        >
                          <div className="relative h-44 overflow-hidden bg-slate-50 border-b border-slate-50">
                            <img
                              src={design.image}
                              alt={design.name}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent opacity-60 group-hover:opacity-85 transition-opacity" />
                            
                            {/* Hover customize overlay button */}
                            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                              <span className="bg-white text-slate-800 text-xs font-bold uppercase tracking-wider py-2.5 px-4 rounded-lg shadow-lg flex items-center gap-1.5 transform translate-y-3 group-hover:translate-y-0 transition-transform duration-300">
                                <Eye size={13} className="text-[#4F46E5]" />
                                Load in Builder
                              </span>
                            </div>

                            {/* Delete design top right */}
                            <button
                              onClick={(e) => handleDeleteSavedDesign(design.id, e)}
                              className="absolute top-3 right-3 w-8 h-8 rounded-lg bg-black/40 hover:bg-red-600 text-white flex items-center justify-center transition-colors shadow-sm"
                              title="Delete design"
                            >
                              <Trash2 size={14} />
                            </button>
                          </div>
                          <div className="px-5 py-4 flex-1 flex flex-col justify-between">
                            <div>
                              <p className="font-semibold text-slate-800 text-base truncate">{design.name}</p>
                              <p className="text-[10px] font-bold uppercase text-slate-400 mt-1 tracking-wider">
                                Model: {design.model_name.toUpperCase()}
                              </p>
                            </div>
                            <p className="text-xs text-slate-400 font-semibold mt-3">{design.date}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </motion.div>
              )}

              {/* ── WISHLIST TAB ── */}
              {activeTab === 'wishlist' && (
                <motion.div
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  <h2 className="text-xl text-slate-800 mb-6 font-medium tracking-tight">Your Wishlist</h2>

                  {wishlistItems.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-20 bg-white rounded-xl border border-gray-100 shadow-sm px-6 text-center">
                      <div className="w-16 h-16 rounded-full bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-400 mb-4">
                        <Bookmark size={28} />
                      </div>
                      <p className="text-slate-700 font-semibold text-lg">Your wishlist is empty</p>
                      <p className="text-slate-400 text-sm max-w-sm mt-1 mb-6">Explore our catalog and heart your favorite products to save them for later!</p>
                      <button
                        onClick={() => { onClose(); router.visit('/products'); }}
                        className={`${BTN.primary} text-sm`}
                      >
                        Browse Products
                      </button>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                      {wishlistItems.map((product) => (
                        <div key={product.id || Math.random()} className="transform scale-[0.98] origin-top">
                          <ProductCard 
                            product={product} 
                            onNavigate={() => { onClose(); router.visit(`/product-details/${product.id}`); }} 
                          />
                        </div>
                      ))}
                    </div>
                  )}
                </motion.div>
              )}

              {/* ── SETTINGS TAB ── */}
              {activeTab === 'settings' && (
                <motion.div
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-white rounded-xl p-8 border border-gray-100 shadow-sm"
                >
                  <h2 className="text-xl text-slate-800 mb-6 font-medium tracking-tight">Account Settings</h2>
                  <div className="space-y-4">
                    {[
                      { key: 'email_notifications', label: 'Email Notifications', desc: 'Receive updates about your orders' },
                      { key: 'newsletter',          label: 'Newsletter',          desc: 'Receive our weekly sportswear newsletter' },
                      { key: 'two_factor_auth',     label: 'Two-Factor Auth',     desc: 'Add an extra layer of security' },
                    ].map((setting) => {
                      const enabled = !!settings[setting.key]
                      return (
                        <div
                          key={setting.key}
                          className="flex items-center justify-between p-4 md:p-5 rounded-lg border border-gray-100 bg-gray-50/50 hover:border-indigo-100 transition-colors"
                        >
                          <div>
                            <p className="text-slate-700 text-sm font-semibold">{setting.label}</p>
                            <p className="text-xs text-slate-400 font-medium mt-0.5">{setting.desc}</p>
                          </div>
                          <button
                            onClick={() => handleToggleSetting(setting.key)}
                            className={`relative w-12 h-6 rounded-full transition-colors ${
                              enabled ? 'bg-[#4F46E5]' : 'bg-gray-200'
                            }`}
                          >
                            <span
                              className={`absolute top-1 w-4 h-4 rounded-full bg-white shadow transition-all ${
                                enabled ? 'left-7' : 'left-1'
                              }`}
                            />
                          </button>
                        </div>
                      )
                    })}
                  </div>
                </motion.div>
              )}

            </div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  )
}
