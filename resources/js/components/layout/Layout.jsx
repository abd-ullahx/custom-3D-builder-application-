import { useState, useEffect } from 'react'
import { Header } from '../layout/Header/Header'
import { Footer } from '../layout/Footer/Footer'
import SmoothScroll from '../common/SmoothScroll/SmoothScroll'
import { Cart }    from '../../features/cart/Cart'
import { Profile } from '../../features/profile/Profile'
import { Search }  from '../../features/search/Search'
import { router, usePage } from '@inertiajs/react'

import { useSelector, useDispatch } from 'react-redux'
import { loginSuccess, logoutSuccess } from '../../store/authSlice'

export function Layout({ children, componentName }) {
  const { props } = usePage()
  const [isCartOpen, setIsCartOpen]     = useState(false)
  const [isProfileOpen, setIsProfileOpen] = useState(false)
  const [isSearchOpen, setIsSearchOpen]   = useState(false)
  
  const dispatch = useDispatch()
  const { isAuthenticated } = useSelector((state) => state.auth)
  const [progressWidth, setProgressWidth] = useState('0%')
  const [progressOpacity, setProgressOpacity] = useState(0)

  const isDealerPortal = componentName?.startsWith('Dealer/') || window.location.pathname === '/dealer' || window.location.pathname.startsWith('/dealer/')
  const isBuilder = componentName === 'BuilderPage' || window.location.pathname.startsWith('/builder') || isDealerPortal

  // Listen to Inertia navigation events for custom progress bar
  useEffect(() => {
    let startTimer
    let finishTimer

    const startProgress = () => {
      clearTimeout(startTimer)
      clearTimeout(finishTimer)
      setProgressOpacity(1)
      setProgressWidth('0%')
      // Let it start animating slightly after resetting to 0%
      startTimer = setTimeout(() => {
        setProgressWidth('75%')
      }, 50)
    }

    const endProgress = () => {
      clearTimeout(startTimer)
      clearTimeout(finishTimer)
      setProgressWidth('100%')
      finishTimer = setTimeout(() => {
        setProgressOpacity(0)
        // Reset back to 0% after opacity animation finishes
        setTimeout(() => {
          setProgressWidth('0%')
        }, 300)
      }, 300)
    }

    const unregisterStart = router.on('start', startProgress)
    const unregisterFinish = router.on('finish', endProgress)
    const unregisterCancel = router.on('cancel', endProgress)

    return () => {
      clearTimeout(startTimer)
      clearTimeout(finishTimer)
      unregisterStart()
      unregisterFinish()
      unregisterCancel()
    }
  }, [])

  // Synchronize dynamic customer session attributes on mount/refresh
  useEffect(() => {
    if (props.auth?.user) {
      dispatch(loginSuccess(props.auth.user))
    } else {
      dispatch(logoutSuccess())
    }
  }, [props.auth, dispatch])

  // Sync scroll on route change
  useEffect(() => {
    window.scrollTo(0, 0)
    document.documentElement.scrollTop = 0
    document.body.scrollTop = 0
  }, [window.location.pathname])

  const handleProfileClick = () => {
    if (isAuthenticated) {
      setIsProfileOpen(true)
    } else {
      router.visit('/auth')
    }
  }

  return (
    <SmoothScroll>
      <div className="min-h-screen antialiased bg-white">
        
        {/* Custom Premium Top Loading Bar */}
        <div 
          className="fixed top-0 left-0 h-[3px] bg-gradient-to-r from-yellow-300 via-yellow-400 to-amber-500 z-[99999] pointer-events-none transition-all duration-300 ease-out"
          style={{
            width: progressWidth,
            opacity: progressOpacity,
          }}
        />

        {!isBuilder && (
          <Header
            onCartOpen={() => setIsCartOpen(true)}
            onProfileOpen={handleProfileClick}
            onSearchOpen={() => setIsSearchOpen(true)}
            onProductsOpen={() => router.visit('/products')}
            onHomeOpen={() => router.visit('/')}
            onAboutOpen={() => router.visit('/about')}
            onContactOpen={() => router.visit('/contact')}
            onBuilderOpen={() => router.visit('/builder')}
          />
        )}

        {/* Overlay Pages */}
        <Cart    isOpen={isCartOpen}    onClose={() => setIsCartOpen(false)} />
        <Profile 
          isOpen={isProfileOpen} 
          onClose={() => setIsProfileOpen(false)} 
          onLogout={() => { dispatch(logoutSuccess()); setIsProfileOpen(false); }}
        />
        <Search  isOpen={isSearchOpen}  onClose={() => setIsSearchOpen(false)} />

        {/* Dynamic page content */}
        <main>
          {children}
        </main>

        {!isBuilder && <Footer />}
      </div>
    </SmoothScroll>
  )
}

export default Layout
