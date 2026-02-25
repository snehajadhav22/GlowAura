'use client';
import { useState } from 'react';
import { Star } from 'lucide-react';

export function StarDisplay({ rating = 0, count, size = 14 }) {
  return (
    <div className="flex items-center gap-1">
      {[1,2,3,4,5].map(i => (
        <Star key={i} size={size}
          className={i <= Math.round(rating) ? 'text-amber-400 fill-amber-400' : 'text-gray-300 fill-gray-300'} />
      ))}
      {count !== undefined && <span className="text-xs text-gray-500 ml-1">({count})</span>}
    </div>
  );
}

export function StarPicker({ value, onChange }) {
  const [hover, setHover] = useState(0);
  return (
    <div className="flex items-center gap-1">
      {[1,2,3,4,5].map(i => (
        <button key={i} type="button"
          onClick={() => onChange(i)}
          onMouseEnter={() => setHover(i)}
          onMouseLeave={() => setHover(0)}
          className="transition-transform hover:scale-110">
          <Star size={24}
            className={(hover || value) >= i ? 'text-amber-400 fill-amber-400' : 'text-gray-300 fill-gray-300'} />
        </button>
      ))}
    </div>
  );
}