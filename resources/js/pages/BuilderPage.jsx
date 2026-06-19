import React, { useEffect, useState, Suspense, lazy } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Navbar from '../features/builder/Navbar';

// Lazy load heavy components to split Three.js out of the main bundle
const Builder = lazy(() => import('../features/builder/Builder'));
const LandingPage = lazy(() => import('../features/builder/LandingPage'));
import { designs } from '../features/builder/data/designs';
import { 
  setSelectedDesign, 
  setPrimaryColor, setPrimaryIsGrad, setPrimaryColor2,
  setSecondaryColor, setSecondaryIsGrad, setSecondaryColor2,
  setThirdColor, setThirdIsGrad, setThirdColor2,
  setGlobalPattern, setLightingPreset, setMaterialFinish, setMouseFollow,
  incrementRefreshKey, setFromPage, loadSavedDesignData
} from '../features/builder/builderSlice';
import { getSavedDesign } from '../store/savedDesignSlice';
import { motion, AnimatePresence } from 'framer-motion';
import { router, usePage } from '@inertiajs/react';
import toast from 'react-hot-toast';

export const BuilderPage = ({ id, dynamicDesigns }) => {
  const currentId = id || (window.location.pathname.startsWith('/builder/') ? window.location.pathname.split('/').pop() : null);
  const dispatch = useDispatch();
  const { selectedDesign, refreshKey, fromPage, ...builderState } = useSelector((state) => state.builder);
  
  const { props: pageProps } = usePage();
  const { isAuthenticated } = useSelector((state) => state.auth);
  const isUserAuthenticated = isAuthenticated || !!pageProps.auth?.user || !!pageProps.auth?.dealer;

  const availableDesigns = dynamicDesigns || [];

  // Local transition state — only used for the brief GPU-clearing spinner
  const [isTransitioning, setIsTransitioning] = useState(false);

  // ── URL is the single source of truth ──
  // /builder       → landing page
  // /builder/:id   → 3D builder
  const isBuilderView = !!currentId;

  // Guest users are now allowed to access the builder freely.
  // Auth check happens only at checkout time (in Builder.jsx handleCheckoutClick).

  // Save fromPage to Redux once on first entry and persist in sessionStorage so it survives internal route changes
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const fromParam = urlParams.get('from');
    if (fromParam === 'dealer') {
      sessionStorage.setItem('builder_from_page', '/dealer/designs');
      dispatch(setFromPage('/dealer/designs'));
    } else if (fromParam) {
      sessionStorage.setItem('builder_from_page', '/' + fromParam);
      dispatch(setFromPage('/' + fromParam));
    } else {
      const persisted = sessionStorage.getItem('builder_from_page');
      if (persisted) {
        dispatch(setFromPage(persisted));
      } else {
        dispatch(setFromPage('/products'));
      }
    }
  }, [dispatch]);

  // Handle Global Reset for Colors
  useEffect(() => {
    const handleResetAllColors = () => {
      dispatch(setPrimaryColor('#ffffff'));
      dispatch(setPrimaryIsGrad(false));
      dispatch(setPrimaryColor2('#ffffff'));
      dispatch(setSecondaryColor('#ffffff'));
      dispatch(setSecondaryIsGrad(false));
      dispatch(setSecondaryColor2('#ffffff'));
      dispatch(setThirdColor('#ffffff'));
      dispatch(setThirdIsGrad(false));
      dispatch(setThirdColor2('#ffffff'));
    };
    window.addEventListener('eay:resetAll', handleResetAllColors);
    return () => window.removeEventListener('eay:resetAll', handleResetAllColors);
  }, [dispatch]);

  // Load the correct design whenever the URL :id changes
  useEffect(() => {
    if (currentId) {
      const decodedId = decodeURIComponent(currentId);
      const design = availableDesigns.find(d => d.id === decodedId || d.name.toUpperCase() === decodedId.toUpperCase());
      if (design) {
        dispatch(setSelectedDesign(design));
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentId, dispatch]);

  // Load saved design if present in the URL query string
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const savedId = urlParams.get('saved_id');
    if (savedId && currentId) {
      const toastId = toast.loading('Applying saved design customization...');
      
      dispatch(getSavedDesign(savedId))
        .unwrap()
        .then((data) => {
          if (data && data.design_data) {
            dispatch(loadSavedDesignData(data.design_data));
            toast.success(`Loaded saved design: "${data.name}"`, { id: toastId, icon: '🎨' });
          } else {
            toast.error(data.message || 'Failed to load saved customization.', { id: toastId });
          }
        })
        .catch(() => {
          toast.error('Failed to load saved design customization due to network error.', { id: toastId });
        });
    }
  }, [currentId, dispatch]);

  // Listen for custom model imports from the Navbar FILE menu
  useEffect(() => {
    const handleImport = (e) => {
      const url = e.detail;
      const customDesign = {
        id: 'custom-' + Date.now(),
        name: 'Imported Model',
        modelUrl: url,
        thumbnail: '',
        mapping: {
          'Body': 'primary', 'Front': 'primary', 'Back': 'primary',
          'R_Sleeve': 'secondary', 'L_Sleeve': 'secondary', 'Neck': 'third'
        }
      };
      dispatch(setSelectedDesign(customDesign));
      router.visit(`/builder/custom-${Date.now()}`);
    };
    window.addEventListener('eay:importModel', handleImport);
    return () => window.removeEventListener('eay:importModel', handleImport);
  }, [dispatch]);

  const handleSelectDesign = (design) => {
    // Allow all users (including guests) to enter the builder.
    // Auth is only required at checkout time.
    const urlParams = new URLSearchParams(window.location.search);
    const fromParam = urlParams.get('from');
    const query = fromParam ? `?from=${fromParam}` : '';
    router.visit(`/builder/${design.id}${query}`);
  };

  const handleBackToLanding = () => {
    // Show the GPU-clearing spinner for 200ms, then navigate back to /builder (landing)
    setIsTransitioning(true);
    dispatch(incrementRefreshKey());
    setTimeout(() => {
      setIsTransitioning(false);
      router.visit('/builder');
    }, 200);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className={`min-h-[100dvh] flex flex-col bg-white ${isBuilderView ? 'h-[100dvh] overflow-hidden' : ''}`}
    >
      <AnimatePresence mode="wait">

        {/* ── GPU Clearing Transition Spinner ── */}
        {isTransitioning && (
          <motion.div
            key="transition"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex-1 flex flex-col items-center justify-center bg-white py-40"
          >
            <div className="flex flex-col items-center gap-4">
              <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
              <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Clearing GPU Context...</span>
            </div>
          </motion.div>
        )}

        {/* ── Landing Page  (/builder, no id) ── */}
        {!isTransitioning && !isBuilderView && (
          <motion.div
            key="landing"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex-1 flex flex-col"
          >
            <Navbar onBack={null} backTo={fromPage} />
            <Suspense fallback={<div className="flex-1 flex items-center justify-center text-slate-400">Loading Designs...</div>}>
              <LandingPage
                availableDesigns={availableDesigns}
                {...builderState}
                setPrimaryColor={(val) => dispatch(setPrimaryColor(val))}
                setPrimaryIsGrad={(val) => dispatch(setPrimaryIsGrad(val))}
                setPrimaryColor2={(val) => dispatch(setPrimaryColor2(val))}
                setSecondaryColor={(val) => dispatch(setSecondaryColor(val))}
                setSecondaryIsGrad={(val) => dispatch(setSecondaryIsGrad(val))}
                setSecondaryColor2={(val) => dispatch(setSecondaryColor2(val))}
                setThirdColor={(val) => dispatch(setThirdColor(val))}
                setThirdIsGrad={(val) => dispatch(setThirdIsGrad(val))}
                setThirdColor2={(val) => dispatch(setThirdColor2(val))}
                setGlobalPattern={(val) => dispatch(setGlobalPattern(val))}
                setLightingPreset={(val) => dispatch(setLightingPreset(val))}
                setMaterialFinish={(val) => dispatch(setMaterialFinish(val))}
                setMouseFollow={(val) => dispatch(setMouseFollow(val))}
                onSelectDesign={handleSelectDesign}
              />
            </Suspense>
          </motion.div>
        )}

        {/* ── 3D Builder  (/builder/:id) ── */}
        {!isTransitioning && isBuilderView && (
          <motion.div
            key={`builder-${refreshKey}`}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="flex-1 flex flex-col h-full min-h-0 overflow-hidden"
          >
            <Navbar onBack={handleBackToLanding} backTo={fromPage} />
            <div className="flex-1 overflow-hidden">
              <Suspense fallback={<div className="w-full h-full flex flex-col items-center justify-center text-slate-400 gap-4"><div className="w-10 h-10 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>Loading 3D Engine...</div>}>
                <Builder />
              </Suspense>
            </div>
          </motion.div>
        )}

      </AnimatePresence>
    </motion.div>
  );
};
