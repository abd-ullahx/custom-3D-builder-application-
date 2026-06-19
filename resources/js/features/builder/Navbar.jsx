import React, { useState, useRef, useEffect } from 'react';
import { Link, router } from '@inertiajs/react';
import { HiOutlineFolderOpen, HiOutlineSaveAs, HiOutlineDownload, HiOutlineCubeTransparent, HiOutlineArrowLeft } from 'react-icons/hi';
import { VscHistory, VscEdit } from 'react-icons/vsc';

const Navbar = ({ onBack, backTo }) => {
  const [activeMenu, setActiveMenu] = useState(null);
  const barRef = useRef(null);

  useEffect(() => {
    const handler = (e) => {
      if (barRef.current && !barRef.current.contains(e.target)) {
        setActiveMenu(null);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  let menuData = [
    {
      label: 'File',
      items: [
        {
          label: 'Import Model (.glb)', icon: <HiOutlineCubeTransparent />, action: () => {
            const input = document.createElement('input');
            input.type = 'file';
            input.accept = '.glb,.gltf';
            input.onchange = (e) => {
              const file = e.target.files[0];
              if (file) {
                const url = URL.createObjectURL(file);
                window.dispatchEvent(new CustomEvent('eay:importModel', { detail: url }));
              }
            };
            input.click();
          }
        },
        { label: 'Save Design', icon: <HiOutlineSaveAs />, action: () => window.dispatchEvent(new CustomEvent('eay:save')) },
        { label: 'Export PNG', icon: <HiOutlineDownload />, action: () => window.dispatchEvent(new CustomEvent('eay:export')) },
      ]
    },
    {
      label: 'Edit',
      items: [
        { label: 'Clear Colors', icon: <VscHistory />, action: () => window.dispatchEvent(new CustomEvent('eay:resetAll')) },
      ]
    },
    {
        label: 'View',
        items: [
          { label: 'Toggle HUD', action: () => window.dispatchEvent(new CustomEvent('eay:toggleHUD')) },
        ]
    }
  ];

  const isLandingPage = !window.location.pathname.includes('/builder/');
  
  if (isLandingPage) {
    menuData = menuData.filter(m => m.label !== 'File' && m.label !== 'View');
  }

  // Helper to determine where the Exit button should go
  const handleExit = () => {
    const persistedFrom = sessionStorage.getItem('builder_from_page');
    if (persistedFrom === '/dealer/designs') {
      // Clear storage after exit to prevent sticky redirects in other sessions
      sessionStorage.removeItem('builder_from_page');
      router.visit('/dealer/designs');
      return;
    }

    if (onBack) {
      onBack();
    } else {
      router.visit(backTo || '/');
    }
  };

  return (
    <div
      ref={barRef}
      className="w-full h-9 bg-white border-b border-gray-200 flex items-stretch select-none z-[70] flex-shrink-0 relative"
      style={{ fontFamily: "'Outfit', sans-serif" }}
    >
      {/* ── Navigation / Exit Logic (Always Shown) ── */}
      <div className="flex items-stretch border-r border-gray-100">
         <button 
           onClick={handleExit}
           className="px-4 flex items-center gap-2 hover:bg-gray-100 transition-colors border-r border-gray-100 group"
           title={onBack ? "Return to Library" : "Exit to Store"}
         >
            <HiOutlineArrowLeft className="text-gray-400 group-hover:text-blue-600 transition-colors" size={14} />
            <span className="text-[10px] font-bold text-gray-500 group-hover:text-gray-900 uppercase tracking-tighter">Exit</span>
         </button>
      </div>

      {/* ── VS Code Style Logo & Branding ── */}
      <div className="flex items-center px-4 gap-4 border-r border-gray-100 bg-gray-50/10">
        <div className="flex items-center gap-2.5">
           <Link href="/" className="w-4 h-4 bg-blue-600 flex items-center justify-center hover:scale-110 transition-transform flex-shrink-0">
             <span className="text-white font-bold text-[9px]">E</span>
           </Link>
           <span className="hidden sm:inline text-[10px] font-bold text-gray-900 uppercase tracking-[0.1em] whitespace-nowrap">
             Elite <span className="text-blue-600">Studio</span>
           </span>
        </div>
      </div>

      {/* ── Editor Menu Bar ── */}
      <div className="flex items-stretch">
        {menuData.map((menu) => (
          <div key={menu.label} className="relative flex items-stretch">
            <button
              className={`px-3 h-full text-[10px] font-medium tracking-wide flex items-center gap-1.5 transition-colors outline-none
                ${activeMenu === menu.label ? 'bg-gray-100 text-blue-600' : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'}`}
              onClick={() => setActiveMenu(prev => prev === menu.label ? null : menu.label)}
              onMouseEnter={() => activeMenu && setActiveMenu(menu.label)}
            >
              {menu.label}
            </button>

            {activeMenu === menu.label && (
              <div className="absolute top-full left-0 mt-0 w-max min-w-[220px] bg-white border border-gray-200 shadow-xl z-50 py-1 animate-in fade-in slide-in-from-top-1 duration-100">
                {menu.items.map((item, i) => (
                  <button
                    key={i}
                    onClick={() => { item.action?.(); setActiveMenu(null); }}
                    className="w-full text-left px-4 py-2 text-[10px] font-medium text-gray-700 hover:bg-blue-600 hover:text-white flex items-center justify-between group transition-colors duration-75"
                  >
                    <div className="flex items-center gap-3">
                      {item.icon && <span className="text-xs opacity-60 group-hover:opacity-100">{item.icon}</span>}
                      <span className="tracking-wide whitespace-nowrap">{item.label}</span>
                    </div>
                    <span className="text-[8px] opacity-40 group-hover:opacity-60 ml-8 tracking-tighter">
                       {menu.label === 'File' && i === 1 ? 'CTRL+S' : ''}
                       {menu.label === 'Edit' && i === 0 ? 'CTRL+R' : ''}
                    </span>
                  </button>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* ── Active File / Project Name Indicator ── */}
      <div className="hidden md:flex flex-1 items-center justify-center pointer-events-none">
         <div className="px-3 py-0.5 bg-gray-50 border border-gray-100 rounded-none flex items-center gap-2">
            <span className="text-[8px] font-bold text-gray-400 uppercase tracking-[0.2em]">Active Workspace:</span>
            <span className="text-[9px] font-semibold text-gray-700 uppercase tracking-widest">
               {window.location.pathname.includes('/builder/') ? 'Jersey_Library_Context' : 'Studio_Entry_Context'}
            </span>
         </div>
      </div>

      {/* ── System Status ── */}
      <div className="ml-auto flex items-center gap-3 px-4">
        <div className="hidden lg:flex items-center gap-3">
          <div className="flex flex-col items-end leading-none">
            <span className="text-[7px] font-bold text-gray-300 uppercase tracking-[0.2em]">Build</span>
            <span className="text-[8px] font-semibold text-gray-500 tracking-wider">v1.0.4-PRO</span>
          </div>
          <div className="flex items-center gap-1.5 px-2 py-0.5 bg-green-50 border border-green-100">
            <div className="w-1 h-1 rounded-none bg-green-500 animate-pulse" />
            <span className="text-[8px] font-bold text-green-600 uppercase">Live</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
