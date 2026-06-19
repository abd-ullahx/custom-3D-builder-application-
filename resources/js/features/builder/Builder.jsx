import React, { useEffect, useState, memo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { router, usePage } from '@inertiajs/react';
import toast from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';
import LeftPanel from './LeftPanel';
import RightPanel from './RightPanel';
import {
  setMeshes,
  setActiveMesh,
  updateMeshStates,
  updateMeshProp,
  addDecal,
  updateDecal,
  removeDecal,
  setSelectedDecalId,
  setRoster,
  setGlobalPattern,
  setLightingPreset,
  setMaterialFinish,
  setMouseFollow,
  setView,
  loadSavedDesignData
} from './builderSlice';
import { saveDesign } from '../../store/savedDesignSlice';

// ── Helper: Convert blob URLs to base64 data URLs for localStorage persistence ──
const blobToDataUrl = (blobUrl) => {
  return new Promise((resolve) => {
    // Only convert blob: URLs; leave external URLs and data: URLs as-is
    if (!blobUrl || !blobUrl.startsWith('blob:')) {
      resolve(blobUrl);
      return;
    }
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      canvas.width = img.naturalWidth || img.width;
      canvas.height = img.naturalHeight || img.height;
      ctx.drawImage(img, 0, 0);
      try {
        resolve(canvas.toDataURL('image/png'));
      } catch {
        resolve(blobUrl); // Fallback if conversion fails
      }
    };
    img.onerror = () => resolve(blobUrl);
    img.src = blobUrl;
  });
};

const convertDesignForStorage = async (designData) => {
  const { decals, meshStates, ...rest } = designData;

  // Convert blob URLs in decals (logos, patterns)
  const convertedDecals = await Promise.all(
    (decals || []).map(async (d) => {
      if (d.imageUrl && d.imageUrl.startsWith('blob:')) {
        const dataUrl = await blobToDataUrl(d.imageUrl);
        return { ...d, imageUrl: dataUrl };
      }
      return d;
    })
  );

  // Convert blob URLs in meshStates (per-mesh pattern URLs)
  const convertedMeshStates = {};
  for (const [meshId, state] of Object.entries(meshStates || {})) {
    if (state.pUrl && state.pUrl.startsWith('blob:')) {
      const dataUrl = await blobToDataUrl(state.pUrl);
      convertedMeshStates[meshId] = { ...state, pUrl: dataUrl };
    } else {
      convertedMeshStates[meshId] = state;
    }
  }

  return { ...rest, decals: convertedDecals, meshStates: convertedMeshStates };
};

