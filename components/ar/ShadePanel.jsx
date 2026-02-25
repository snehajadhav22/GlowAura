'use client';
import { useState } from 'react';
import { Minus, Plus, X, Sparkles, Layers, Check, Eye, Heart } from 'lucide-react';

const FINISHES = [
  { id: 'matte',   label: 'Matte',   icon: '⬤' },
  { id: 'satin',   label: 'Satin',   icon: '◉' },
  { id: 'glossy',  label: 'Glossy',  icon: '◎' },
  { id: 'shimmer', label: 'Shimmer', icon: '✦' },
];

export default function ShadePanel({
  product,
  shades,
  selectedShade,
  onSelectShade,
  intensity,
  onIntensityChange,
  finish,
  onFinishChange,
  onRemoveProduct,
  onAddProduct,
  recommendations,
  showBeforeAfter,
  onToggleBeforeAfter,
  compareMode,
  onToggleCompare,
  compareShadeB,
  onSelectCompareShade,
  activeProducts,
}) {
  const [tab, setTab] = useState('shades');

  return (
    <div className="absolute bottom-4 left-1/2 -translate-x-1/2 w-[94%] max-w-md z-30 transition-all duration-500">
      {/* Aesthetic Container */}
      <div className="bg-white/80 backdrop-blur-3xl border border-white/50 rounded-[2rem] shadow-2xl overflow-hidden p-4 relative">
        {/* Background hearts deco */}
        <div className="absolute -top-10 -right-10 text-6xl text-pink-500/5 rotate-12 pointer-events-none select-none">💖</div>

        {/* Quick controls top bar */}
        <div className="flex items-center justify-between gap-2 mb-4">
           <div className="flex bg-pink-50 p-1 rounded-xl">
              <button
                onClick={onToggleBeforeAfter}
                className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-widest transition-all
                  ${showBeforeAfter ? 'bg-pink-500 text-white shadow-lg shadow-pink-200' : 'text-pink-400 hover:text-pink-600'}`}>
                <Eye size={10} /> Live B/A
              </button>
              <button
                onClick={onToggleCompare}
                className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-widest transition-all
                  ${compareMode ? 'bg-purple-500 text-white shadow-lg shadow-purple-200' : 'text-purple-400 hover:text-purple-600'}`}>
                <Layers size={10} /> Compare
              </button>
           </div>
           
           <button className="w-8 h-8 rounded-xl bg-pink-50 flex items-center justify-center text-pink-500 hover:scale-110 active:scale-95 transition-all">
              <Heart size={16} />
           </button>
        </div>

        {/* Tabs for customization */}
        <div className="flex gap-1 mb-4 bg-gray-50/50 p-1 rounded-xl border border-gray-100/50">
          {['shades', 'intensity', 'finish'].map(t => (
            <button key={t} onClick={() => setTab(t)}
              className={`flex-1 py-2 rounded-lg text-[9px] font-black uppercase tracking-widest transition-all
                ${tab === t ? 'bg-white text-pink-600 shadow-sm' : 'text-gray-400 hover:text-pink-400'}`}>
              {t}
            </button>
          ))}
        </div>

        {/* CONTENT AREA */}
        <div className="min-h-[100px]">
          {/* TAB: Shades */}
          {tab === 'shades' && (
            <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
              {/* AI Recommendations */}
              {recommendations.length > 0 && (
                <div className="mb-4">
                  <p className="text-pink-500 text-[8px] font-black tracking-widest uppercase mb-2 flex items-center gap-2">
                    <Sparkles size={10} /> Bestie's Choice ✨
                  </p>
                  <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
                    {recommendations.map((rec, i) => (
                      <button key={i}
                        onClick={() => onSelectShade(rec.hex)}
                        className={`flex flex-col items-center gap-1.5 flex-shrink-0`}>
                        <div className={`w-10 h-10 rounded-xl transition-all shadow-md relative overflow-hidden
                          ${selectedShade === rec.hex ? 'ring-2 ring-pink-500 scale-105' : 'hover:scale-105'}`}
                          style={{ background: rec.hex }}>
                           {selectedShade === rec.hex && (
                              <div className="absolute inset-0 flex items-center justify-center bg-white/20">
                                 <Check size={12} className="text-white" />
                              </div>
                           )}
                        </div>
                        <span className="text-[8px] font-bold text-gray-500 max-w-[40px] truncate">{rec.name}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* All shades */}
              <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
                {shades.map((shade, i) => (
                  <button key={i}
                    onClick={() => compareMode ? onSelectCompareShade(shade.hex) : onSelectShade(shade.hex)}
                    className="flex flex-col items-center gap-1.5 flex-shrink-0">
                    <div className={`w-8 h-8 rounded-xl shadow-sm border transition-all
                      ${selectedShade === shade.hex ? 'border-pink-500 scale-105' : compareShadeB === shade.hex ? 'border-purple-400 scale-105 ring-1 ring-purple-100' : 'border-white hover:border-pink-200'}`}
                      style={{ background: shade.hex }} />
                    <span className="text-[8px] font-medium text-gray-400 max-w-[36px] truncate">{shade.name || `Shade ${i+1}`}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* TAB: Intensity */}
          {tab === 'intensity' && (
            <div className="flex flex-col gap-4 p-2 animate-in fade-in slide-in-from-bottom-2 duration-300">
               <div className="flex items-center justify-between">
                  <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Glow Intensity</p>
                  <span className="text-xs font-black text-pink-500">{Math.round(intensity * 100)}%</span>
               </div>
               <div className="flex items-center gap-4">
                  <span className="text-sm opacity-30">✨</span>
                  <input
                    type="range"
                    min="0.05"
                    max="1"
                    step="0.05"
                    value={intensity}
                    onChange={e => onIntensityChange(parseFloat(e.target.value))}
                    className="flex-1 accent-pink-500 h-1.5 cursor-pointer"
                  />
                  <span className="text-sm opacity-100">💖</span>
               </div>
            </div>
          )}

          {/* TAB: Finish */}
          {tab === 'finish' && (
            <div className="grid grid-cols-4 gap-2 animate-in fade-in slide-in-from-bottom-2 duration-300">
              {FINISHES.map(f => (
                <button key={f.id}
                  onClick={() => onFinishChange(f.id)}
                  className={`flex flex-col items-center gap-1.5 p-2 rounded-2xl transition-all
                    ${finish === f.id ? 'bg-pink-500 text-white shadow-lg' : 'bg-pink-50 text-pink-300 hover:bg-pink-100'}`}>
                  <span className="text-base">{f.icon}</span>
                  <span className="text-[8px] font-black uppercase tracking-tight">{f.label}</span>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Floating action for layering */}
        {activeProducts.length > 0 && (
          <div className="mt-4 flex items-center gap-2 overflow-x-auto scrollbar-hide">
            {activeProducts.map(ap => (
              <div key={ap.id} className="flex items-center gap-2 bg-pink-50 px-2.5 py-1 rounded-xl border border-pink-100 flex-shrink-0">
                <div className="w-3 h-3 rounded-full shadow-sm border border-white" style={{ background: ap.color }} />
                <span className="text-[8px] font-black uppercase text-pink-600 tracking-tight">{ap.type}</span>
                <button onClick={() => onRemoveProduct(ap.id)} className="text-pink-300 hover:text-pink-600 transition-colors">
                  <X size={10} />
                </button>
              </div>
            ))}
            <button onClick={onAddProduct}
              className="px-3 py-1.5 rounded-xl bg-gradient-to-r from-pink-400 to-purple-500 text-white text-[8px] font-black uppercase tracking-widest flex-shrink-0">
              + Layer ✨
            </button>
          </div>
        )}
      </div>
    </div>
  );
}