'use client';
import { useRouter, useSearchParams } from 'next/navigation';
import { useState, useCallback } from 'react';
import { ChevronDown, ChevronUp, X } from 'lucide-react';

const BRANDS = ['Lakme', 'Maybelline', 'Huda', 'MAC', 'Nykaa', "L'Oreal", 'Sugar', 'Colorbar'];
const CATEGORIES = ['Lipstick', 'Foundation', 'Eyeshadow', 'Skincare', 'Perfume', 'Haircare', 'Nailcare', 'Blush', 'Mascara', 'Eyeliner', 'Highlighter', 'Contour', 'Accessories'];
const DISCOUNTS = [{ label: '10% and above', val: 10 }, { label: '20% and above', val: 20 }, { label: '30% and above', val: 30 }, { label: '40% and above', val: 40 }];
const RATINGS = [4, 3, 2];
const GENDERS = ['Women', 'Men', 'Unisex'];
const COLORS = ['Red', 'Pink', 'Nude', 'Berry', 'Brown', 'Coral', 'Orange', 'Purple', 'Black', 'White', 'Beige'];

function Section({ title, children, defaultOpen = false }) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="border-b border-gray-100 last:border-0">
      <button onClick={() => setOpen(!open)}
        className="w-full flex justify-between items-center py-3 text-sm font-semibold text-gray-800 hover:text-pink-600 transition-colors">
        {title}
        {open ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
      </button>
      {open && <div className="pb-4">{children}</div>}
    </div>
  );
}

export default function FilterSidebar({ onClose }) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const get = (k) => searchParams.get(k) || '';
  const getA = (k) => get(k) ? get(k).split(',') : [];

  const push = useCallback((key, value) => {
    const p = new URLSearchParams(searchParams.toString());
    if (!value || value === '') p.delete(key);
    else p.set(key, value);
    p.set('page', '1');
    router.push(`/shop?${p.toString()}`);
  }, [searchParams, router]);

  const toggleArray = useCallback((key, val) => {
    const arr = getA(key);
    const next = arr.includes(val) ? arr.filter(v => v !== val) : [...arr, val];
    push(key, next.join(','));
  }, [searchParams]);

  const clearAll = () => router.push('/shop');

  const hasFilters = searchParams.toString().replace(/page=\d*&?/, '') !== '';

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="font-bold text-gray-900">Filters</h2>
        {hasFilters && (
          <button onClick={clearAll}
            className="text-xs text-pink-600 hover:text-pink-700 font-semibold flex items-center gap-1">
            <X size={13} /> Clear All
          </button>
        )}
        {onClose && (
          <button onClick={onClose} className="md:hidden p-1 hover:bg-gray-100 rounded-lg">
            <X size={18} />
          </button>
        )}
      </div>

      {/* Sort */}
      <Section title="Sort By" defaultOpen>
        <select value={get('sort')} onChange={e => push('sort', e.target.value)}
          className="w-full input-field !py-2 text-sm">
          {[
            ['newest', 'Newest First'], ['price-asc', 'Price: Low → High'],
            ['price-desc', 'Price: High → Low'], ['rating', 'Top Rated'],
            ['discount', 'Best Discount'], ['popularity', 'Popularity'],
          ].map(([v, l]) => <option key={v} value={v}>{l}</option>)}
        </select>
      </Section>

      {/* Price Range */}
      <Section title="Price Range" defaultOpen>
        <div className="space-y-2">
          {[
            ['Under ₹500', '', '500'], ['₹500 – ₹1000', '500', '1000'],
            ['₹1000 – ₹2000', '1000', '2000'], ['Above ₹2000', '2000', ''],
          ].map(([label, min, max]) => (
            <label key={label} className="flex items-center gap-2 cursor-pointer">
              <input type="radio" name="price"
                checked={get('minPrice') === min && get('maxPrice') === max}
                onChange={() => { push('minPrice', min); push('maxPrice', max); }}
                className="accent-pink-600"
              />
              <span className="text-sm text-gray-700">{label}</span>
            </label>
          ))}
        </div>
      </Section>

      {/* Brands */}
      <Section title="Brand">
        <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
          {BRANDS.map(b => (
            <label key={b} className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" checked={getA('brand').includes(b)}
                onChange={() => toggleArray('brand', b)} className="accent-pink-600 rounded" />
              <span className="text-sm text-gray-700">{b}</span>
            </label>
          ))}
        </div>
      </Section>

      {/* Category */}
      <Section title="Category">
        <div className="flex flex-wrap gap-2">
          {CATEGORIES.map(c => (
            <button key={c} onClick={() => toggleArray('category', c)}
              className={`px-2.5 py-1 rounded-lg text-xs font-medium border transition-all
                ${getA('category').includes(c)
                  ? 'bg-pink-600 text-white border-pink-600'
                  : 'border-gray-200 text-gray-600 hover:border-pink-400 hover:text-pink-600'}`}>
              {c}
            </button>
          ))}
        </div>
      </Section>

      {/* Discount */}
      <Section title="Discount">
        {DISCOUNTS.map(d => (
          <label key={d.val} className="flex items-center gap-2 mb-2 cursor-pointer">
            <input type="radio" name="discount"
              checked={get('discount') === String(d.val)}
              onChange={() => push('discount', d.val)}
              className="accent-pink-600"
            />
            <span className="text-sm text-gray-700">{d.label}</span>
          </label>
        ))}
      </Section>

      {/* Rating */}
      <Section title="Customer Rating">
        {RATINGS.map(r => (
          <label key={r} className="flex items-center gap-2 mb-2 cursor-pointer">
            <input type="radio" name="rating"
              checked={get('rating') === String(r)}
              onChange={() => push('rating', r)}
              className="accent-pink-600"
            />
            <span className="text-sm text-gray-700 flex items-center gap-1">
              {'⭐'.repeat(r)} {r}★ & above
            </span>
          </label>
        ))}
      </Section>

      {/* Gender */}
      <Section title="Gender">
        {GENDERS.map(g => (
          <label key={g} className="flex items-center gap-2 mb-2 cursor-pointer">
            <input type="radio" name="gender"
              checked={get('gender') === g}
              onChange={() => push('gender', g)}
              className="accent-pink-600"
            />
            <span className="text-sm text-gray-700">{g}</span>
          </label>
        ))}
      </Section>

      {/* Color */}
      <Section title="Shade / Color">
        <div className="flex flex-wrap gap-2">
          {COLORS.map(c => (
            <button key={c} onClick={() => toggleArray('color', c)}
              className={`px-2.5 py-1 rounded-full text-xs font-medium border transition-all
                ${getA('color').includes(c)
                  ? 'bg-pink-600 text-white border-pink-600'
                  : 'border-gray-200 text-gray-600 hover:border-pink-400'}`}>
              {c}
            </button>
          ))}
        </div>
      </Section>
    </div>
  );
}