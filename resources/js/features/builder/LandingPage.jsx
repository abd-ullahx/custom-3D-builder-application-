import React, { useState } from 'react';
import { colors, designs } from './data/designs';
import DesignPreview from './DesignPreview';
import { HiArrowRight, HiViewGrid, HiOutlineCube, HiOutlineLightningBolt, HiOutlineColorSwatch, HiOutlineCursorClick, HiOutlineX } from 'react-icons/hi';
import { VscSymbolColor } from 'react-icons/vsc';

const ColorGrid = ({ label, selected, onSelect, isGrad, onToggleGrad, selected2, onSelect2 }) => (
  <div className="flex flex-col gap-4 sm:p-6 p-4 sm:p-6 bg-white rounded-none border border-gray-900 hover:shadow-[0_20px_40px_rgba(0,0,0,0.05)] transition-all group h-full">
    <div className="flex flex-col gap-4 border-b border-gray-100 pb-4">
      <div className="flex flex-col gap-1">
        <h3 className="text-[11px] font-black text-gray-900 uppercase tracking-[0.3em]">{label}</h3>
        <div className="flex items-center gap-2">
          <div className="w-1.5 h-1.5 bg-gray-900" />
          <span className="text-[8px] font-bold text-gray-400 uppercase tracking-widest">{isGrad ? 'Dual Tone Map' : 'Monochrome Tone'}</span>
        </div>
      </div>
      <div className="flex border border-gray-900 p-0.5 bg-gray-50 rounded-none w-fit">
        <button onClick={() => isGrad && onToggleGrad()} className={`px-4 py-1.5 rounded-none text-[8px] font-black uppercase tracking-widest transition-all ${!isGrad ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/20' : 'text-gray-400 hover:text-gray-900'}`}>Solid</button>
        <button onClick={() => !isGrad && onToggleGrad()} className={`px-4 py-1.5 rounded-none text-[8px] font-black uppercase tracking-widest transition-all ${isGrad ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/20' : 'text-gray-400 hover:text-gray-900'}`}>Grad</button>
      </div>
    </div>

    <div className="flex flex-col gap-4 sm:p-6 flex-1">
      {/* Real-time Material Preview */}
      <div className="relative">
        <div 
          className="h-20 w-full rounded-none border border-gray-900 shadow-inner transition-all duration-500 overflow-hidden relative"
          style={{ background: isGrad ? `linear-gradient(to right, ${selected}, ${selected2})` : selected }}
        >
          <div className="absolute inset-0 bg-gradient-to-tr from-black/20 to-transparent pointer-events-none" />
          <div className="absolute bottom-2 left-3 flex flex-col">
            <span className="text-[7px] font-black text-white/60 uppercase tracking-widest">Active Material</span>
            <span className="text-[9px] font-black text-white uppercase tracking-widest">{selected.toUpperCase()} {isGrad ? `→ ${selected2.toUpperCase()}` : ''}</span>
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <HiOutlineColorSwatch className="text-[10px] text-gray-400" />
            <span className="text-[8px] font-black text-gray-400 uppercase tracking-widest">{isGrad ? 'Start Color' : 'Core Identity'}</span>
          </div>
          <div className="relative w-6 h-6 rounded-none border border-gray-900 overflow-hidden shadow-sm hover:scale-110 transition-transform">
             <input type="color" value={selected} onChange={(e) => onSelect(e.target.value)} className="absolute inset-0 w-[150%] h-[150%] -top-[25%] -left-[25%] cursor-pointer border-none p-0" />
          </div>
        </div>
        <div className="grid grid-cols-8 gap-1.5">
          {colors.slice(0, 24).map((c, i) => (
            <button 
              key={i} 
              onClick={() => onSelect(c.hex)} 
              className={`w-full aspect-square rounded-none border transition-all hover:scale-110 ${selected === c.hex ? 'border-blue-600 scale-105 z-10 shadow-md shadow-blue-500/20' : 'border-transparent'}`} 
              style={{ backgroundColor: c.hex }} 
            />
          ))}
        </div>
      </div>

      {isGrad ? (
        <div className="fade-up pt-4 flex flex-col gap-4 border-t border-gray-100 mt-auto">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <HiOutlineColorSwatch className="text-[10px] text-gray-400" />
              <span className="text-[8px] font-black text-gray-400 uppercase tracking-widest">Transition End</span>
            </div>
            <div className="relative w-6 h-6 rounded-none border border-gray-900 overflow-hidden shadow-sm hover:scale-110 transition-transform">
               <input type="color" value={selected2} onChange={(e) => onSelect2(e.target.value)} className="absolute inset-0 w-[150%] h-[150%] -top-[25%] -left-[25%] cursor-pointer border-none p-0" />
            </div>
          </div>
          <div className="grid grid-cols-8 gap-1.5">
            {colors.slice(0, 24).map((c, i) => (
              <button 
                key={i} 
                onClick={() => onSelect2(c.hex)} 
                className={`w-full aspect-square rounded-none border transition-all hover:scale-110 ${selected2 === c.hex ? 'border-gray-900 scale-105 z-10' : 'border-transparent'}`} 
                style={{ backgroundColor: c.hex }} 
              />
            ))}
          </div>
        </div>
      ) : (
        <div className="pt-4 border-t border-gray-100 mt-auto flex flex-col gap-4">
          <div className="flex flex-col gap-3">
             <span className="text-[8px] font-black text-gray-400 uppercase tracking-widest">Tonal Variations</span>
             <div className="flex gap-1.5 h-12">
                {[0.2, 0.4, 0.6, 0.8].map((op, idx) => (
                  <div key={idx} className="flex-1 border border-gray-100" style={{ backgroundColor: selected, opacity: op }} />
                ))}
             </div>
          </div>
          <div className="p-3 bg-gray-50 border-l-2 border-gray-900 flex flex-col gap-1">
             <span className="text-[7px] font-black text-gray-400 uppercase tracking-widest">Laboratory Note</span>
             <p className="text-[9px] font-bold text-gray-600 leading-tight">Solid materials provide high durability and consistent UV resistance across all surface types.</p>
          </div>
        </div>
      )}
    </div>
  </div>
);

