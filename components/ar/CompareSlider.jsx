'use client';
import { useCallback, useRef, useState } from 'react';

export default function CompareSlider({ active, split, onSplitChange, shadeA, shadeB }) {
  const sliderRef = useRef(null);
  const [dragging, setDragging] = useState(false);

  const handleMove = useCallback((clientX) => {
    if (!sliderRef.current) return;
    const rect = sliderRef.current.getBoundingClientRect();
    const x = Math.max(0, Math.min(1, (clientX - rect.left) / rect.width));
    onSplitChange(x);
  }, [onSplitChange]);

  if (!active) return null;

  return (
    <div
      ref={sliderRef}
      className="absolute inset-0 z-25 cursor-col-resize"
      onMouseDown={() => setDragging(true)}
      onMouseUp={() => setDragging(false)}
      onMouseLeave={() => setDragging(false)}
      onMouseMove={e => dragging && handleMove(e.clientX)}
      onTouchStart={() => setDragging(true)}
      onTouchEnd={() => setDragging(false)}
      onTouchMove={e => handleMove(e.touches[0].clientX)}
    >
      {/* Divider handle */}
      <div
        className="absolute top-0 bottom-0 w-0.5 bg-white/80 z-30"
        style={{ left: `${split * 100}%` }}
      >
        <div className="absolute top-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 bg-white rounded-full shadow-xl flex items-center justify-center">
          <span className="text-gray-600 text-xs font-bold">⇔</span>
        </div>
      </div>

      {/* Labels */}
      <div className="absolute top-4 left-4 z-30 bg-black/40 backdrop-blur-sm px-3 py-1.5 rounded-full flex items-center gap-2">
        <div className="w-3 h-3 rounded-full border border-white/50" style={{ background: shadeA }} />
        <span className="text-white text-[10px] font-semibold">Shade A</span>
      </div>
      <div className="absolute top-4 right-4 z-30 bg-black/40 backdrop-blur-sm px-3 py-1.5 rounded-full flex items-center gap-2">
        <div className="w-3 h-3 rounded-full border border-white/50" style={{ background: shadeB }} />
        <span className="text-white text-[10px] font-semibold">Shade B</span>
      </div>
    </div>
  );
}