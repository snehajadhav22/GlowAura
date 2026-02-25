'use client';
import { Heart } from 'lucide-react';

export default function FaceGuide({ visible, faceDetected }) {
  if (!visible) return null;

  return (
    <div className="absolute inset-0 z-20 pointer-events-none flex items-center justify-center bg-black/40 backdrop-blur-[2px]">
      <div className="relative">
        {/* Aesthetic Oval guide */}
        <div className="relative">
          <svg width="280" height="380" viewBox="0 0 260 340" className="opacity-80">
            <defs>
              <linearGradient id="guideGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#FF4FA3" />
                <stop offset="100%" stopColor="#9b5de5" />
              </linearGradient>
              <filter id="glow">
                <feGaussianBlur stdDeviation="2" result="blur" />
                <feComposite in="SourceGraphic" in2="blur" operator="over" />
              </filter>
            </defs>
            
            {/* Face oval with glow */}
            <ellipse cx="130" cy="170" rx="100" ry="140" fill="none"
              stroke="url(#guideGrad)" strokeWidth="3" strokeDasharray="15 8"
              filter="url(#glow)"
              className="animate-pulse" />

            {/* Corner sparkles */}
            <circle cx="30" cy="30" r="2" fill="#FF4FA3" className="animate-ping" />
            <circle cx="230" cy="30" r="2" fill="#9b5de5" className="animate-ping" style={{ animationDelay: '0.5s' }} />
            <circle cx="30" cy="310" r="2" fill="#9b5de5" className="animate-ping" style={{ animationDelay: '1s' }} />
            <circle cx="230" cy="310" r="2" fill="#FF4FA3" className="animate-ping" style={{ animationDelay: '1.5s' }} />
          </svg>

          {/* Floating Hearts */}
          <div className="absolute top-0 right-0 animate-bounce">💖</div>
          <div className="absolute bottom-10 left-0 animate-bounce" style={{ animationDelay: '1s' }}>✨</div>
        </div>

        {/* Message Bubble - Aesthetic Style */}
        <div className="absolute -bottom-20 left-1/2 -translate-x-1/2 w-max max-w-xs transition-all duration-500">
           <div className={`px-6 py-3 rounded-[1.5rem] text-xs font-black uppercase tracking-widest shadow-2xl backdrop-blur-md border-2 
             ${faceDetected
               ? 'bg-gradient-to-r from-green-400 to-emerald-500 text-white border-white/20'
               : 'bg-white/90 text-pink-500 border-pink-100 animate-bounce'
             }`}>
             <div className="flex items-center gap-2">
               {faceDetected ? '✓' : '✨'}
               {faceDetected ? 'Yass! Face Detected ✨' : 'Bestie, align your face here! 💖'}
             </div>
           </div>
        </div>
      </div>
    </div>
  );
}