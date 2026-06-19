import React, { useState, useEffect } from 'react';
import { BiCube, BiPalette, BiText, BiImage, BiCart, BiWater, BiFlag, BiFootball, BiChevronRight, BiPlus, BiTrash, BiMapAlt, BiDna, BiBug, BiCamera, BiUserCircle, BiGhost, BiStar, BiHeart } from 'react-icons/bi';
import { HiOutlineSparkles, HiOutlinePhotograph, HiOutlineCube, HiOutlineLightningBolt, HiOutlineColorSwatch, HiOutlineCursorClick, HiOutlineAdjustments, HiOutlineUserAdd, HiOutlineTrash, HiOutlinePlus, HiOutlineMinus, HiOutlineChevronDown, HiOutlineCloudUpload } from 'react-icons/hi';
import { VscSymbolColor } from 'react-icons/vsc';
import { FaPaw, FaCat, FaCrow, FaHippo, FaHorse } from 'react-icons/fa';

const colors = [
  { name: 'BLACK', hex: '#111111' },
  { name: 'GRAPHITE', hex: '#555555' },
  { name: 'GRAY', hex: '#999999' },
  { name: 'SILVER', hex: '#c0c0c0' },
  { name: 'WHITE', hex: '#ffffff' },
  { name: 'NAVY', hex: '#002080' },
  { name: 'ROYAL BLUE', hex: '#1a56db' },
  { name: 'SKY BLUE', hex: '#0070c0' },
  { name: 'CYAN', hex: '#00b0f0' },
  { name: 'TEAL', hex: '#009688' },
  { name: 'FOREST', hex: '#228b22' },
  { name: 'EMERALD', hex: '#4caf50' },
  { name: 'OPTIC YELLOW', hex: '#ccff00' },
  { name: 'GOLD', hex: '#ffd700' },
  { name: 'ORANGE', hex: '#ff9800' },
  { name: 'RED', hex: '#e00000' },
  { name: 'CRIMSON', hex: '#990000' },
  { name: 'MAGENTA', hex: '#cc00cc' },
  { name: 'PURPLE', hex: '#6236ff' },
  { name: 'HOT PINK', hex: '#ff4081' },
  { name: 'LIGHT PINK', hex: '#ffb6c1' },
  { name: 'BROWN', hex: '#8b4513' },
  { name: 'TAUPE', hex: '#b38b6d' },
  { name: 'CREAM', hex: '#fffdd0' },
];

const getColorName = (hex) =>
  colors.find(c => c.hex.toLowerCase() === hex?.toLowerCase())?.name || hex || '—';

const ColorGrid = ({ selected, onSelect }) => (
  <div className="grid grid-cols-8 gap-1.5 mt-2">
    {colors.map((c, i) => {
      const isActive = selected?.toLowerCase() === c.hex.toLowerCase();
      return (
        <div
          key={i}
          title={c.name}
          onClick={() => onSelect(c.hex)}
          className={`swatch aspect-square rounded-none cursor-pointer border transition-all
            ${isActive ? 'border-blue-600 shadow-[0_0_10px_rgba(37,99,235,0.2)] scale-105 z-10' : 'border-gray-100 hover:border-gray-300'}`}
          style={{ backgroundColor: c.hex }}
        >
          {isActive && <div className="w-full h-full border-[3px] border-white/30" />}
        </div>
      );
    })}
  </div>
);

const SecHeader = ({ label, icon, isOpen, onToggle }) => (
  <button
    onClick={onToggle}
    className="w-full flex items-center justify-between px-5 py-3.5 border-b border-gray-50 cursor-pointer outline-none transition-all hover:bg-gray-50/50 bg-white group"
  >
    <div className="flex items-center gap-3">
      <span className={`text-xl transition-colors ${isOpen ? 'text-blue-600' : 'text-gray-400'}`}>{icon}</span>
      <span className={`text-[10px] font-semibold tracking-[0.15em] uppercase transition-colors ${isOpen ? 'text-gray-900' : 'text-gray-400'}`}>{label}</span>
    </div>
    <HiOutlineChevronDown className={`text-gray-300 text-sm transition-transform duration-300 ${isOpen ? 'rotate-180 text-blue-600' : ''}`} />
  </button>
);

