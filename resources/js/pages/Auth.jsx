import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Mail, Lock, User, ArrowRight, ShieldCheck, Zap, Award } from 'lucide-react'
import { COLORS, TEXT, BTN, BG } from '../config/theme'
import { useDispatch, useSelector } from 'react-redux'
import { loginUser, registerUser } from '../store/authSlice'
import { router } from '@inertiajs/react'
import toast from 'react-hot-toast'

const AUTH_IMAGE = 'https://images.unsplash.com/photo-1518611012118-696072aa579a?w=1200&h=1600&fit=crop&q=80'

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
}

export const Auth = () => {
  const dispatch = useDispatch()
  const [mode, setMode] = useState('login') // 'login' or 'signup'
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [name, setName] = useState('')
  const { loading: isLoading } = useSelector((state) => state.auth)

  const handleSubmit = (e) => {
    e.preventDefault()
    
    const body = mode === 'login' 
      ? { email, password } 
      : { name, email, password }

    const action = mode === 'login' ? loginUser(body) : registerUser(body)

    dispatch(action)
      .unwrap()
      .then((data) => {
        toast.success(data.message || 'Welcome!', { icon: '👋' })
        
        // Check for redirection path
        const redirectAfterLogin = localStorage.getItem('redirect_after_login');
        if (redirectAfterLogin) {
          localStorage.removeItem('redirect_after_login');
          router.visit(redirectAfterLogin);
          return;
        }

        // Redirect to pending design in builder if present
        const pending = localStorage.getItem('pending_checkout_design');
        if (pending) {
          try {
            const parsed = JSON.parse(pending);
            if (parsed && parsed.designId) {
              router.visit(`/builder/${parsed.designId}`);
              return;
            }
          } catch (e) {
            console.error('Failed to parse pending design:', e);
          }
        }
        
        router.visit('/')
      })
      .catch((err) => {
        toast.error(err || 'Authentication failed. Please verify credentials.')
      })
  }

  return (
    <div className={`min-h-screen ${BG.page} flex pt-20`}>
      
      {/* ─── LEFT SIDE: Branding / Info ─── */}
      <div className={`hidden lg:flex w-1/2 relative overflow-hidden items-center justify-center border-r border-slate-100 ${BG.section}`}>
        
        {/* Soft abstract background elements */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden opacity-40">
          <div className="absolute -top-40 -right-40 w-96 h-96 rounded-full bg-indigo-50 blur-3xl" />
          <div className="absolute bottom-0 left-20 w-80 h-80 rounded-full bg-blue-50 blur-3xl" />
        </div>

        {/* Content */}
        <div className="relative z-10 p-16 max-w-lg">
          <motion.div initial="hidden" animate="visible" variants={{ visible: { transition: { staggerChildren: 0.1 } } }}>
            
            <motion.h2 variants={fadeUp} className={`text-4xl lg:text-5xl ${TEXT.dark} mb-6 leading-tight tracking-tight`}>
              Customize your <br/>
              <span className={`text-[${COLORS.primary}]`}>
                dream gear.
              </span>
            </motion.h2>
            
            <motion.p variants={fadeUp} className={`${TEXT.mid} text-lg mb-12 leading-relaxed`}>
              Join thousands of teams and athletes who trust EAY SPORTS for premium sportswear that performs as hard as you do.
            </motion.p>

            <motion.div variants={fadeUp} className="grid grid-cols-1 gap-6">
              {[
                { icon: ShieldCheck, title: 'Premium Quality', desc: 'Engineered for peak performance' },
                { icon: Zap, title: 'Lightning Fast', desc: 'Quick turnaround on all custom orders' },
                { icon: Award, title: 'Satisfaction Guaranteed', desc: '100% money-back if you aren\'t thrilled' },
              ].map((feature, i) => (
                <div key={i} className="flex items-center gap-5 p-4 rounded-2xl bg-white border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
                  <div className={`w-12 h-12 rounded-xl bg-indigo-50 flex items-center justify-center text-[${COLORS.primary}] flex-shrink-0`}>
                    <feature.icon size={22} />
                  </div>
                  <div>
                    <h4 className={`${TEXT.dark} font-medium mb-1`}>{feature.title}</h4>
                    <p className="text-slate-500 text-sm leading-snug">{feature.desc}</p>
                  </div>
                </div>
              ))}
            </motion.div>
          </motion.div>
        </div>
      </div>

      {/* ─── RIGHT SIDE: Form ─── */}
      <div className={`w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-12 lg:p-24 xl:p-32 ${BG.page} relative`}>
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="w-full max-w-[440px]"
        >
          <div className="mb-10">
            <h1 className={`text-4xl tracking-tight mb-3 ${TEXT.dark}`}>
              {mode === 'login' ? 'Welcome Back' : 'Create Account'}
            </h1>
            <p className={`${TEXT.mid} text-lg`}>
              {mode === 'login' 
                ? 'Sign in to track your orders and saved designs.' 
                : 'Join EAY SPORTS to customize your dream gear.'}
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            <AnimatePresence mode="popLayout">
              {mode === 'signup' && (
                <motion.div
                  initial={{ opacity: 0, height: 0, y: -10 }}
                  animate={{ opacity: 1, height: 'auto', y: 0 }}
                  exit={{ opacity: 0, height: 0, y: -10 }}
                  transition={{ duration: 0.3 }}
                  className="overflow-hidden"
                >
                  <label className={`block text-xs uppercase tracking-wider font-medium mb-2 ${TEXT.mid}`}>Full Name</label>
                  <div className="relative group">
                    <User className={`absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-[${COLORS.primary}] transition-colors`} size={20} />
                    <input 
                      type="text" 
                      required={mode === 'signup'}
                      value={name}
                      onChange={e => setName(e.target.value)}
                      placeholder="e.g. John Doe" 
                      className={`w-full pl-12 pr-4 py-3.5 bg-white border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-[${COLORS.primary}] transition-all ${TEXT.dark} shadow-sm`}
                    />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <div>
              <label className={`block text-xs uppercase tracking-wider font-medium mb-2 ${TEXT.mid}`}>Email Address</label>
              <div className="relative group">
                <Mail className={`absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-[${COLORS.primary}] transition-colors`} size={20} />
                <input 
                  type="email" 
                  required
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="you@example.com" 
                  className={`w-full pl-12 pr-4 py-3.5 bg-white border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-[${COLORS.primary}] transition-all ${TEXT.dark} shadow-sm`}
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <label className={`block text-xs uppercase tracking-wider font-medium ${TEXT.mid}`}>Password</label>
                {mode === 'login' && (
                  <button type="button" className={`text-sm text-[${COLORS.primary}] hover:underline`}>
                    Forgot password?
                  </button>
                )}
              </div>
              <div className="relative group">
                <Lock className={`absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-[${COLORS.primary}] transition-colors`} size={20} />
                <input 
                  type="password" 
                  required
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="••••••••" 
                  className={`w-full pl-12 pr-4 py-3.5 bg-white border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-[${COLORS.primary}] transition-all ${TEXT.dark} shadow-sm`}
                />
              </div>
            </div>

            <button 
              type="submit" 
              disabled={isLoading}
              className={`${BTN.primary} w-full mt-4 !py-4 rounded-xl shadow-lg shadow-indigo-200/50 flex items-center justify-center gap-2 group relative overflow-hidden text-lg`}
            >
              <span className={`transition-opacity font-medium ${isLoading ? 'opacity-0' : 'opacity-100'}`}>
                {mode === 'login' ? 'Sign In to Account' : 'Create My Account'}
              </span>
              {!isLoading && <ArrowRight size={20} className="group-hover:translate-x-1.5 transition-transform" />}
              
              {/* Loading Spinner */}
              {isLoading && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                </div>
              )}
            </button>
          </form>

          {/* Footer Toggle */}
          <div className={`mt-10 text-center ${TEXT.mid} text-[15px]`}>
            {mode === 'login' ? "Don't have an account? " : "Already have an account? "}
            <button 
              onClick={() => {
                setMode(mode === 'login' ? 'signup' : 'login')
                setEmail('')
                setPassword('')
                setName('')
              }}
              className={`text-[${COLORS.primary}] hover:underline ml-1 font-medium`}
            >
              {mode === 'login' ? 'Sign up for free' : 'Sign in instead'}
            </button>
          </div>

        </motion.div>
      </div>

    </div>
  )
}
