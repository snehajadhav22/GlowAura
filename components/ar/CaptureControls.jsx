'use client';
import { Camera, FlipHorizontal2, Download, Share2, Save, X, Heart, Sparkles } from 'lucide-react';
import toast from 'react-hot-toast';

export default function CaptureControls({
  onCapture,
  onFlipCamera,
  capturedImage,
  onClearCapture,
  onSave,
  skinTone,
}) {
  const handleDownload = () => {
    if (!capturedImage) return;
    const a = document.createElement('a');
    a.href = capturedImage;
    a.download = `glowaura-look-${Date.now()}.png`;
    a.click();
    toast.success('Look downloaded! 📸');
  };

  const handleShare = async () => {
    if (!capturedImage || !navigator.share) {
      toast.error('Sharing not supported');
      return;
    }
    try {
      const blob = await (await fetch(capturedImage)).blob();
      const file = new File([blob], 'glowaura-look.png', { type: 'image/png' });
      await navigator.share({ title: 'My GlowAura Look', files: [file] });
    } catch { /* cancelled */ }
  };

  return (
    <>
      {/* Skin tone indicator — Aesthetic Style */}
      {skinTone && (
        <div className="absolute top-20 left-6 z-30 animate-in fade-in slide-in-from-left duration-700">
           <div className="bg-white/80 backdrop-blur-3xl rounded-[2rem] p-4 border border-white/50 shadow-2xl flex items-center gap-4">
              <div className="relative">
                 <div className="w-12 h-12 rounded-2xl border-4 border-white shadow-xl rotate-3" style={{ background: skinTone.hex }} />
                 <div className="absolute -top-1 -right-1 w-5 h-5 bg-pink-500 rounded-full flex items-center justify-center text-[10px] text-white shadow-md animate-pulse">✨</div>
              </div>
              <div>
                <p className="text-[10px] font-black text-pink-400 uppercase tracking-widest leading-none mb-1">Skin Profile</p>
                <p className="text-sm font-black text-gray-800 leading-tight tracking-tight uppercase">{skinTone.tone} & {skinTone.undertone}</p>
                <p className="text-[9px] font-bold text-gray-400 uppercase tracking-tighter italic">"Your tone is perfect, bestie! 💕"</p>
              </div>
           </div>
        </div>
      )}

      {/* Control Buttons — Vertical Floating Stack */}
      <div className="absolute right-6 top-1/2 -translate-y-1/2 z-30 flex flex-col gap-6 items-center">
        {/* Flip camera */}
        <button onClick={onFlipCamera}
          className="w-12 h-12 bg-white/80 backdrop-blur-xl rounded-2xl flex items-center justify-center text-pink-500 hover:text-pink-600 hover:scale-110 active:scale-95 shadow-xl border border-white/50 transition-all">
          <FlipHorizontal2 size={20} />
        </button>

        {/* Capture Main Button */}
        <div className="relative group">
           <div className="absolute inset-0 bg-pink-500 rounded-full animate-ping opacity-20 group-hover:opacity-40 transition-opacity" />
           <button onClick={onCapture}
             className="relative w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-2xl hover:scale-110 active:scale-90 transition-all border-8 border-pink-50">
             <Camera size={28} className="text-pink-600" />
           </button>
        </div>

        {/* Help/Info */}
        <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center text-white/60">
           <Sparkles size={20} className="animate-pulse" />
        </div>
      </div>

      {/* Capture preview modal — High Aesthetic Glassmorphism */}
      {capturedImage && (
        <div className="absolute inset-0 z-[60] bg-white/60 backdrop-blur-2xl flex items-center justify-center p-6 animate-in fade-in zoom-in duration-300">
          <div className="max-w-md w-full">
            <div className="relative group mb-8">
               <img src={capturedImage} alt="Captured look" className="w-full aspect-[3/4] object-cover rounded-[3rem] shadow-2xl border-[10px] border-white group-hover:scale-[1.02] transition-transform duration-500" />
               <div className="absolute -top-4 -right-4 p-4 bg-pink-500 text-white rounded-[1.5rem] shadow-xl animate-float">
                  <Heart size={24} fill="white" />
               </div>
               <div className="absolute bottom-6 left-6 right-6">
                  <div className="bg-white/80 backdrop-blur-xl p-4 rounded-2xl shadow-xl border border-white/50">
                     <p className="text-sm font-black text-gray-800 uppercase tracking-widest text-center">Your GlowAura Look ✨</p>
                  </div>
               </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <button onClick={handleDownload}
                className="flex items-center justify-center gap-2 bg-white text-gray-800 px-6 py-4 rounded-3xl font-black uppercase tracking-widest text-[10px] hover:bg-gray-50 transition-all shadow-xl shadow-gray-100">
                <Download size={14} /> Download
              </button>
              <button onClick={handleShare}
                className="flex items-center justify-center gap-2 bg-pink-100 text-pink-600 px-6 py-4 rounded-3xl font-black uppercase tracking-widest text-[10px] hover:bg-pink-200 transition-all shadow-xl shadow-pink-100">
                <Share2 size={14} /> Share Vibe
              </button>
              <button onClick={onSave}
                className="col-span-2 flex items-center justify-center gap-2 bg-gradient-to-r from-pink-500 to-purple-600 text-white px-6 py-5 rounded-3xl font-black uppercase tracking-widest text-xs hover:scale-[1.02] active:scale-95 transition-all shadow-2xl shadow-pink-200">
                <Save size={16} /> Save My Glow ✨
              </button>
              <button onClick={onClearCapture}
                className="col-span-2 flex items-center justify-center gap-2 text-gray-400 font-black uppercase tracking-widest text-[10px] py-4 rounded-3xl hover:text-gray-600 transition-all">
                <X size={14} /> Close
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}