const MeshProperties = ({
  state,
  updateProp: singleUpdateProp,
  meshStates,
  updateMeshStates,
  activeMesh,
  updateMeshProp,
  addDecal,
  decals = [],
  selectedDecalId,
  setSelectedDecalId,
  updateDecal,
  removeDecal
}) => {
  const [openSections, setOpenSections] = useState(['fill']);
  const [applyGlobally, setApplyGlobally] = useState(false);

  const toggleSection = (id) => {
    setOpenSections(prev => {
      if (prev.includes(id)) return prev.filter(s => s !== id);
      const limit = typeof window !== 'undefined' && window.innerWidth < 768 ? 1 : 2;
      const next = [...prev, id];
      return next.length > limit ? next.slice(1) : next;
    });
  };

  const updateProp = (prop, val) => {
    if (applyGlobally) {
      // Sync change to all panels in design
      const updates = {};
      Object.keys(meshStates).forEach(meshId => {
        updates[meshId] = {
          ...meshStates[meshId],
          [prop]: val
        };
      });
      updateMeshStates(updates);
    } else {
      singleUpdateProp(prop, val);
    }
  };

  const handleToggleApplyGlobally = (checked) => {
    setApplyGlobally(checked);
    if (checked && state) {
      // Sync active mesh pattern settings to ALL other meshes immediately!
      const patternProps = ['pUrl', 'pColor', 'pSize', 'pRotation', 'pOffsetX', 'pOffsetY', 'pMinY', 'pMaxY', 'pMappingMode'];
      const updates = {};
      Object.keys(meshStates).forEach(meshId => {
        const meshState = meshStates[meshId];
        const newMeshState = { ...meshState };
        patternProps.forEach(p => {
          if (state[p] !== undefined) {
            newMeshState[p] = state[p];
          }
        });
        updates[meshId] = newMeshState;
      });
      updateMeshStates(updates);
    }
  };

  if (!state) return <div className="p-10 text-center text-gray-400 font-semibold uppercase tracking-widest text-[10px]">Select a part to edit</div>;

  const patternDecals = decals.filter(d => d.type === 'pattern');
  const selectedPattern = patternDecals.find(d => d.id === selectedDecalId);

  return (
    <div className="flex flex-col bg-white">
      <SecHeader label="Fill Color" icon={<VscSymbolColor />} isOpen={openSections.includes('fill')} onToggle={() => toggleSection('fill')} />
      <div className={`acc-body ${openSections.includes('fill') ? 'open' : ''}`}>
        <div className="p-5 bg-white border-b border-gray-50">
          <div className="flex items-center gap-4 p-3 bg-gray-50 border border-gray-100 rounded-none mb-4">
            <div className="w-10 h-10 rounded-none border border-white shadow-sm flex-shrink-0" style={{ backgroundColor: state.color }} />
            <div>
              <div className="text-[8px] font-semibold text-gray-400 uppercase tracking-widest">Active Material</div>
              <div className="text-[12px] font-semibold text-gray-800 tracking-wider">{getColorName(state.color)}</div>
            </div>
          </div>
          <ColorGrid selected={state.color} onSelect={(hex) => { updateProp('color', hex); updateProp('isGrad', false); }} />
        </div>
      </div>

      <SecHeader label="Gradient Engine" icon={<HiOutlineSparkles />} isOpen={openSections.includes('grad')} onToggle={() => toggleSection('grad')} />
      <div className={`acc-body ${openSections.includes('grad') ? 'open' : ''}`}>
        <div className="p-5 bg-white border-b border-gray-50">
          <div className="flex gap-2 mb-5">
            <button onClick={() => updateProp('isGrad', false)} className={`flex-1 py-2 rounded-none text-[9px] font-semibold tracking-widest border transition-all ${!state.isGrad ? 'border-blue-600 bg-blue-50 text-blue-600 shadow-sm' : 'border-gray-100 text-gray-400'}`}>SOLID</button>
            <button onClick={() => updateProp('isGrad', true)} className={`flex-1 py-2 rounded-none text-[9px] font-semibold tracking-widest border transition-all ${state.isGrad ? 'border-blue-600 bg-blue-50 text-blue-600 shadow-sm' : 'border-gray-100 text-gray-400'}`}>GRADIENT</button>
          </div>
          {state.isGrad && (
            <div className="fade-up space-y-5">
              <div className="h-6 rounded-none border border-gray-100 shadow-inner" style={{ background: `linear-gradient(to right, ${state.grad1}, ${state.grad2})` }} />
              <ColorGrid selected={state.grad1} onSelect={(val) => updateProp('grad1', val)} />
              <ColorGrid selected={state.grad2} onSelect={(val) => updateProp('grad2', val)} />
            </div>
          )}
        </div>
      </div>

      <SecHeader label="Pattern Overlay" icon={<HiOutlinePhotograph />} isOpen={openSections.includes('pat')} onToggle={() => toggleSection('pat')} />
      <div className={`acc-body ${openSections.includes('pat') ? 'open' : ''}`}>
        <div className="p-5 bg-white border-b border-gray-50">
          <div className="p-3 bg-blue-50/50 border border-blue-100 rounded-none text-[8.5px] text-blue-700/80 font-bold uppercase tracking-wider flex items-center gap-2 mb-4">
            <span className="text-xs">💡</span>
            <span>Patterns are now placed as interactive layers! Scale, rotate, tint, and click to position them anywhere on the model.</span>
          </div>

          <div className="flex gap-3 mb-2">
            <label className="flex-1 h-14 rounded-none border border-dashed border-gray-200 flex flex-col items-center justify-center gap-1 cursor-pointer hover:border-blue-600 hover:bg-blue-50 transition-all text-gray-300 group">
              <HiOutlinePlus className="text-lg group-hover:text-blue-600" />
              <span className="text-[9px] font-bold group-hover:text-blue-600 uppercase">Upload Pattern Layer</span>
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={e => {
                  if (e.target.files?.[0]) {
                    const url = URL.createObjectURL(e.target.files[0]);
                    addDecal('pattern', 'Pattern Layer', url);
                    e.target.value = '';
                  }
                }}
              />
            </label>
          </div>

          {/* ACTIVE PATTERN LAYERS LIST */}
          {patternDecals.length > 0 && (
            <div className="mt-4 pt-4 border-t border-gray-100">
              <h4 className="text-[8.5px] font-bold text-gray-400 uppercase tracking-widest mb-3 flex items-center justify-between">
                <span>Active Pattern Layers</span>
                <span className="text-[8px] bg-gray-100 px-2 py-0.5 rounded-none text-gray-400 border border-gray-100">{patternDecals.length}</span>
              </h4>
              <div className="space-y-1.5">
                {patternDecals.map(d => (
                  <div
                    key={d.id}
                    onClick={() => setSelectedDecalId(d.id)}
                    className={`p-3.5 rounded-none border transition-all flex items-center justify-between bg-white cursor-pointer ${selectedDecalId === d.id ? 'border-blue-600 bg-blue-50/20' : 'border-gray-50 hover:border-gray-100'}`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-none border border-gray-100 bg-cover bg-center flex-shrink-0" style={{ backgroundImage: `url(${d.imageUrl})` }} />
                      <div className="flex flex-col text-left">
                        <span className="text-[10px] font-semibold truncate max-w-[150px]">{d.text || 'Pattern Layer'}</span>
                        <span className="text-[7px] font-semibold text-gray-300 uppercase mt-0.5">SIZE {((d.decalScale || 0.8) * 100).toFixed(0)}%</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-4 h-4 rounded-none border border-white shadow-sm flex-shrink-0" style={{ backgroundColor: d.color }} />
                      <button onClick={(e) => { e.stopPropagation(); removeDecal(d.id); }} className="w-5 h-5 flex items-center justify-center text-gray-200 hover:text-red-500 transition-colors"><BiTrash /></button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {selectedPattern && (
            <div className="mt-6 p-4 bg-gray-50 rounded-none border border-gray-100 space-y-6 text-left">
              {/* Tip Banner */}
              <div className="p-3 bg-blue-50/50 border border-blue-100 rounded-none text-[8.5px] text-blue-700/80 font-bold uppercase tracking-wider flex items-center gap-2">
                <span className="text-xs">💡</span>
                <span>Tip: click anywhere on the 3D model to move this layer.</span>
              </div>

              {/* Pattern Tint Color */}
              <div>
                <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest mb-3">Pattern Tint Color</p>
                <ColorGrid selected={selectedPattern.color} onSelect={(val) => updateDecal(selectedPattern.id, { color: val })} />
              </div>

              {/* Sizing & Stretching */}
              <div className="space-y-4 pt-4 border-t border-gray-200">
                <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">Sizing & Stretching</p>

                {/* Uniform Scale */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[9px] font-semibold text-gray-500 uppercase tracking-wider">Overall Scale (Uniform)</span>
                    <span className="text-[10px] font-semibold text-blue-600">{((selectedPattern.decalScale || 0.8) * 100).toFixed(0)}%</span>
                  </div>
                  <input
                    type="range"
                    min="0.03"
                    max="4.0"
                    step="0.01"
                    className="w-full h-1.5 bg-gray-200 rounded-none appearance-none cursor-pointer accent-blue-600"
                    value={selectedPattern.decalScale || 0.8}
                    onChange={(e) => {
                      const v = parseFloat(e.target.value);
                      updateDecal(selectedPattern.id, { decalScale: v, decalScaleX: v, decalScaleY: v });
                    }}
                  />
                </div>

                {/* Horizontal Stretch (Width) */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[9px] font-semibold text-gray-500 uppercase tracking-wider">Width (Horizontal Stretch)</span>
                    <span className="text-[10px] font-semibold text-blue-600">{((selectedPattern.decalScaleX !== undefined ? selectedPattern.decalScaleX : (selectedPattern.decalScale || 0.8)) * 100).toFixed(0)}%</span>
                  </div>
                  <input
                    type="range"
                    min="0.03"
                    max="4.0"
                    step="0.01"
                    className="w-full h-1.5 bg-gray-200 rounded-none appearance-none cursor-pointer accent-blue-600"
                    value={selectedPattern.decalScaleX !== undefined ? selectedPattern.decalScaleX : (selectedPattern.decalScale || 0.8)}
                    onChange={(e) => updateDecal(selectedPattern.id, { decalScaleX: parseFloat(e.target.value) })}
                  />
                </div>

                {/* Vertical Stretch (Height) */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[9px] font-semibold text-gray-500 uppercase tracking-wider">Height (Vertical Stretch)</span>
                    <span className="text-[10px] font-semibold text-blue-600">{((selectedPattern.decalScaleY !== undefined ? selectedPattern.decalScaleY : (selectedPattern.decalScale || 0.8)) * 100).toFixed(0)}%</span>
                  </div>
                  <input
                    type="range"
                    min="0.03"
                    max="4.0"
                    step="0.01"
                    className="w-full h-1.5 bg-gray-200 rounded-none appearance-none cursor-pointer accent-blue-600"
                    value={selectedPattern.decalScaleY !== undefined ? selectedPattern.decalScaleY : (selectedPattern.decalScale || 0.8)}
                    onChange={(e) => updateDecal(selectedPattern.id, { decalScaleY: parseFloat(e.target.value) })}
                  />
                </div>
              </div>

              {/* Edge Blending (Gradient Fade) */}
              <div className="space-y-4 pt-4 border-t border-gray-200 text-left">
                <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">Edge Blending (Gradient Fade)</p>

                <div className="grid grid-cols-2 gap-x-4 gap-y-3">
                  {/* Fade Top */}
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-[8px] font-semibold text-gray-400 uppercase tracking-wider">Fade Top</span>
                      <span className="text-[8.5px] font-semibold text-blue-600">{Math.round((selectedPattern.pFadeTop || 0.0) * 100)}%</span>
                    </div>
                    <input
                      type="range"
                      min="0.0"
                      max="1.0"
                      step="0.01"
                      className="w-full h-1 bg-gray-200 rounded-none appearance-none cursor-pointer accent-blue-600"
                      value={selectedPattern.pFadeTop || 0.0}
                      onChange={(e) => updateDecal(selectedPattern.id, { pFadeTop: parseFloat(e.target.value) })}
                    />
                  </div>

                  {/* Fade Bottom */}
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-[8px] font-semibold text-gray-400 uppercase tracking-wider">Fade Bottom</span>
                      <span className="text-[8.5px] font-semibold text-blue-600">{Math.round((selectedPattern.pFadeBottom || 0.0) * 100)}%</span>
                    </div>
                    <input
                      type="range"
                      min="0.0"
                      max="1.0"
                      step="0.01"
                      className="w-full h-1 bg-gray-200 rounded-none appearance-none cursor-pointer accent-blue-600"
                      value={selectedPattern.pFadeBottom || 0.0}
                      onChange={(e) => updateDecal(selectedPattern.id, { pFadeBottom: parseFloat(e.target.value) })}
                    />
                  </div>

                  {/* Fade Left */}
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-[8px] font-semibold text-gray-400 uppercase tracking-wider">Fade Left</span>
                      <span className="text-[8.5px] font-semibold text-blue-600">{Math.round((selectedPattern.pFadeLeft || 0.0) * 100)}%</span>
                    </div>
                    <input
                      type="range"
                      min="0.0"
                      max="1.0"
                      step="0.01"
                      className="w-full h-1 bg-gray-200 rounded-none appearance-none cursor-pointer accent-blue-600"
                      value={selectedPattern.pFadeLeft || 0.0}
                      onChange={(e) => updateDecal(selectedPattern.id, { pFadeLeft: parseFloat(e.target.value) })}
                    />
                  </div>

                  {/* Fade Right */}
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-[8px] font-semibold text-gray-400 uppercase tracking-wider">Fade Right</span>
                      <span className="text-[8.5px] font-semibold text-blue-600">{Math.round((selectedPattern.pFadeRight || 0.0) * 100)}%</span>
                    </div>
                    <input
                      type="range"
                      min="0.0"
                      max="1.0"
                      step="0.01"
                      className="w-full h-1 bg-gray-200 rounded-none appearance-none cursor-pointer accent-blue-600"
                      value={selectedPattern.pFadeRight || 0.0}
                      onChange={(e) => updateDecal(selectedPattern.id, { pFadeRight: parseFloat(e.target.value) })}
                    />
                  </div>

                  {/* Fade Top Left */}
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-[8px] font-semibold text-gray-400 uppercase tracking-wider">Top Left</span>
                      <span className="text-[8.5px] font-semibold text-blue-600">{Math.round((selectedPattern.pFadeTopLeft || 0.0) * 100)}%</span>
                    </div>
                    <input
                      type="range"
                      min="0.0"
                      max="1.0"
                      step="0.01"
                      className="w-full h-1 bg-gray-200 rounded-none appearance-none cursor-pointer accent-blue-600"
                      value={selectedPattern.pFadeTopLeft || 0.0}
                      onChange={(e) => updateDecal(selectedPattern.id, { pFadeTopLeft: parseFloat(e.target.value) })}
                    />
                  </div>

                  {/* Fade Top Right */}
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-[8px] font-semibold text-gray-400 uppercase tracking-wider">Top Right</span>
                      <span className="text-[8.5px] font-semibold text-blue-600">{Math.round((selectedPattern.pFadeTopRight || 0.0) * 100)}%</span>
                    </div>
                    <input
                      type="range"
                      min="0.0"
                      max="1.0"
                      step="0.01"
                      className="w-full h-1 bg-gray-200 rounded-none appearance-none cursor-pointer accent-blue-600"
                      value={selectedPattern.pFadeTopRight || 0.0}
                      onChange={(e) => updateDecal(selectedPattern.id, { pFadeTopRight: parseFloat(e.target.value) })}
                    />
                  </div>

                  {/* Fade Bottom Left */}
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-[8px] font-semibold text-gray-400 uppercase tracking-wider">Bottom Left</span>
                      <span className="text-[8.5px] font-semibold text-blue-600">{Math.round((selectedPattern.pFadeBottomLeft || 0.0) * 100)}%</span>
                    </div>
                    <input
                      type="range"
                      min="0.0"
                      max="1.0"
                      step="0.01"
                      className="w-full h-1 bg-gray-200 rounded-none appearance-none cursor-pointer accent-blue-600"
                      value={selectedPattern.pFadeBottomLeft || 0.0}
                      onChange={(e) => updateDecal(selectedPattern.id, { pFadeBottomLeft: parseFloat(e.target.value) })}
                    />
                  </div>

                  {/* Fade Bottom Right */}
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-[8px] font-semibold text-gray-400 uppercase tracking-wider">Bottom Right</span>
                      <span className="text-[8.5px] font-semibold text-blue-600">{Math.round((selectedPattern.pFadeBottomRight || 0.0) * 100)}%</span>
                    </div>
                    <input
                      type="range"
                      min="0.0"
                      max="1.0"
                      step="0.01"
                      className="w-full h-1 bg-gray-200 rounded-none appearance-none cursor-pointer accent-blue-600"
                      value={selectedPattern.pFadeBottomRight || 0.0}
                      onChange={(e) => updateDecal(selectedPattern.id, { pFadeBottomRight: parseFloat(e.target.value) })}
                    />
                  </div>
                </div>
              </div>

              {/* Rotation */}
              <div className="space-y-4 pt-4 border-t border-gray-200">
                <div className="flex items-center justify-between mb-3">
                  <p className="text-[9px] font-semibold text-gray-400 uppercase tracking-widest">Rotation</p>
                  <span className="text-[10px] font-semibold text-blue-600">{Math.round((selectedPattern.rotation || 0) * 180 / Math.PI)}°</span>
                </div>
                <input
                  type="range"
                  min="-180"
                  max="180"
                  step="1"
                  className="w-full h-1.5 bg-gray-200 rounded-none appearance-none cursor-pointer accent-blue-600"
                  value={Math.round((selectedPattern.rotation || 0) * 180 / Math.PI)}
                  onChange={(e) => updateDecal(selectedPattern.id, { rotation: parseFloat(e.target.value) * Math.PI / 180 })}
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const NamesNumbersTab = ({ decals, selectedDecalId, setSelectedDecalId, addDecal, updateDecal, removeDecal }) => {
  const selected = decals.find(d => d.id === selectedDecalId);
  const [localText, setLocalText] = useState('');
  const [openSection, setOpenSection] = useState('font');
  const isLocked = !selected;

  useEffect(() => {
    if (selected) setLocalText(selected.text);
  }, [selectedDecalId]);

  const fonts = ['Arial', 'Impact', 'Verdana', 'Georgia', 'Courier New'];

  const safeUpdate = (updates) => {
    if (!selected) return;
    updateDecal(selected.id, updates);
  };

  const renderColorGrid = (targetProp) => (
    <div className="flex flex-wrap gap-2">
      {colors.map((c, i) => (
        <button
          key={c.hex + i}
          onClick={() => safeUpdate({ [targetProp]: c.hex })}
          className={`w-7 h-7 rounded-none border cursor-pointer transition-all hover:scale-110 ${selected?.[targetProp] === c.hex ? 'border-blue-600 shadow-lg ring-1 ring-blue-100 z-10' : 'border-gray-200 hover:border-gray-400'}`}
          style={{ backgroundColor: c.hex }}
          title={c.name}
        />
      ))}
    </div>
  );

  const renderSection = (id, label, content) => {
    const isOpen = openSection === id;
    return (
      <div key={id} className={`bg-white border-b border-gray-100 ${isLocked ? 'opacity-40 pointer-events-none' : ''}`}>
        <button
          onClick={() => { if (!isLocked) setOpenSection(isOpen ? null : id); }}
          className={`w-full flex items-center justify-between px-5 py-3 hover:bg-gray-50 transition-colors cursor-pointer ${isOpen ? 'bg-gray-50' : ''}`}
        >
          <span className={`text-[10px] font-semibold uppercase tracking-widest ${isOpen ? 'text-blue-600' : 'text-gray-700'}`}>{label}</span>
          <span className={`text-[10px] transition-transform duration-300 ${isOpen ? 'rotate-45 text-blue-600' : 'text-gray-300'}`}>＋</span>
        </button>
        {isOpen && (
          <div className="p-5">
            {content}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="flex flex-col bg-white">
      <div className="p-6 bg-white border-b border-gray-50">
        <h3 className="text-[9px] font-semibold text-gray-400 uppercase tracking-widest mb-4 flex items-center justify-between">
          <span>Active Text Layers</span>
          <span className="text-[8px] bg-gray-100 px-2 py-0.5 rounded-none text-gray-400 border border-gray-100">{decals.length} TOTAL</span>
        </h3>
        <div className="space-y-1.5">
          {decals.map((d, i) => (
            <div
              key={d.id}
              onClick={() => setSelectedDecalId(d.id)}
              className={`p-3.5 rounded-none border transition-all flex items-center justify-between bg-white cursor-pointer
                ${selectedDecalId === d.id ? 'border-blue-600 bg-blue-50/20' : 'border-gray-50 hover:border-gray-100'}`}
            >
              <div className="flex flex-col">
                <span className={`text-[10px] font-semibold tracking-widest ${selectedDecalId === d.id ? 'text-gray-900' : 'text-gray-500'}`}>{d.text || 'EMPTY'}</span>
                <span className="text-[7px] font-semibold text-gray-300 uppercase tracking-widest mt-0.5">{d.font} • SIZE {((d.decalScale || 0.15) * 100).toFixed(0)}%</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-4 h-4 rounded-none border border-white shadow-sm" style={{ backgroundColor: d.color }} />
                <button onClick={(e) => { e.stopPropagation(); removeDecal(d.id); }} className="w-5 h-5 flex items-center justify-center text-gray-200 hover:text-red-500 transition-colors"><HiOutlineTrash /></button>
              </div>
            </div>
          ))}
          {decals.length === 0 && (
            <div className="text-center py-10 border border-dashed border-gray-100 rounded-none bg-gray-50/30">
              <p className="text-[8px] font-semibold text-gray-300 uppercase tracking-widest">No Text Layers Added</p>
            </div>
          )}
        </div>
      </div>

      <div className="bg-white p-6 border-b border-gray-50 relative z-10">
        <div className="flex gap-2">
          <input
            type="text"
            placeholder="TYPE HERE..."
            className="flex-1 bg-gray-50 border border-gray-100 rounded-none px-4 py-3 text-[10px] font-semibold uppercase tracking-widest focus:border-blue-600 focus:bg-white outline-none transition-all"
            onChange={(e) => {
              const val = e.target.value.toUpperCase();
              setLocalText(val);
              if (selected) safeUpdate({ text: val });
            }}
            onKeyDown={(e) => { if (e.key === 'Enter') addDecal('text', localText || 'TEAM NAME'); }}
            value={localText}
          />
          <button
            onClick={() => addDecal('text', localText || 'TEAM NAME')}
            className="px-6 bg-gray-800 text-white rounded-none text-[10px] font-semibold uppercase tracking-widest hover:bg-blue-600 transition-all active:scale-95"
          >
            ADD
          </button>
        </div>
      </div>

      <div className="flex-1">
        {renderSection('font', 'Font & Color', (
          <div className="space-y-6">
            <div>
              <p className="text-[9px] font-semibold text-gray-400 uppercase mb-3">Primary Color</p>
              {renderColorGrid('color')}
            </div>
            <div>
              <p className="text-[9px] font-semibold text-gray-400 uppercase mb-3">Sports Typography</p>
              <div className="grid grid-cols-2 gap-2">
                {fonts.map(f => (
                  <button
                    key={f}
                    onClick={() => safeUpdate({ font: f })}
                    className={`py-3 rounded-none border text-[10px] font-semibold cursor-pointer transition-all ${selected?.font === f ? 'border-blue-600 bg-blue-50 text-blue-600' : 'border-gray-100 text-gray-500 hover:border-gray-300'}`}
                    style={{ fontFamily: f }}
                  >
                    {f}
                  </button>
                ))}
              </div>
            </div>
          </div>
        ))}

        {renderSection('outline', 'Outline Layer 1', (
          <div className="space-y-5">
            <div className="flex items-center justify-between bg-gray-50 p-3 rounded-none">
              <p className="text-[9px] font-semibold text-gray-400 uppercase">Thickness</p>
              <span className="text-[10px] font-semibold text-blue-600 bg-white px-2 py-1 rounded-none shadow-sm">{selected?.outline1Width || 0}PX</span>
            </div>
            <input type="range" min="0" max="12" step="1" className="w-full h-1.5 bg-gray-200 rounded-none appearance-none cursor-pointer accent-blue-600" value={selected?.outline1Width || 0} onChange={(e) => safeUpdate({ outline1Width: parseInt(e.target.value) })} />
            <div>
              <p className="text-[9px] font-semibold text-gray-400 uppercase mb-3">Outline Color</p>
              {renderColorGrid('outline1Color')}
            </div>
          </div>
        ))}

        {renderSection('outline2', 'Outline Layer 2', (
          <div className="space-y-5">
            <div className="flex items-center justify-between bg-gray-50 p-3 rounded-none">
              <p className="text-[9px] font-semibold text-gray-400 uppercase">Outer Thickness</p>
              <span className="text-[10px] font-semibold text-blue-600 bg-white px-2 py-1 rounded-none shadow-sm">{selected?.outline2Width || 0}PX</span>
            </div>
            <input type="range" min="0" max="12" step="1" className="w-full h-1.5 bg-gray-200 rounded-none appearance-none cursor-pointer accent-blue-600" value={selected?.outline2Width || 0} onChange={(e) => safeUpdate({ outline2Width: parseInt(e.target.value) })} />
            <div>
              <p className="text-[9px] font-semibold text-gray-400 uppercase mb-3">Outer Color</p>
              {renderColorGrid('outline2Color')}
            </div>
          </div>
        ))}

        {renderSection('effect', 'Text Curvature', (
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 rounded-none border border-gray-50 bg-white">
              <span className="text-[10px] font-semibold text-gray-700 uppercase tracking-wider">Arch Effect</span>
              <button
                onClick={() => safeUpdate({ effect: selected?.effect === 'arch' ? 'none' : 'arch' })}
                className={`w-10 h-5 rounded-full transition-colors relative cursor-pointer ${selected?.effect === 'arch' ? 'bg-blue-600' : 'bg-gray-200'}`}
              >
                <div className={`absolute top-1 left-1 w-3 h-3 rounded-full bg-white transition-all ${selected?.effect === 'arch' ? 'translate-x-5' : ''}`} />
              </button>
            </div>
            {selected?.effect === 'arch' && (
              <div className="p-4 bg-white border border-gray-50 space-y-4">
                <div className="flex items-center justify-between">
                  <p className="text-[9px] font-semibold text-gray-400 uppercase">Bend Intensity</p>
                  <span className="text-[10px] font-semibold text-blue-600">{((selected?.effectIntensity || 0.5) * 100).toFixed(0)}%</span>
                </div>
                <input type="range" min="0.1" max="1.5" step="0.1" className="w-full h-1.5 bg-gray-200 rounded-none appearance-none cursor-pointer accent-blue-600" value={selected?.effectIntensity || 0.5} onChange={(e) => safeUpdate({ effectIntensity: parseFloat(e.target.value) })} />
              </div>
            )}
          </div>
        ))}

        {renderSection('transform', 'Layer Size & Rotation', (
          <div className="space-y-6">
            {/* Tip Banner */}
            <div className="p-3 bg-blue-50/50 border border-blue-100 rounded-none text-[8.5px] text-blue-700/80 font-bold uppercase tracking-wider flex items-center gap-2">
              <span className="text-xs">💡</span>
              <span>Tip: click anywhere on the 3D model to move this layer.</span>
            </div>

            <div className="space-y-4">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <p className="text-[9px] font-semibold text-gray-400 uppercase tracking-widest">Overall Scale</p>
                  <span className="text-[10px] font-semibold text-blue-600">{((selected?.decalScale || 0.15) * 100).toFixed(0)}%</span>
                </div>
                <input
                  type="range"
                  min="0.03"
                  max="1.5"
                  step="0.01"
                  className="w-full h-1.5 bg-gray-200 rounded-none appearance-none cursor-pointer accent-blue-600"
                  value={selected?.decalScale || 0.15}
                  onChange={(e) => {
                    const v = parseFloat(e.target.value);
                    safeUpdate({ decalScale: v, decalScaleX: v, decalScaleY: v });
                  }}
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-3">
                  <p className="text-[9px] font-semibold text-gray-400 uppercase tracking-widest">Width (Horizontal Stretch)</p>
                  <span className="text-[10px] font-semibold text-blue-600">{((selected?.decalScaleX !== undefined ? selected.decalScaleX : (selected?.decalScale || 0.15)) * 100).toFixed(0)}%</span>
                </div>
                <input
                  type="range"
                  min="0.03"
                  max="1.5"
                  step="0.01"
                  className="w-full h-1.5 bg-gray-200 rounded-none appearance-none cursor-pointer accent-blue-600"
                  value={selected?.decalScaleX !== undefined ? selected.decalScaleX : (selected?.decalScale || 0.15)}
                  onChange={(e) => safeUpdate({ decalScaleX: parseFloat(e.target.value) })}
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-3">
                  <p className="text-[9px] font-semibold text-gray-400 uppercase tracking-widest">Height (Vertical Stretch)</p>
                  <span className="text-[10px] font-semibold text-blue-600">{((selected?.decalScaleY !== undefined ? selected.decalScaleY : (selected?.decalScale || 0.15)) * 100).toFixed(0)}%</span>
                </div>
                <input
                  type="range"
                  min="0.03"
                  max="1.5"
                  step="0.01"
                  className="w-full h-1.5 bg-gray-200 rounded-none appearance-none cursor-pointer accent-blue-600"
                  value={selected?.decalScaleY !== undefined ? selected.decalScaleY : (selected?.decalScale || 0.15)}
                  onChange={(e) => safeUpdate({ decalScaleY: parseFloat(e.target.value) })}
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-3">
                  <p className="text-[9px] font-semibold text-gray-400 uppercase tracking-widest">Rotation</p>
                  <span className="text-[10px] font-semibold text-blue-600">{Math.round((selected?.rotation || 0) * 180 / Math.PI)}°</span>
                </div>
                <input
                  type="range"
                  min="-180"
                  max="180"
                  step="1"
                  className="w-full h-1.5 bg-gray-200 rounded-none appearance-none cursor-pointer accent-blue-600"
                  value={Math.round((selected?.rotation || 0) * 180 / Math.PI)}
                  onChange={(e) => safeUpdate({ rotation: parseFloat(e.target.value) * Math.PI / 180 })}
                />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const logoCategories = [
  {
    name: 'TAIL SWEEP', icon: <BiWater />,
    items: [
      { name: 'Classic Swoosh', url: 'https://raw.githubusercontent.com/FortAwesome/Font-Awesome/6.x/svgs/solid/wind.svg' },
      { name: 'Wave Sweep', url: 'https://raw.githubusercontent.com/FortAwesome/Font-Awesome/6.x/svgs/solid/water.svg' },
      { name: 'Power Line', url: 'https://raw.githubusercontent.com/FortAwesome/Font-Awesome/6.x/svgs/solid/bolt.svg' }
    ]
  },
  {
    name: 'FLAGS & SYMBOLS', icon: <BiFlag />,
    items: [
      { name: 'USA Flag', url: 'https://flagcdn.com/us.svg' },
      { name: 'UK Flag', url: 'https://flagcdn.com/gb.svg' },
      { name: 'Golden Star', url: 'https://raw.githubusercontent.com/FortAwesome/Font-Awesome/6.x/svgs/solid/star.svg' },
      { name: 'Shield', url: 'https://raw.githubusercontent.com/FortAwesome/Font-Awesome/6.x/svgs/solid/shield-halved.svg' }
    ]
  },
  {
    name: 'SPORT BALLS & ICONS', icon: <BiFootball />,
    items: [
      { name: 'Basketball', url: 'https://raw.githubusercontent.com/FortAwesome/Font-Awesome/6.x/svgs/solid/basketball.svg' },
      { name: 'Soccer Ball', url: 'https://raw.githubusercontent.com/FortAwesome/Font-Awesome/6.x/svgs/solid/futbol.svg' },
      { name: 'Baseball', url: 'https://raw.githubusercontent.com/FortAwesome/Font-Awesome/6.x/svgs/solid/baseball.svg' },
      { name: 'Trophy', url: 'https://raw.githubusercontent.com/FortAwesome/Font-Awesome/6.x/svgs/solid/trophy.svg' }
    ]
  },
  {
    name: 'WOLVES & DOGS', icon: <FaPaw />,
    items: [
      { name: 'Wolf Head', url: 'https://raw.githubusercontent.com/FortAwesome/Font-Awesome/6.x/svgs/solid/dog.svg' },
      { name: 'Paw Print', url: 'https://raw.githubusercontent.com/FortAwesome/Font-Awesome/6.x/svgs/solid/paw.svg' }
    ]
  },
  { name: 'CATS', icon: <FaCat />, items: [{ name: 'Cat Icon', url: 'https://raw.githubusercontent.com/FortAwesome/Font-Awesome/6.x/svgs/solid/cat.svg' }] },
  { name: 'PEOPLE', icon: <BiUserCircle />, items: [{ name: 'Athlete', url: 'https://raw.githubusercontent.com/FortAwesome/Font-Awesome/6.x/svgs/solid/user-ninja.svg' }] },
  { name: 'BIRDS & THINGS WITH WINGS', icon: <FaCrow />, items: [{ name: 'Eagle', url: 'https://raw.githubusercontent.com/FortAwesome/Font-Awesome/6.x/svgs/solid/crow.svg' }] },
  { name: 'BEARS & TUSKS', icon: <FaHippo />, items: [{ name: 'Bear', url: 'https://raw.githubusercontent.com/FortAwesome/Font-Awesome/6.x/svgs/solid/hippo.svg' }] },
  { name: 'REPTILES & SEA CREATURES', icon: <BiBug />, items: [{ name: 'Dragon', url: 'https://raw.githubusercontent.com/FortAwesome/Font-Awesome/6.x/svgs/solid/dragon.svg' }] },
  { name: 'HORSES & HOOVES', icon: <FaHorse />, items: [{ name: 'Horse', url: 'https://raw.githubusercontent.com/FortAwesome/Font-Awesome/6.x/svgs/solid/horse.svg' }] },
  { name: 'MISC. LOGOS', icon: <BiStar />, items: [{ name: 'Crown', url: 'https://raw.githubusercontent.com/FortAwesome/Font-Awesome/6.x/svgs/solid/crown.svg' }] },
  { name: 'WATERMARKS', icon: <BiGhost />, items: [{ name: 'Ghost', url: 'https://raw.githubusercontent.com/FortAwesome/Font-Awesome/6.x/svgs/solid/ghost.svg' }] },
];

const LogosFlagsTab = ({ decals, selectedDecalId, setSelectedDecalId, addDecal, updateDecal, removeDecal }) => {
  const imageDecals = decals.filter(d => d.type === 'image');
  const selected = imageDecals.find(d => d.id === selectedDecalId);
  const [expandedCat, setExpandedCat] = useState(null);

  const handleUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const url = URL.createObjectURL(file);
    addDecal('image', file.name.replace(/\.[^.]+$/, ''), url);
    e.target.value = '';
  };

  const safeUpdate = (updates) => {
    if (!selected) return;
    updateDecal(selected.id, updates);
  };

  return (
    <div className="flex flex-col bg-white">
      {/* ADD LOGO - PREMIUM OVERHAUL */}
      <div className="p-6 bg-white border-b border-gray-50">
        <h3 className="text-[9px] font-semibold text-gray-400 uppercase tracking-widest mb-4">Add Components</h3>
        <label className="group relative flex flex-col items-center justify-center py-10 border border-dashed border-gray-200 rounded-none bg-gray-50/30 hover:bg-blue-50/30 hover:border-blue-600 transition-all cursor-pointer overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-transparent to-blue-50/10 opacity-0 group-hover:opacity-100 transition-opacity" />
          <div className="w-12 h-12 rounded-none bg-white shadow-sm border border-gray-100 flex items-center justify-center text-gray-400 group-hover:text-blue-600 group-hover:scale-110 transition-all mb-4">
            <HiOutlineCloudUpload size={24} className="animate-bounce-subtle" />
          </div>
          <div className="text-center relative z-10">
            <p className="text-[10px] font-semibold text-gray-900 uppercase tracking-widest">Upload Custom Artwork</p>
            <p className="text-[8px] text-gray-400 uppercase tracking-widest mt-1">PNG, SVG, JPG (Max 5MB)</p>
          </div>
          <input type="file" accept="image/*" className="hidden" onChange={handleUpload} />
        </label>
      </div>

      {/* ACTIVE LOGOS LIST */}
      {imageDecals.length > 0 && (
        <div className="p-6 bg-white border-b border-gray-50">
          <h3 className="text-[9px] font-semibold text-gray-400 uppercase tracking-widest mb-4 flex items-center justify-between">
            <span>Active Logos</span>
            <span className="text-[8px] bg-gray-100 px-2 py-0.5 rounded-none text-gray-400 border border-gray-100">{imageDecals.length}</span>
          </h3>
          <div className="space-y-1.5">
            {imageDecals.map(d => (
              <div
                key={d.id}
                onClick={() => setSelectedDecalId(d.id)}
                className={`p-3.5 rounded-none border transition-all flex items-center justify-between bg-white cursor-pointer ${selectedDecalId === d.id ? 'border-blue-600 bg-blue-50/20' : 'border-gray-50 hover:border-gray-100'}`}
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-none border border-gray-100 bg-cover bg-center flex-shrink-0" style={{ backgroundImage: `url(${d.imageUrl})` }} />
                  <div className="flex flex-col text-left">
                    <span className="text-[10px] font-semibold truncate max-w-[150px]">{d.text || 'Logo'}</span>
                    <span className="text-[7px] font-semibold text-gray-300 uppercase mt-0.5">SIZE {((d.decalScale || 0.12) * 100).toFixed(0)}%</span>
                  </div>
                </div>
                <button onClick={(e) => { e.stopPropagation(); removeDecal(d.id); }} className="w-5 h-5 flex items-center justify-center text-gray-200 hover:text-red-500 transition-colors"><BiTrash /></button>
              </div>
            ))}
          </div>

          {selected && (
            <div className="mt-6 p-4 bg-gray-50 rounded-none border border-gray-100 space-y-6 text-left">
              {/* Tip Banner */}
              <div className="p-3 bg-blue-50/50 border border-blue-100 rounded-none text-[8.5px] text-blue-700/80 font-bold uppercase tracking-wider flex items-center gap-2">
                <span className="text-xs">💡</span>
                <span>Tip: click anywhere on the 3D model to move this layer.</span>
              </div>

              {/* Sizing & Stretching */}
              <div className="space-y-4 pt-4 border-t border-gray-200">
                <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">Sizing & Stretching</p>

                {/* Uniform Scale */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[9px] font-semibold text-gray-500 uppercase tracking-wider">Overall Scale (Uniform)</span>
                    <span className="text-[10px] font-semibold text-blue-600">{((selected.decalScale || 0.12) * 100).toFixed(0)}%</span>
                  </div>
                  <input
                    type="range"
                    min="0.03"
                    max="4.0"
                    step="0.01"
                    className="w-full h-1.5 bg-gray-200 rounded-none appearance-none cursor-pointer accent-blue-600"
                    value={selected.decalScale || 0.12}
                    onChange={(e) => {
                      const v = parseFloat(e.target.value);
                      safeUpdate({ decalScale: v, decalScaleX: v, decalScaleY: v });
                    }}
                  />
                </div>

                {/* Horizontal Stretch (Width) */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[9px] font-semibold text-gray-500 uppercase tracking-wider">Width (Horizontal Stretch)</span>
                    <span className="text-[10px] font-semibold text-blue-600">{((selected.decalScaleX !== undefined ? selected.decalScaleX : (selected.decalScale || 0.12)) * 100).toFixed(0)}%</span>
                  </div>
                  <input
                    type="range"
                    min="0.03"
                    max="4.0"
                    step="0.01"
                    className="w-full h-1.5 bg-gray-200 rounded-none appearance-none cursor-pointer accent-blue-600"
                    value={selected.decalScaleX !== undefined ? selected.decalScaleX : (selected.decalScale || 0.12)}
                    onChange={(e) => safeUpdate({ decalScaleX: parseFloat(e.target.value) })}
                  />
                </div>

                {/* Vertical Stretch (Height) */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[9px] font-semibold text-gray-500 uppercase tracking-wider">Height (Vertical Stretch)</span>
                    <span className="text-[10px] font-semibold text-blue-600">{((selected.decalScaleY !== undefined ? selected.decalScaleY : (selected.decalScale || 0.12)) * 100).toFixed(0)}%</span>
                  </div>
                  <input
                    type="range"
                    min="0.03"
                    max="4.0"
                    step="0.01"
                    className="w-full h-1.5 bg-gray-200 rounded-none appearance-none cursor-pointer accent-blue-600"
                    value={selected.decalScaleY !== undefined ? selected.decalScaleY : (selected.decalScale || 0.12)}
                    onChange={(e) => safeUpdate({ decalScaleY: parseFloat(e.target.value) })}
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-3">
                  <p className="text-[9px] font-semibold text-gray-400 uppercase tracking-widest">Rotation</p>
                  <span className="text-[10px] font-semibold text-blue-600">{Math.round((selected.rotation || 0) * 180 / Math.PI)}°</span>
                </div>
                <input
                  type="range"
                  min="-180"
                  max="180"
                  step="1"
                  className="w-full h-1.5 bg-gray-200 rounded-none appearance-none cursor-pointer accent-blue-600"
                  value={Math.round((selected.rotation || 0) * 180 / Math.PI)}
                  onChange={(e) => safeUpdate({ rotation: parseFloat(e.target.value) * Math.PI / 180 })}
                />
              </div>
            </div>
          )}
        </div>
      )}

      {/* LOGO CATEGORIES */}
      <div className="flex-1">
        {logoCategories.map((cat, i) => (
          <div key={cat.name} className="border-b border-gray-50 bg-white">
            <button
              onClick={() => setExpandedCat(expandedCat === i ? null : i)}
              className={`w-full flex items-center justify-between px-5 py-3.5 transition-colors cursor-pointer hover:bg-gray-50 ${expandedCat === i ? 'bg-gray-50' : ''}`}
            >
              <div className="flex items-center gap-3">
                <span className={`text-lg transition-colors ${expandedCat === i ? 'text-blue-600' : 'text-gray-400'}`}>{cat.icon}</span>
                <span className={`text-[10px] font-semibold uppercase tracking-widest ${expandedCat === i ? 'text-gray-900' : 'text-gray-400'}`}>{cat.name}</span>
              </div>
              <span className={`text-[10px] transition-transform duration-300 ${expandedCat === i ? 'rotate-45 text-blue-600' : 'text-gray-300'}`}>＋</span>
            </button>
            {expandedCat === i && (
              <div className="p-4 bg-white border-t border-gray-50">
                <div className="grid grid-cols-3 gap-2">
                  {cat.items?.map((item, idx) => (
                    <button
                      key={idx}
                      onClick={() => addDecal('image', item.name, item.url)}
                      className="aspect-square bg-gray-50 border border-gray-100 rounded-none p-2 hover:border-blue-600 hover:bg-blue-50 transition-all flex flex-col items-center justify-center gap-1 group cursor-pointer"
                    >
                      <img src={item.url} alt={item.name} className="w-full h-full object-contain opacity-60 group-hover:opacity-100 transition-opacity" />
                      <span className="text-[6px] font-semibold text-gray-400 uppercase truncate w-full text-center group-hover:text-blue-600">{item.name}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

const StudioConfigTab = ({ globalPattern, setGlobalPattern, lightingPreset, setLightingPreset, materialFinish, setMaterialFinish, mouseFollow, setMouseFollow }) => {
  const [openSection, setOpenSection] = useState('pattern');

  const renderSection = (id, label, icon, content) => {
    const isOpen = openSection === id;
    return (
      <div className="bg-white border-b border-gray-50">
        <button
          onClick={() => setOpenSection(isOpen ? null : id)}
          className={`w-full flex items-center justify-between px-5 py-4 hover:bg-gray-50 transition-colors cursor-pointer ${isOpen ? 'bg-gray-50' : ''}`}
        >
          <div className="flex items-center gap-3">
            <span className={`text-lg transition-colors ${isOpen ? 'text-blue-600' : 'text-gray-400'}`}>{icon}</span>
            <span className={`text-[10px] font-semibold uppercase tracking-widest ${isOpen ? 'text-gray-900' : 'text-gray-400'}`}>{label}</span>
          </div>
          <span className={`text-[10px] transition-transform duration-300 ${isOpen ? 'rotate-45 text-blue-600' : 'text-gray-300'}`}>＋</span>
        </button>
        {isOpen && <div className="p-5 bg-white">{content}</div>}
      </div>
    );
  };

  return (
    <div className="flex flex-col bg-white h-full font-['Outfit']">
      {renderSection('pattern', 'Fabric Options', <HiOutlineCube />, (
        <div className="grid grid-cols-2 gap-2">
          {['none', 'carbon', 'camo', 'dots'].map(p => (
            <button key={p} onClick={() => setGlobalPattern(p === 'none' ? null : p)} className={`py-3 rounded-none text-[9px] font-semibold uppercase tracking-widest border transition-all ${globalPattern === p || (p === 'none' && !globalPattern) ? 'border-blue-600 bg-blue-50 text-blue-600' : 'border-gray-100 text-gray-400 hover:border-gray-300'}`}>{p}</button>
          ))}
        </div>
      ))}
      {renderSection('finish', 'Material Finish', <HiOutlineColorSwatch />, (
        <div className="grid grid-cols-3 gap-2">
          {['matte', 'gloss', 'metallic'].map(f => (
            <button key={f} onClick={() => setMaterialFinish(f)} className={`py-3 rounded-none text-[9px] font-semibold uppercase tracking-widest border transition-all ${materialFinish === f ? 'border-blue-600 bg-blue-50 text-blue-600' : 'border-gray-100 text-gray-400 hover:border-gray-300'}`}>{f}</button>
          ))}
        </div>
      ))}
      {renderSection('lighting', 'Studio Lighting', <HiOutlineLightningBolt />, (
        <div className="grid grid-cols-3 gap-2">
          {['city', 'studio', 'night'].map(l => (
            <button key={l} onClick={() => setLightingPreset(l)} className={`py-3 rounded-none text-[9px] font-semibold uppercase tracking-widest border transition-all ${lightingPreset === l ? 'border-blue-600 bg-blue-50 text-blue-600' : 'border-gray-100 text-gray-400 hover:border-gray-300'}`}>{l}</button>
          ))}
        </div>
      ))}
      {renderSection('interaction', 'Viewport Settings', <HiOutlineCursorClick />, (
        <div className="space-y-4">
          <button onClick={() => setMouseFollow(!mouseFollow)} className={`w-full py-3.5 rounded-none text-[10px] font-semibold uppercase tracking-widest border transition-all flex items-center justify-center gap-3 ${mouseFollow ? 'bg-blue-600 text-white border-blue-600' : 'bg-white text-gray-400 border-gray-100 hover:border-blue-600'}`}>
            <div className={`w-2 h-2 rounded-none ${mouseFollow ? 'bg-white' : 'bg-gray-200'}`} />
            360 Mouse Follow: {mouseFollow ? 'ACTIVE' : 'OFF'}
          </button>
        </div>
      ))}
    </div>
  );
};

const CheckoutRosterTab = ({ roster, setRoster, onCheckout }) => {
  const [isPersonalized, setIsPersonalized] = useState(true);
  const addRow = () => setRoster([...roster, { id: Date.now(), name: '', number: '', size: 'L' }]);
  const removeRow = (id) => roster.length > 1 && setRoster(roster.filter(r => r.id !== id));
  const updateRow = (id, field, value) => setRoster(roster.map(r => r.id === id ? { ...r, [field]: value } : r));

  return (
    <div className="flex flex-col bg-white h-full">
      <div className="p-6 bg-white border-b border-gray-50">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-[10px] font-semibold uppercase tracking-widest text-gray-800">Order Roster</h3>
            <p className="text-[8px] font-semibold text-gray-400 uppercase mt-1">{roster.length} Total Units</p>
          </div>
          <button onClick={addRow} className="flex items-center gap-2 px-3 py-2 bg-blue-600 text-white rounded-none text-[9px] font-semibold uppercase tracking-widest shadow-lg shadow-blue-500/10"><HiOutlineUserAdd /> Add Unit</button>
        </div>
        <div className="flex items-center justify-between bg-gray-50 rounded-none p-3 border border-gray-100">
          <div className="flex items-center gap-3">
            <div className={`w-8 h-8 rounded-none flex items-center justify-center text-sm ${isPersonalized ? 'bg-blue-100 text-blue-600' : 'bg-gray-200 text-gray-400'}`}><BiText /></div>
            <div>
              <p className="text-[9px] font-semibold uppercase tracking-widest text-gray-700">Personalization</p>
              <p className="text-[7px] font-semibold text-gray-400 uppercase">Names & Numbers</p>
            </div>
          </div>
          <button onClick={() => setIsPersonalized(!isPersonalized)} className={`w-10 h-5 rounded-full relative transition-all duration-300 ${isPersonalized ? 'bg-blue-600' : 'bg-gray-300'}`}><div className={`absolute top-1 w-3 h-3 bg-white rounded-full transition-all duration-300 ${isPersonalized ? 'left-6' : 'left-1'}`} /></button>
        </div>
      </div>
      <div className="flex-1 overflow-y-auto h-[calc(100%-10rem)] p-4 py-12 space-y-3 right-scroll" data-lenis-prevent>
        {roster.map((row, index) => (
          <div key={row.id} className="bg-white rounded-none border border-gray-50 p-3 relative group">
            <div className="flex items-center gap-3">
              <div className="w-6 h-6 rounded-none bg-gray-50 flex items-center justify-center text-[9px] font-semibold text-gray-400 border border-gray-100">{index + 1}</div>
              <div className="flex-1 grid grid-cols-12 gap-2">
                {isPersonalized ? (
                  <>
                    <div className="col-span-6"><input type="text" value={row.name} onChange={(e) => updateRow(row.id, 'name', e.target.value.toUpperCase())} placeholder="PLAYER NAME" className="w-full bg-gray-50 border-none px-2 py-2 text-[10px] font-semibold focus:ring-1 focus:ring-blue-600 transition-all" /></div>
                    <div className="col-span-3"><input type="text" value={row.number} onChange={(e) => updateRow(row.id, 'number', e.target.value)} placeholder="00" maxLength={3} className="w-full bg-gray-50 border-none px-2 py-2 text-[10px] font-semibold text-center focus:ring-1 focus:ring-blue-600 transition-all" /></div>
                    <div className="col-span-3"><select value={row.size} onChange={(e) => updateRow(row.id, 'size', e.target.value)} className="w-full bg-gray-50 border-none px-2 py-2 text-[10px] font-semibold appearance-none focus:ring-1 focus:ring-blue-600 transition-all cursor-pointer">{['YS', 'YM', 'YL', 'S', 'M', 'L', 'XL', '2XL', '3XL'].map(s => <option key={s} value={s}>{s}</option>)}</select></div>
                  </>
                ) : (
                  <div className="col-span-12 flex items-center justify-between bg-gray-50 px-3 py-1.5"><span className="text-[10px] font-semibold text-gray-400 uppercase tracking-widest">Select Size</span><select value={row.size} onChange={(e) => updateRow(row.id, 'size', e.target.value)} className="bg-transparent border-none py-1 text-[12px] font-semibold text-blue-600 appearance-none focus:ring-0 cursor-pointer text-right">{['YS', 'YM', 'YL', 'S', 'M', 'L', 'XL', '2XL', '3XL'].map(s => <option key={s} value={s}>{s}</option>)}</select></div>
                )}
              </div>
              <button onClick={() => removeRow(row.id)} className="w-6 h-6 flex items-center justify-center text-gray-200 hover:text-red-500 transition-colors"><HiOutlineTrash /></button>
            </div>
          </div>
        ))}
      </div>
      <div className="p-6 bg-white border-t border-gray-100">
        <button onClick={onCheckout} className="w-full bg-blue-600 text-white py-4 rounded-none text-[11px] font-semibold uppercase tracking-[0.2em] shadow-xl shadow-blue-500/20 hover:bg-blue-700 transition-all flex items-center justify-center gap-3">Finalize & Checkout <div className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" /></button>
      </div>
    </div>
  );
};

const RightPanel = (props) => {
  const [activeTab, setActiveTab] = useState('colors');
  const mainTabs = [
    { id: 'colors', label: 'Colors Patterns', icon: <BiPalette /> },
    { id: 'names', label: 'Names Numbers', icon: <BiText /> },
    { id: 'logos', label: 'Logos Flags', icon: <BiImage /> },
    { id: 'config', label: 'Studio Config', icon: <HiOutlineAdjustments /> },
    { id: 'roster', label: 'Checkout Roster', icon: <BiCart /> },
  ];

  return (
    <div className="flex flex-1 md:flex-none w-full md:w-[420px] h-full flex-shrink-0 border-t md:border-t-0 md:border-l border-gray-100 bg-white flex-col z-50 relative overflow-hidden min-h-0">
      <div className="flex border-b border-gray-100 bg-white flex-shrink-0 overflow-x-auto no-scrollbar scroll-smooth">
        {mainTabs.map(tab => (
          <button key={tab.id} onClick={() => setActiveTab(tab.id)} className={`flex-1 min-w-[80px] md:min-w-0 py-4 px-1 flex flex-col items-center gap-2 transition-all relative cursor-pointer flex-shrink-0 rounded-none ${activeTab === tab.id ? 'text-blue-600 bg-white' : 'text-gray-400 hover:text-gray-900 hover:bg-gray-50'}`}>
            <span className="text-xl">{tab.icon}</span>
            <span className="text-[8px] font-semibold uppercase tracking-widest text-center leading-tight">
              {tab.label.split(' ').map((s, i) => <span key={i} className="block">{s}</span>)}
            </span>
            {activeTab === tab.id && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600" />}
          </button>
        ))}
      </div>

      <div className="px-6 py-4 border-b border-gray-50 flex items-center justify-between bg-white flex-shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-none bg-blue-50 flex items-center justify-center text-blue-600 border border-blue-100"><BiCube size={22} /></div>
          <div>
            <div className="text-[10px] font-semibold text-gray-900 uppercase tracking-widest">{props.activeMesh ? props.activeMesh.replace(/_/g, ' ') : 'Select Part'}</div>
            <div className="text-[8px] font-semibold text-gray-400 uppercase tracking-widest mt-0.5">Active Workspace</div>
          </div>
        </div>
        <div className="px-2 py-1 rounded-none border border-green-200 bg-green-50 text-green-600 text-[8px] font-semibold tracking-widest uppercase">Live View</div>
      </div>

      <div className="flex-1 relative min-h-0">
        <div className="absolute inset-0 overflow-y-auto overflow-x-hidden touch-auto custom-scrollbar pb-24" data-lenis-prevent onWheel={(e) => e.stopPropagation()} style={{ WebkitOverflowScrolling: 'touch' }}>
          {activeTab === 'colors' ? (
            <MeshProperties
              state={props.meshStates[props.activeMesh]}
              updateProp={(prop, val) => props.updateMeshProp(props.activeMesh, prop, val)}
              meshStates={props.meshStates}
              updateMeshStates={props.updateMeshStates}
              activeMesh={props.activeMesh}
              updateMeshProp={props.updateMeshProp}
              addDecal={props.addDecal}
              decals={props.decals}
              selectedDecalId={props.selectedDecalId}
              setSelectedDecalId={props.setSelectedDecalId}
              updateDecal={props.updateDecal}
              removeDecal={props.removeDecal}
            />
          ) : activeTab === 'names' ? (
            <NamesNumbersTab {...props} />
          ) : activeTab === 'logos' ? (
            <LogosFlagsTab {...props} />
          ) : activeTab === 'config' ? (
            <StudioConfigTab {...props} />
          ) : (
            <CheckoutRosterTab roster={props.roster} setRoster={props.setRoster} onCheckout={props.onCheckout} />
          )}
        </div>
      </div>

      <div className="px-4 py-2 bg-gray-50 border-t border-gray-100 flex items-center justify-between flex-shrink-0">
        <div className="flex items-center gap-2">
          <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse shadow-[0_0_8px_rgba(34,197,94,0.5)]" />
          <span className="text-[8px] font-semibold text-gray-400 uppercase tracking-widest">Workspace Connected</span>
        </div>
      </div>
    </div>
  );
};

export default RightPanel;