const Builder = memo(() => {
  const dispatch = useDispatch();
  const { props: pageProps } = usePage();
  const [isHUDVisible, setIsHUDVisible] = useState(true);
  const [saveModalOpen, setSaveModalOpen] = useState(false);
  const [saveName, setSaveName] = useState('');
  
  // Checkout Form States
  const [checkoutModalOpen, setCheckoutModalOpen] = useState(false);
  const [billingName, setBillingName] = useState('');
  const [billingEmail, setBillingEmail] = useState('');
  const [shippingAddress, setShippingAddress] = useState('');
  const [contactPhone, setContactPhone] = useState('');
  const [city, setCity] = useState('');
  const [zipCode, setZipCode] = useState('');
  const [country, setCountry] = useState('USA');
  const [isSubmitCheckingOut, setIsSubmitCheckingOut] = useState(false);

  const { isAuthenticated } = useSelector((state) => state.auth);
  const isUserAuthenticated = isAuthenticated || !!pageProps.auth?.user || !!pageProps.auth?.dealer;
  const currentUser = pageProps.auth?.user;
  const isDealer = currentUser?.role === 'dealer';
  
  const {
    selectedDesign: design,
    primaryColor, primaryIsGrad, primaryColor2,
    secondaryColor, secondaryIsGrad, secondaryColor2,
    thirdColor, thirdIsGrad, thirdColor2,
    globalPattern, lightingPreset, materialFinish, mouseFollow,
    meshes, activeMesh, meshStates, decals, selectedDecalId, roster
  } = useSelector((state) => state.builder);

  const meshStatesRef = React.useRef(meshStates);
  const pendingDesignRef = React.useRef(null); // Holds parsed pending design data until meshes load
  useEffect(() => {
    meshStatesRef.current = meshStates;
  }, [meshStates]);

  const initialColors = {
    primary: { color: primaryColor, isGrad: primaryIsGrad, color2: primaryColor2 },
    secondary: { color: secondaryColor, isGrad: secondaryIsGrad, color2: secondaryColor2 },
    third: { color: thirdColor, isGrad: thirdIsGrad, color2: thirdColor2 }
  };

  // Handle Navbar Events
  useEffect(() => {
    const handleResetAll = () => {
      const resetStates = {};
      Object.keys(meshStates).forEach(meshId => {
        const m = meshes.find(mesh => mesh.id === meshId);
        if (m) {
          let type = 'Body';
          if (m.display.includes('Neck')) type = 'Neck';
          else if (m.display.includes('Sleeve')) type = m.display.includes('R') ? 'R_Sleeve' : 'L_Sleeve';
          else if (m.display.includes('Front')) type = 'Front';
          else if (m.display.includes('Back')) type = 'Back';

          resetStates[meshId] = {
            color: '#ffffff',
            isGrad: false,
            grad1: '#ffffff',
            grad2: '#ffffff',
            pColor: '#ffffff',
            pUrl: null
          };
        }
      });
      dispatch(updateMeshStates(resetStates));
      window.dispatchEvent(new CustomEvent('eay:resetCamera'));
    };

    const handleSave = async () => {
      if (!isUserAuthenticated) {
        toast.error('Please sign in to save your custom design!', { icon: '🔐' })
        const toastId = toast.loading('Preparing design for save...');
        const converted = await convertDesignForStorage({
          designId: design.id,
          meshStates,
          decals,
          globalPattern,
          lightingPreset,
          materialFinish,
          roster,
          autoOpenSave: true,
        });
        localStorage.setItem('pending_checkout_design', JSON.stringify(converted));
        toast.dismiss(toastId);
        router.visit('/auth')
        return
      }

      setSaveName(design.name || "My Custom Design");
      setSaveModalOpen(true);
    };

    const handleToggleHUD = () => {
      setIsHUDVisible(prev => !prev);
    };

    window.addEventListener('eay:resetAll', handleResetAll);
    window.addEventListener('eay:save', handleSave);
    window.addEventListener('eay:toggleHUD', handleToggleHUD);
    
    return () => {
      window.removeEventListener('eay:resetAll', handleResetAll);
      window.removeEventListener('eay:save', handleSave);
      window.removeEventListener('eay:toggleHUD', handleToggleHUD);
    };
  }, [dispatch, meshStates, meshes, design, initialColors, globalPattern, materialFinish, lightingPreset, isUserAuthenticated, decals, roster]);

  // Restore design custom state from guest checkout/save auth redirect if present
  useEffect(() => {
    const pending = localStorage.getItem('pending_checkout_design');
    console.log('[Pending Checkout Design Check]', {
      hasPending: !!pending,
      designId: design?.id
    });
    if (pending) {
      try {
        const parsed = JSON.parse(pending);
        console.log('[Pending Checkout Design Details]', {
          parsedId: parsed?.designId,
          activeId: design?.id,
          matched: parsed?.designId === design?.id
        });
        if (parsed && parsed.designId === design.id) {
          // Store parsed data in ref so handleMeshesDetected can apply it
          // after the 3D model loads (prevents race condition)
          pendingDesignRef.current = parsed;

          // Apply non-mesh design data immediately (these don't depend on mesh detection)
          dispatch(loadSavedDesignData({
            meshStates: parsed.meshStates,
            decals: parsed.decals,
            globalPattern: parsed.globalPattern,
            materialFinish: parsed.materialFinish,
            lightingPreset: parsed.lightingPreset,
            roster: parsed.roster,
          }));

          // Update the ref immediately so handleMeshesDetected sees the restored states
          if (parsed.meshStates) {
            meshStatesRef.current = parsed.meshStates;
          }

          toast.success('Restored your custom design!', { icon: '🎨' });

          if (parsed.autoOpenCheckout) {
            // Delay opening checkout modal until meshes are loaded
            setTimeout(() => setCheckoutModalOpen(true), 500);
          } else if (parsed.autoOpenSave) {
            setSaveName(design.name || "My Custom Design");
            setTimeout(() => setSaveModalOpen(true), 500);
          }

          localStorage.removeItem('pending_checkout_design');
        } else {
          console.warn('[Pending Checkout Design Mismatch] Design ID in storage does not match active design.');
        }
      } catch (e) {
        console.error('Failed to load pending guest checkout design:', e);
        localStorage.removeItem('pending_checkout_design');
      }
    }
  }, [design?.id, dispatch]);

  const handleMeshesDetected = (meshList) => {
    dispatch(setMeshes(meshList));
    if (meshList.length > 0 && !activeMesh) {
      dispatch(setActiveMesh(meshList[0].id));
    }

    // If a pending design was restored from localStorage, re-apply ALL design data
    // AFTER mesh detection to ensure they aren't overwritten by defaults.
    const pendingData = pendingDesignRef.current;
    if (pendingData) {
      console.log('[Pending Design] Applying full restored design after mesh detection');
      
      // Re-apply the complete design state (meshStates, decals, patterns, etc.)
      dispatch(loadSavedDesignData({
        meshStates: pendingData.meshStates,
        decals: pendingData.decals,
        globalPattern: pendingData.globalPattern,
        materialFinish: pendingData.materialFinish,
        lightingPreset: pendingData.lightingPreset,
        roster: pendingData.roster,
      }));
      
      if (pendingData.meshStates) {
        meshStatesRef.current = { ...meshStatesRef.current, ...pendingData.meshStates };
      }
      pendingDesignRef.current = null; // Clear after applying
      return; // Skip default color initialization
    }

    const nextStates = {};
    meshList.forEach(m => {
      if (!meshStatesRef.current[m.id]) {
        let type = 'Body';
        if (m.display.includes('Neck')) type = 'Neck';
        else if (m.display.includes('Sleeve')) type = m.display.includes('R') ? 'R_Sleeve' : 'L_Sleeve';
        else if (m.display.includes('Front')) type = 'Front';
        else if (m.display.includes('Back')) type = 'Back';

        const colorKey = design.mapping[type] || design.mapping['Body'] || 'primary';
        const config = initialColors[colorKey];

        nextStates[m.id] = {
          color: config.color,
          isGrad: config.isGrad,
          grad1: config.color2,
          grad2: config.color,
          pColor: '#ffffff',
          pUrl: null
        };
      }
    });

    if (Object.keys(nextStates).length > 0) {
      dispatch(updateMeshStates(nextStates));
    }
  };

  const confirmSave = () => {
    if (!saveName.trim()) {
      toast.error('Please enter a valid name for your design.');
      return;
    }
    
    setSaveModalOpen(false);
    const toastId = toast.loading('Saving custom design to your profile...')

    dispatch(saveDesign({
      name: saveName.trim(),
      model_name: design.name || 'jersey',
      design_data: { meshStates, decals, globalPattern, materialFinish, lightingPreset },
      thumbnail: design.thumbnail || 'https://images.unsplash.com/photo-1551280857-2b9bbe52acf4?w=600&h=400&fit=crop&q=80'
    }))
      .unwrap()
      .then((data) => {
        toast.success(data.message || 'Design saved successfully!', { id: toastId, icon: '🎨' })
      })
      .catch((err) => {
        toast.error(err || 'Failed to save design. Please try again.', { id: toastId })
      })
  };

  const handleCheckoutClick = async () => {
    if (!isUserAuthenticated) {
      toast.error('Please sign in to complete checkout!', { icon: '🔐' });
      const toastId = toast.loading('Preparing design...');
      const converted = await convertDesignForStorage({
        designId: design.id,
        meshStates,
        decals,
        globalPattern,
        lightingPreset,
        materialFinish,
        roster,
        autoOpenCheckout: true,
      });
      localStorage.setItem('pending_checkout_design', JSON.stringify(converted));
      toast.dismiss(toastId);
      router.visit('/auth');
      return;
    }
    if (currentUser) {
      if (currentUser.name) setBillingName(currentUser.name);
      if (currentUser.email) setBillingEmail(currentUser.email);
      if (currentUser.phone) setContactPhone(currentUser.phone);
      if (currentUser.address) setShippingAddress(currentUser.address);
      if (currentUser.city) setCity(currentUser.city);
      if (currentUser.zip_code) setZipCode(currentUser.zip_code);
    }
    setCheckoutModalOpen(true);
  };

  const confirmCheckout = (e) => {
    if (e) e.preventDefault();

    if (!billingName.trim()) {
      toast.error('Please enter your full name.');
      return;
    }
    if (!billingEmail.trim()) {
      toast.error('Please enter your email address.');
      return;
    }
    if (!shippingAddress.trim()) {
      toast.error('Please enter your shipping address.');
      return;
    }
    if (!contactPhone.trim()) {
      toast.error('Please enter your phone number.');
      return;
    }
    if (!city.trim()) {
      toast.error('Please enter your city.');
      return;
    }
    if (!zipCode.trim()) {
      toast.error('Please enter your ZIP / postal code.');
      return;
    }

    setIsSubmitCheckingOut(true);
    const toastId = toast.loading('Processing order...');

    const itemPrice = 59.00;
    const subtotal = roster.length * itemPrice;
    const shipping = 0.00;
    const tax = subtotal * 0.08;
    const total = subtotal + shipping + tax;

    const checkoutData = {
      items: roster.map(r => ({
        name: design.name || 'Custom Jersey',
        price: itemPrice,
        qty: 1,
        size: r.size,
        customName: r.name,
        customNumber: r.number,
        image: design.thumbnail || 'https://images.unsplash.com/photo-1551280857-2b9bbe52acf4?w=600&h=400&fit=crop&q=80'
      })),
      billing_name: billingName,
      billing_email: billingEmail,
      subtotal,
      shipping,
      tax,
      total,
      shipping_address: shippingAddress,
      phone: contactPhone,
      city: city,
      zip_code: zipCode,
      country: country || 'USA',
      payment_method: 'Cash on Delivery',
      design_data: { meshStates, decals, globalPattern, materialFinish, lightingPreset },
      model_name: design.name || 'jersey',
      thumbnail: design.thumbnail || 'https://images.unsplash.com/photo-1551280857-2b9bbe52acf4?w=600&h=400&fit=crop&q=80'
    };

    fetch('/api/orders/checkout', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || ''
      },
      body: JSON.stringify(checkoutData)
    })
      .then(res => res.json())
      .then(data => {
        setIsSubmitCheckingOut(false);
        if (data.success) {
          toast.success(data.message || 'Order placed successfully!', { id: toastId, icon: '🎉' });
          setCheckoutModalOpen(false);
          dispatch(setRoster([{ id: Date.now(), name: '', number: '', size: 'L' }]));
          if (isDealer) {
            router.visit('/dealer/orders');
          } else {
            router.visit('/');
          }
        } else {
          toast.error(data.message || 'Failed to place order.', { id: toastId });
        }
      })
      .catch(err => {
        setIsSubmitCheckingOut(false);
        toast.error('An error occurred. Please try again.', { id: toastId });
      });
  };

  if (!design) return <div className="p-20 text-center font-bold text-gray-400">Loading Design...</div>;

  return (
    <div className="flex-1 flex flex-col md:flex-row bg-white relative h-full min-h-0 overflow-hidden" style={{ minWidth: 0 }}>
      {/* ── Left Viewport & Component Dock ── */}
      <div className="flex-1 min-h-[350px] md:min-h-0 min-w-0 overflow-hidden">
        <LeftPanel
          modelUrl={design.modelUrl}
          meshes={meshes}
          activeMesh={activeMesh}
          setActiveMesh={(id) => dispatch(setActiveMesh(id))}
          meshStates={meshStates}
          onMeshesDetected={handleMeshesDetected}
          decals={decals}
          selectedDecalId={selectedDecalId}
          setSelectedDecalId={(id) => dispatch(setSelectedDecalId(id))}
          updateDecal={(id, updates) => dispatch(updateDecal({ id, updates }))}
          removeDecal={(id) => dispatch(removeDecal(id))}
          globalPattern={globalPattern}
          materialFinish={materialFinish}
          lightingPreset={lightingPreset}
          mouseFollow={mouseFollow}
          isHUDVisible={isHUDVisible}
        />
      </div>

      {/* ── Right Panel (Workstation) ── */}
      <div className={`transition-all duration-500 ease-in-out border-l border-gray-100 bg-white flex-shrink-0
        ${isHUDVisible ? 'w-full md:w-[420px] flex-1 md:flex-none md:h-full opacity-100' : 'w-0 h-0 opacity-0 translate-x-full overflow-hidden border-none'}`}>
        <RightPanel
          activeMesh={activeMesh}
          meshStates={meshStates}
          updateMeshProp={(meshId, prop, val) => dispatch(updateMeshProp({ meshId, prop, val }))}
          decals={decals}
          selectedDecalId={selectedDecalId}
          setSelectedDecalId={(id) => dispatch(setSelectedDecalId(id))}
          addDecal={(type, text, imageUrl) => dispatch(addDecal({ type, text, imageUrl }))}
          updateDecal={(id, updates) => dispatch(updateDecal({ id, updates }))}
          removeDecal={(id) => dispatch(removeDecal(id))}
          globalPattern={globalPattern}
          setGlobalPattern={(val) => dispatch(setGlobalPattern(val))}
          lightingPreset={lightingPreset}
          setLightingPreset={(val) => dispatch(setLightingPreset(val))}
          materialFinish={materialFinish}
          setMaterialFinish={(val) => dispatch(setMaterialFinish(val))}
          mouseFollow={mouseFollow}
          setMouseFollow={(val) => dispatch(setMouseFollow(val))}
          roster={roster}
          setRoster={(val) => dispatch(setRoster(val))}
          onCheckout={handleCheckoutClick}
        />
      </div>

      {/* Cinematic View Helper */}
      {!isHUDVisible && (
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 pointer-events-none fade-up flex flex-col items-center">
           <span className="text-[8px] font-semibold text-gray-400 uppercase tracking-[1em] mb-1">Cinematic Mode</span>
           <div className="w-12 h-0.5 bg-blue-600/30" />
        </div>
      )}

      {/* Save Modal */}
      <AnimatePresence>
        {saveModalOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSaveModalOpen(false)}
              className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[200]"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-md bg-white rounded-2xl shadow-2xl z-[201] overflow-hidden"
            >
              <div className="p-7">
                <h3 className="text-xl font-bold text-slate-800 mb-2 tracking-tight">Save Custom Design</h3>
                <p className="text-sm text-slate-500 mb-6 font-medium">Enter a name for your design so you can easily find it later in your portfolio.</p>
                
                <input
                  type="text"
                  value={saveName}
                  onChange={(e) => setSaveName(e.target.value)}
                  placeholder="e.g. Home Kit 2026"
                  className="w-full px-4 py-3.5 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#4F46E5]/20 focus:border-[#4F46E5] transition-all mb-8 font-medium text-slate-800"
                  autoFocus
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') confirmSave();
                    if (e.key === 'Escape') setSaveModalOpen(false);
                  }}
                />
                
                <div className="flex gap-3 justify-end">
                  <button
                    onClick={() => setSaveModalOpen(false)}
                    className="px-5 py-2.5 rounded-xl font-semibold text-slate-500 hover:bg-gray-100 hover:text-slate-800 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={confirmSave}
                    className="px-6 py-2.5 rounded-xl font-semibold bg-[#4F46E5] text-white hover:bg-[#4338ca] shadow-lg shadow-indigo-200 hover:shadow-xl transition-all"
                  >
                    Save to Portfolio
                  </button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Roster Checkout Modal */}
      <AnimatePresence>
        {checkoutModalOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => !isSubmitCheckingOut && setCheckoutModalOpen(false)}
              className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[200]"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-lg bg-white rounded-2xl shadow-2xl z-[201] overflow-hidden"
            >
              <form onSubmit={confirmCheckout} className="flex flex-col max-h-[85vh]">
                {/* Header */}
                <div className="px-6 py-5 border-b border-gray-100 flex items-center justify-between">
                  <div>
                    <h3 className="text-xl font-bold text-slate-800 tracking-tight">Roster Checkout</h3>
                    <p className="text-xs text-slate-400 mt-1 font-medium">Complete your wholesale / customized order details below.</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setCheckoutModalOpen(false)}
                    className="text-gray-400 hover:text-slate-600 transition-colors"
                    disabled={isSubmitCheckingOut}
                  >
                    ✕
                  </button>
                </div>

                {/* Body */}
                <div className="p-6 overflow-y-auto space-y-5 flex-1 custom-scrollbar">
                  
                  {/* Order Summary Summary */}
                  <div className="bg-slate-50 border border-gray-100 p-4 rounded-xl flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-white border border-gray-200 rounded-lg overflow-hidden shrink-0 flex items-center justify-center">
                        <img 
                          src={design.thumbnail || 'https://images.unsplash.com/photo-1551280857-2b9bbe52acf4?w=600&h=400&fit=crop&q=80'} 
                          alt="Custom design" 
                          className="w-full h-full object-cover" 
                        />
                      </div>
                      <div>
                        <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wide">{design.name || 'Custom Jersey'}</h4>
                        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mt-0.5">{roster.length} jerseys in roster</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Estimated Total</p>
                      <p className="text-sm font-extrabold text-blue-600">${(roster.length * 59.00).toFixed(2)}</p>
                    </div>
                  </div>

                  {/* Full Name & Email */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex flex-col gap-1.5">
                      <label htmlFor="checkout-name" className="text-[10px] font-black text-slate-500 uppercase tracking-wider">
                        Full Name <span className="text-red-500">*</span>
                      </label>
                      <input
                        id="checkout-name"
                        type="text"
                        required
                        placeholder="John Doe"
                        value={billingName}
                        onChange={(e) => setBillingName(e.target.value)}
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-100 transition-all font-medium text-slate-800 text-sm"
                        disabled={isSubmitCheckingOut}
                      />
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <label htmlFor="checkout-email" className="text-[10px] font-black text-slate-500 uppercase tracking-wider">
                        Email <span className="text-red-500">*</span>
                      </label>
                      <input
                        id="checkout-email"
                        type="email"
                        required
                        placeholder="you@example.com"
                        value={billingEmail}
                        onChange={(e) => setBillingEmail(e.target.value)}
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-100 transition-all font-medium text-slate-800 text-sm"
                        disabled={isSubmitCheckingOut}
                      />
                    </div>
                  </div>

                  {/* Delivery Address */}
                  <div className="flex flex-col gap-1.5">
                    <label htmlFor="checkout-address" className="text-[10px] font-black text-slate-500 uppercase tracking-wider">
                      Shipping Address <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      id="checkout-address"
                      rows="2.5"
                      required
                      maxLength={350}
                      placeholder="Street address, apartment, suite..."
                      value={shippingAddress}
                      onChange={(e) => setShippingAddress(e.target.value.slice(0, 350))}
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-100 transition-all font-medium text-slate-800 text-sm"
                      disabled={isSubmitCheckingOut}
                    />
                  </div>

                  {/* Phone Number */}
                  <div className="flex flex-col gap-1.5">
                    <label htmlFor="checkout-phone" className="text-[10px] font-black text-slate-500 uppercase tracking-wider">
                      Phone Number <span className="text-red-500">*</span>
                    </label>
                    <input
                      id="checkout-phone"
                      type="tel"
                      required
                      placeholder="e.g. +1 555-123-4567"
                      value={contactPhone}
                      onChange={(e) => setContactPhone(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-100 transition-all font-medium text-slate-800 text-sm"
                      disabled={isSubmitCheckingOut}
                    />
                  </div>

                  {/* City, ZIP, Country */}
                  <div className="grid grid-cols-3 gap-4">
                    <div className="flex flex-col gap-1.5">
                      <label htmlFor="checkout-city" className="text-[10px] font-black text-slate-500 uppercase tracking-wider">
                        City <span className="text-red-500">*</span>
                      </label>
                      <input
                        id="checkout-city"
                        type="text"
                        required
                        placeholder="City"
                        value={city}
                        onChange={(e) => setCity(e.target.value)}
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-100 transition-all font-medium text-slate-800 text-sm"
                        disabled={isSubmitCheckingOut}
                      />
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <label htmlFor="checkout-zip" className="text-[10px] font-black text-slate-500 uppercase tracking-wider">
                        ZIP Code <span className="text-red-500">*</span>
                      </label>
                      <input
                        id="checkout-zip"
                        type="text"
                        required
                        placeholder="10001"
                        value={zipCode}
                        onChange={(e) => setZipCode(e.target.value)}
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-100 transition-all font-medium text-slate-800 text-sm"
                        disabled={isSubmitCheckingOut}
                      />
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <label htmlFor="checkout-country" className="text-[10px] font-black text-slate-500 uppercase tracking-wider">
                        Country
                      </label>
                      <input
                        id="checkout-country"
                        type="text"
                        required
                        placeholder="USA"
                        value={country}
                        onChange={(e) => setCountry(e.target.value)}
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-100 transition-all font-medium text-slate-800 text-sm"
                        disabled={isSubmitCheckingOut}
                      />
                    </div>
                  </div>

                  {/* Payment Method Badge */}
                  <div className="bg-emerald-50/50 border border-emerald-100/50 p-4 rounded-xl flex items-center justify-between">
                    <div>
                      <h4 className="text-[10px] font-bold text-emerald-950 uppercase tracking-wide">Payment Option</h4>
                      <p className="text-[9px] text-emerald-700/80 font-semibold mt-0.5">Cash on Delivery (Standard)</p>
                    </div>
                    <span className="text-[8px] bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded font-black uppercase tracking-wider">COD</span>
                  </div>
                </div>

                {/* Footer */}
                <div className="px-6 py-4 bg-gray-50 border-t border-gray-100 flex gap-3 justify-end">
                  <button
                    type="button"
                    onClick={() => setCheckoutModalOpen(false)}
                    className="px-5 py-2.5 rounded-xl font-semibold text-slate-500 hover:bg-gray-200 transition-colors"
                    disabled={isSubmitCheckingOut}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2.5 rounded-xl font-semibold bg-blue-600 text-white hover:bg-blue-700 shadow-lg shadow-blue-200 hover:shadow-xl transition-all disabled:opacity-50"
                    disabled={isSubmitCheckingOut}
                  >
                    {isSubmitCheckingOut ? 'Processing Order...' : `Place Order ($${((roster.length * 59.00) * 1.08).toFixed(2)})`}
                  </button>
                </div>
              </form>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
});

export default Builder;