const LandingPage = ({
  availableDesigns,
  primaryColor, setPrimaryColor, primaryIsGrad, setPrimaryIsGrad, primaryColor2, setPrimaryColor2,
  secondaryColor, setSecondaryColor, secondaryIsGrad, setSecondaryIsGrad, secondaryColor2, setSecondaryColor2,
  thirdColor, setThirdColor, thirdIsGrad, setThirdIsGrad, thirdColor2, setThirdColor2,
  onSelectDesign,
  globalPattern, setGlobalPattern, lightingPreset, setLightingPreset, materialFinish, setMaterialFinish, mouseFollow, setMouseFollow
}) => {
  const [comparing, setComparing] = useState([]); // Array of design IDs

  const themes = [
    { name: 'STEALTH', p: '#1a1a1a', s: '#333333', t: '#00b0f0' },
    { name: 'VOLCANIC', p: '#ff4d00', s: '#000000', t: '#ffd700' },
    { name: 'OCEANIC', p: '#0047ab', s: '#00ffff', t: '#ffffff' },
    { name: 'ROYALTY', p: '#800080', s: '#ffd700', t: '#ffffff' },
  ];

  const applyTheme = (theme) => {
    setPrimaryColor(theme.p); setPrimaryIsGrad(false);
    setSecondaryColor(theme.s); setSecondaryIsGrad(false);
    setThirdColor(theme.t); setThirdIsGrad(false);
  };

  const toggleCompare = (id) => {
    setComparing(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id].slice(-2));
  };

  return (
    <div className="w-full bg-white font-['Outfit'] text-gray-900">
      <style dangerouslySetInnerHTML={{
        __html: `
        @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@100;300;400;700;900&family=Playfair+Display:ital,wght@1,900&display=swap');
        .serif-italic { font-family: 'Playfair Display', serif; font-style: italic; }
        .glass-panel { background: rgba(255, 255, 255, 0.7); backdrop-filter: blur(20px); border: 1px solid rgba(0,0,0,0.05); }
      `}} />

      <div className="max-w-[1600px] mx-auto px-4 sm:px-8 py-10 sm:py-16 relative">

        {/* ── 01. ELITE HERO ── */}
        <div className="flex flex-col mb-32">
          <div className="flex items-center gap-4 mb-10">
            <div className="w-10 h-[2px] bg-blue-600" />
            <span className="text-[10px] font-black text-gray-400 uppercase tracking-[0.4em]">EAY Studio Edition</span>
          </div>
          <h1 className="text-4xl sm:text-7xl md:text-[7rem] font-black tracking-tighter leading-[0.9] sm:leading-[0.85] uppercase">
            The <span className="serif-italic text-blue-600 normal-case lowercase tracking-normal">Elite</span> <br />
            Configurator
          </h1>
        </div>

        <div className="flex flex-col lg:flex-row gap-16 mb-40">
          {/* ── 02. STUDIO CONSOLE (Left Sidebar Logic) ── */}
          <div className="w-full lg:w-80 flex flex-col gap-10">
            <div className="flex flex-col gap-2">
              <h2 className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-300">01 / Environment</h2>
              <div className="h-px w-full bg-gray-100" />
            </div>

            {/* Fabric & Finish Group */}
            <div className="flex flex-col gap-6 sm:gap-8 p-4 sm:p-6 rounded-none bg-gray-50 border border-gray-900 shadow-sm">
              <div className="flex flex-col gap-4">
                <label className="flex items-center gap-2 text-[9px] font-bold uppercase tracking-widest text-gray-500">
                  <HiOutlineCube className="text-gray-900" /> Fabric Pattern
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {['none', 'carbon', 'camo', 'dots'].map(p => (
                    <button key={p} onClick={() => setGlobalPattern(p === 'none' ? null : p)} className={`py-2.5 rounded-none border border-gray-900 text-[8px] font-black uppercase tracking-widest transition-all ${globalPattern === p || (p === 'none' && !globalPattern) ? 'bg-blue-600 text-white border-blue-600 shadow-md shadow-blue-500/10' : 'bg-white text-gray-900 border-gray-900 hover:bg-blue-600 hover:text-white hover:border-blue-600'}`}>{p}</button>
                  ))}
                </div>
              </div>

              <div className="flex flex-col gap-4">
                <label className="flex items-center gap-2 text-[9px] font-bold uppercase tracking-widest text-gray-500">
                  <HiOutlineColorSwatch className="text-gray-900" /> Material Finish
                </label>
                <div className="flex flex-col gap-2">
                  {['matte', 'gloss', 'metallic'].map(f => (
                    <button key={f} onClick={() => setMaterialFinish(f)} className={`w-full py-2.5 rounded-none border border-gray-900 text-[8px] font-black uppercase tracking-widest transition-all ${materialFinish === f ? 'bg-blue-600 text-white border-blue-600 shadow-md shadow-blue-500/10' : 'bg-white text-gray-900 border-gray-900 hover:bg-blue-600 hover:text-white hover:border-blue-600'}`}>{f}</button>
                  ))}
                </div>
              </div>

              <div className="flex flex-col gap-4">
                <label className="flex items-center gap-2 text-[9px] font-bold uppercase tracking-widest text-gray-500">
                  <HiOutlineLightningBolt className="text-gray-900" /> Lighting Rig
                </label>
                <div className="flex gap-2">
                  {['city', 'studio', 'night'].map(l => (
                    <button key={l} onClick={() => setLightingPreset(l)} className={`flex-1 py-2 rounded-none border border-gray-900 text-[8px] font-black uppercase tracking-widest transition-all ${lightingPreset === l ? 'bg-blue-600 text-white border-blue-600 shadow-md shadow-blue-500/10' : 'bg-white text-gray-900 border-gray-900 hover:bg-blue-600 hover:text-white hover:border-blue-600'}`}>{l}</button>
                  ))}
                </div>
              </div>

              <button onClick={() => setMouseFollow(!mouseFollow)} className={`w-full py-4 rounded-none text-[9px] font-black uppercase tracking-widest border transition-all flex items-center justify-center gap-3 ${mouseFollow ? 'bg-blue-600 text-white border-blue-600 shadow-xl shadow-blue-500/20' : 'bg-white text-gray-400 border-gray-900 hover:bg-blue-600 hover:text-white hover:border-blue-600'}`}>
                <div className={`w-1.5 h-1.5 rounded-none ${mouseFollow ? 'bg-white animate-pulse' : 'bg-gray-200'}`} />
                360 Follow: {mouseFollow ? 'ON' : 'OFF'}
              </button>
            </div>

            {/* Technical Specs Group (Fills empty space) */}
            <div className="flex flex-col gap-6 p-6 rounded-none bg-blue-600 text-white shadow-2xl shadow-blue-500/10 border border-white/10">
              <div className="flex items-center justify-between">
                <span className="text-[9px] font-black uppercase tracking-[0.2em] opacity-60">Engine Specs</span>
                <HiOutlineLightningBolt className="animate-pulse" />
              </div>
              <div className="flex flex-col gap-4">
                <div className="flex flex-col gap-1">
                  <span className="text-[7px] font-bold uppercase tracking-widest opacity-60">Selected Pattern</span>
                  <span className="text-[10px] font-black uppercase tracking-widest">{globalPattern || 'Solid Surface'}</span>
                </div>
                <div className="flex flex-col gap-1">
                  <span className="text-[7px] font-bold uppercase tracking-widest opacity-60">Active Finish</span>
                  <span className="text-[10px] font-black uppercase tracking-widest">{materialFinish} Reflection</span>
                </div>
                <div className="flex flex-col gap-1">
                  <span className="text-[7px] font-bold uppercase tracking-widest opacity-60">Environment</span>
                  <span className="text-[10px] font-black uppercase tracking-widest">{lightingPreset} HDRi</span>
                </div>
              </div>
              <div className="mt-2 pt-4 border-t border-white/10 flex items-center gap-3">
                <div className="flex -space-x-1">
                  <div className="w-4 h-4 rounded-none border border-white/40" style={{ backgroundColor: primaryColor }} />
                  <div className="w-4 h-4 rounded-none border border-white/40" style={{ backgroundColor: secondaryColor }} />
                  <div className="w-4 h-4 rounded-none border border-white/40" style={{ backgroundColor: thirdColor }} />
                </div>
                <span className="text-[8px] font-bold uppercase tracking-widest opacity-60">Palette Sync</span>
              </div>
            </div>

            {/* Presets Group */}
            <div className="flex flex-col gap-4">
              <label className="text-[9px] font-bold uppercase tracking-widest text-gray-500">Designer Presets</label>
              <div className="grid grid-cols-1 gap-2">
                {themes.map(t => (
                  <button key={t.name} onClick={() => applyTheme(t)} className="flex items-center justify-between px-4 py-3 bg-white border border-gray-900 rounded-none hover:bg-gray-900 transition-all group shadow-sm">
                    <span className="text-[9px] font-black text-gray-900 uppercase tracking-widest group-hover:text-white">{t.name}</span>
                    <div className="flex -space-x-1.5">
                      <div className="w-3.5 h-3.5 rounded-none border-2 border-white" style={{ backgroundColor: t.p }} />
                      <div className="w-3.5 h-3.5 rounded-none border-2 border-white" style={{ backgroundColor: t.s }} />
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* ── 03. MATERIAL PALETTE (Main Lab) ── */}
          <div className="flex-1 flex flex-col gap-10">
            <div className="flex flex-col gap-2">
              <h2 className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-300">02 / Material Palette</h2>
              <div className="h-px w-full bg-gray-100" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 bg-gray-50/30 p-6 rounded-none border border-gray-900 shadow-[0_20px_50px_rgba(0,0,0,0.01)]">
              <ColorGrid label="Identity" selected={primaryColor} onSelect={setPrimaryColor} isGrad={primaryIsGrad} onToggleGrad={() => setPrimaryIsGrad(!primaryIsGrad)} selected2={primaryColor2} onSelect2={setPrimaryColor2} />
              <ColorGrid label="Secondary" selected={secondaryColor} onSelect={setSecondaryColor} isGrad={secondaryIsGrad} onToggleGrad={() => setSecondaryIsGrad(!secondaryIsGrad)} selected2={secondaryColor2} onSelect2={setSecondaryColor2} />
              <ColorGrid label="Technical" selected={thirdColor} onSelect={setThirdColor} isGrad={thirdIsGrad} onToggleGrad={() => setThirdIsGrad(!thirdIsGrad)} selected2={thirdColor2} onSelect2={setThirdColor2} />
            </div>
          </div>
        </div>

        {/* ── 04. THE GALLERY ── */}
        <div className="flex flex-col gap-16">
          <div className="flex items-end justify-between border-b border-gray-100 pb-10">
            <div className="flex flex-col gap-4">
              <span className="text-[10px] font-black text-blue-600 uppercase tracking-[0.4em]">03 / Elite Library</span>
              <h2 className="text-3xl sm:text-5xl font-black uppercase tracking-tighter">Choose Basis</h2>
            </div>
            {comparing.length > 0 && (
              <div className="flex items-center gap-4 bg-blue-600 px-6 py-3 rounded-full text-white shadow-xl animate-fade-in mb-2">
                <span className="text-[9px] font-black uppercase tracking-widest">Comparing {comparing.length}/2</span>
                <button onClick={() => setComparing([])} className="hover:rotate-90 transition-transform"><HiOutlineX /></button>
              </div>
            )}
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-x-10 gap-y-20">
            {availableDesigns.map((design) => (
              <div key={design.id} className="group flex flex-col gap-6 cursor-pointer" onClick={() => onSelectDesign(design)}>
                <div className={`aspect-[3.5/5] relative bg-white rounded-none border border-gray-50 transition-all duration-700 overflow-hidden ${comparing.includes(design.id) ? 'ring-4 ring-gray-900 ring-offset-4' : 'group-hover:-translate-y-3 group-hover:shadow-[0_40px_80px_rgba(0,0,0,0.1)] group-hover:border-gray-100'}`}>
                  <DesignPreview
                    modelUrl={design.modelUrl} mapping={design.mapping}
                    primaryColor={primaryColor} primaryIsGrad={primaryIsGrad} primaryColor2={primaryColor2}
                    secondaryColor={secondaryColor} secondaryIsGrad={secondaryIsGrad} secondaryColor2={secondaryColor2}
                    thirdColor={thirdColor} thirdIsGrad={thirdIsGrad} thirdColor2={thirdColor2}
                    pattern={globalPattern} lighting={lightingPreset} finish={materialFinish} mouseFollow={mouseFollow}
                  />

                  <div className="absolute top-5 left-5 px-3 py-1 bg-white/90 backdrop-blur-md rounded-lg border border-black/5 shadow-sm">
                    <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest">{design.id}</span>
                  </div>

                  <button
                    onClick={(e) => { e.stopPropagation(); toggleCompare(design.id); }}
                    className={`absolute top-5 right-5 w-10 h-10 rounded-none flex items-center justify-center backdrop-blur-md border transition-all duration-300 ${comparing.includes(design.id) ? 'bg-gray-900 border-gray-900 text-white' : 'bg-white/60 border-white/20 text-gray-900 opacity-0 group-hover:opacity-100 hover:scale-105'}`}
                  >
                    <HiViewGrid size={18} />
                  </button>

                  <div className="absolute inset-0 bg-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  <div className="absolute bottom-8 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-all duration-500 translate-y-4 group-hover:translate-y-0">
                    <div className="flex items-center gap-2.5 bg-white text-gray-900 px-6 py-2.5 rounded-none shadow-xl font-black text-[9px] uppercase tracking-[0.2em] border border-gray-900 group-hover:bg-gray-900 group-hover:text-white transition-all duration-300">
                      Customize <HiArrowRight className="group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                </div>

                <div className="flex flex-col gap-1 px-1">
                  <div className="flex items-center justify-between">
                    <h3 className="text-[15px] font-bold text-gray-900 uppercase tracking-tight group-hover:text-blue-600 transition-colors">{design.name.split(' / ')[0]}</h3>
                    <div className="w-1.5 h-1.5 rounded-none bg-gray-200 group-hover:bg-blue-600 transition-colors" />
                  </div>
                  <span className="text-[9px] font-bold text-gray-300 uppercase tracking-[0.2em]">{design.name.split(' / ')[1]}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ── 05. STUDIO FOOTER ── */}
        <div className="mt-48 pt-20 border-t border-gray-100 flex flex-col md:flex-row items-center justify-between gap-12 text-gray-300">
          <div className="flex items-center gap-12">
            <div className="flex flex-col gap-1.5"><span className="text-[8px] font-black uppercase tracking-widest">Engine</span><span className="text-[11px] font-bold text-gray-400 uppercase">GPU Matrix v5.0</span></div>
            <div className="flex flex-col gap-1.5"><span className="text-[8px] font-black uppercase tracking-widest">Render</span><span className="text-[11px] font-bold text-gray-400 uppercase">Hyper Fidelity</span></div>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-1.5 h-1.5 rounded-none bg-gray-900 animate-pulse" />
            <span className="text-[10px] font-black uppercase tracking-[0.5em]">EAY Studio — PRO EDITION</span>
          </div>
        </div>
      </div>
    </div >
  );
};

export default LandingPage;
