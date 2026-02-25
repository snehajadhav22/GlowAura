'use client';
import Image   from 'next/image';
import Link    from 'next/link';
import { ShoppingBag, Heart, Star, Sparkles } from 'lucide-react';
import { useCart }  from '@/context/CartContext';
import { useAuth }  from '@/context/AuthContext';
import { formatPrice, salePrice } from '@/utils/formatters';
import api from '@/lib/axios';
import toast from 'react-hot-toast';

export default function ProductCard({ product }) {
  const { addItem }  = useCart();
  const { user }     = useAuth();
  const sale         = salePrice(product.price, product.discount);
  const img          = product.images?.[0]?.url || 'https://via.placeholder.com/400x400?text=No+Image';
  const inWishlist = user?.wishlist?.some(p => (typeof p === 'string' ? p : p._id) === product._id);

  const handleWishlist = async (e) => {
    e.preventDefault();
    if (!user) { toast.error('Please login first'); return; }
    try {
      await api.post(`/auth/wishlist/${product._id}`);
      toast.success(inWishlist ? 'Removed from wishlist' : 'Added to wishlist ❤️');
    } catch { toast.error('Something went wrong'); }
  };

  return (
    <div className="product-card group relative bg-[var(--card-bg)] border border-[var(--border-color)] rounded-3xl overflow-hidden transition-all duration-500 shadow-sm hover:shadow-2xl hover:-translate-y-2">
      {/* Image Container */}
      <div className="relative aspect-square overflow-hidden bg-pink-50 dark:bg-pink-900/10">
        <Image src={img} alt={product.title} fill sizes="(max-width:640px) 50vw, 33vw"
          className="object-cover group-hover:scale-110 transition-transform duration-1000 ease-out grayscale-[10%] group-hover:grayscale-0" />

        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5 z-10">
          {product.bestseller && (
            <span className="px-2.5 py-1 rounded-lg bg-white/90 dark:bg-black/80 backdrop-blur-md text-pink-600 dark:text-pink-400 shadow-sm border border-pink-100 dark:border-pink-900/30 text-[9px] font-black uppercase tracking-widest">
              🏆 Bestseller
            </span>
          )}
          {product.discount > 0 && (
            <span className="px-2.5 py-1 rounded-lg bg-rose-500 text-white shadow-md text-[9px] font-black uppercase tracking-widest animate-pulse">
              {product.discount}% OFF
            </span>
          )}
        </div>

        {/* Wishlist */}
        <button onClick={handleWishlist}
          className={`absolute top-3 right-3 w-10 h-10 rounded-2xl flex items-center justify-center
            backdrop-blur-md transition-all duration-500 shadow-xl z-10 border border-white/20
            ${inWishlist ? 'bg-rose-500 text-white' : 'bg-white/80 dark:bg-black/60 text-pink-300 dark:text-gray-500 hover:text-pink-500 hover:scale-110'}`}>
          <Heart size={18} fill={inWishlist ? 'currentColor' : 'none'} />
        </button>

        {/* Quick add overlay */}
        <div className="absolute inset-x-0 bottom-4 px-4 translate-y-full opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500 z-20">
          <div className="flex gap-2">
            <button
              onClick={(e) => { e.preventDefault(); addItem(product); }}
              className="flex-1 bg-white dark:bg-gray-900 text-gray-900 dark:text-white py-3.5 rounded-2xl text-[9px] font-black uppercase tracking-[0.2em]
                flex items-center justify-center gap-2 hover:bg-pink-500 hover:text-white dark:hover:bg-pink-600 transition-all shadow-2xl border border-pink-100 dark:border-white/10">
              Add Bag 💖
            </button>
            {['Lipstick','Foundation','Blush','Eyeshadow','Eyeliner','Mascara','Highlighter','Contour']
              .includes(product.category) && (
              <Link
                href={`/ar-studio/${product._id}`}
                onClick={(e) => e.stopPropagation()}
                className="bg-gradient-to-br from-pink-500 to-purple-600 text-white w-12 rounded-2xl
                  flex items-center justify-center hover:scale-105 transition-all shadow-xl border border-white/20">
                <Sparkles size={18} />
              </Link>
            )}
          </div>
        </div>

        {/* Hover overlay hint */}
        <div className="absolute inset-0 bg-gradient-to-t from-pink-500/10 dark:from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
      </div>

      {/* Info Part */}
      <Link href={`/shop/${product._id}`} className="block p-5 bg-white dark:bg-[#1A111A] transition-colors">
        <div className="flex justify-between items-start mb-2">
          <div className="flex items-center gap-2">
             <p className="text-[9px] text-pink-500 font-black uppercase tracking-[0.2em]">{product.brand}</p>
             {product.status === 'False' && <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-pulse" />}
          </div>
          {product.arConfig?.shades?.length > 0 && (
            <div className="flex -space-x-1.5">
              {product.arConfig.shades.slice(0, 3).map((s, i) => (
                <div key={i} className="w-3.5 h-3.5 rounded-full border border-white dark:border-black shadow-sm" style={{ background: s.hexColor }} />
              ))}
              {product.arConfig.shades.length > 3 && (
                <div className="w-3.5 h-3.5 rounded-full bg-gray-100 dark:bg-gray-800 border border-white dark:border-black flex items-center justify-center text-[7px] font-black">+</div>
              )}
            </div>
          )}
        </div>
        
        <h3 className="text-sm font-black text-gray-800 dark:text-gray-100 line-clamp-1 mb-3 group-hover:text-pink-500 transition-colors uppercase tracking-tight">{product.title}</h3>

        <div className="flex items-center justify-between">
          <div className="flex flex-col">
            <div className="flex items-center gap-2">
              <span className="text-xl font-black text-gray-900 dark:text-white tracking-tighter">{formatPrice(sale)}</span>
              {product.discount > 0 && (
                <span className="text-[10px] text-gray-400 line-through font-bold">{formatPrice(product.price)}</span>
              )}
            </div>
            {/* Tiny rating */}
            <div className="flex items-center gap-1.5 mt-1">
              <div className="flex gap-0.5">
                {[1].map(i => <Star key={i} size={10} className="text-amber-400 fill-amber-400" />)}
              </div>
              <span className="text-[10px] font-black text-gray-500 dark:text-gray-400 tracking-widest">{product.ratings} RATING</span>
            </div>
          </div>

          <div className="w-10 h-10 rounded-2xl bg-pink-50 dark:bg-white/5 flex items-center justify-center text-pink-500 group-hover:bg-pink-500 group-hover:text-white group-hover:scale-110 active:scale-95 transition-all shadow-sm">
            <ShoppingBag size={18} />
          </div>
        </div>
      </Link>
    </div>
  );
}
