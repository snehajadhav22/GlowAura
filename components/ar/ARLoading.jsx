'use client';
import { Sparkles, Heart } from 'lucide-react';

export default function ARLoading({ progress = 0, message = 'Get Ready to Glow...' }) {
  return (
    <div className="absolute inset-0 z-50 bg-gradient-to-br from-pink-50 via-white to-purple-50 backdrop-blur-xl flex flex-col items-center justify-center">
      {/* Floating Sparkles in background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 animate-float opacity-30">✨</div>
        <div className="absolute top-1/2 right-1/4 animate-float opacity-20" style={{ animationDelay: '1s' }}>💖</div>
        <div className="absolute bottom-1/4 left-1/3 animate-float opacity-40" style={{ animationDelay: '0.5s' }}>✨</div>
      </div>

      <div className="text-center relative z-10">
        {/* Animated icon */}
        <div className="relative w-32 h-32 mx-auto mb-10">
          {/* Pulsing outer rings */}
          <div className="absolute inset-0 border-4 border-pink-200 rounded-full animate-ping opacity-20" />
          <div className="absolute inset-0 border-4 border-purple-200 rounded-full animate-pulse opacity-40" />
          
          {/* Rotating borders */}
          <div className="absolute inset-0 border-2 border-dashed border-pink-400/30 rounded-full animate-spin" style={{ animationDuration: '8s' }} />

          {/* Center icon */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-pink-400 to-purple-500 flex items-center justify-center shadow-2xl shadow-pink-200 animate-float">
              <Sparkles size={40} className="text-white animate-pulse" />
            </div>
          </div>
        </div>

        <h3 className="text-gray-800 text-3xl font-black font-playfair mb-3">{message}</h3>
        <p className="text-pink-400 text-xs font-black uppercase tracking-[0.3em] mb-8">Preparing your virtual studio ✨</p>

        {/* Aesthetic Progress bar */}
        <div className="w-72 mx-auto relative">
          <div className="h-3 bg-pink-100/50 rounded-full overflow-hidden mb-3 border border-pink-50 p-0.5">
            <div
              className="h-full bg-gradient-to-r from-pink-400 via-purple-400 to-pink-500 rounded-full transition-all duration-700 ease-out"
              style={{
                width: `${progress}%`,
                boxShadow: '0 0 15px rgba(236, 72, 153, 0.4)',
              }}
            />
          </div>
          <div className="flex justify-between items-center px-1">
             <span className="text-[10px] font-black text-pink-300 uppercase tracking-widest">{progress < 100 ? 'Loading Beauty...' : 'Glow Ready!'}</span>
             <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{progress}%</span>
          </div>
        </div>

        {/* Fun loading text steps */}
        <div className="mt-10 space-y-3">
          {[
            [20, 'Matching your vibe...'],
            [50, 'Loading all the pink...'],
            [80, 'Curating your shades...'],
            [100, 'Time to shine, bestie! 💖'],
          ].map(([threshold, label]) => (
            <div key={threshold} className={`flex items-center gap-3 justify-center text-xs font-bold transition-all duration-700
              ${progress >= threshold ? 'text-pink-600 scale-105' : 'text-gray-300'}`}>
              <span className={`w-5 h-5 rounded-lg border-2 flex items-center justify-center text-[10px] transition-colors
                ${progress >= threshold ? 'border-pink-500 bg-pink-500 text-white shadow-lg shadow-pink-100' : 'border-gray-100'}`}>
                {progress >= threshold ? '✓' : ''}
              </span>
              <span className="uppercase tracking-tight">{label}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}