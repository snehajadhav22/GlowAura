'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Sparkles, Camera, ArrowRight, Loader2, Heart, Star } from 'lucide-react';
import api from '@/lib/axios';

const AR_CATEGORIES = [
  { name: 'Lipstick', icon: '💄', color: 'from-pink-100 to-rose-100', desc: 'Perfect Pouts' },
  { name: 'Foundation', icon: '🧴', color: 'from-amber-100 to-orange-100', desc: 'Skin Filters' },
  { name: 'Blush', icon: '🌸', color: 'from-rose-100 to-pink-200', desc: 'Soft Flush' },
  { name: 'Eyeshadow', icon: '👁️', color: 'from-purple-100 to-indigo-100', desc: 'Magic Eyes' },
  { name: 'Eyeliner', icon: '✏️', color: 'from-gray-100 to-slate-200', desc: 'Sharp Wings' },
  { name: 'Mascara', icon: '🖤', color: 'from-slate-100 to-gray-200', desc: 'Dream Lashes' },
  { name: 'Highlighter', icon: '✨', color: 'from-yellow-100 to-amber-100', desc: 'Inner Glow' },
  { name: 'Contour', icon: '🎭', color: 'from-amber-100 to-yellow-100', desc: 'Sculpt Face' },
];

export default function ARStudioBrowsePage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const cats = AR_CATEGORIES.map(c => c.name);
    api.get(`/products?category=${cats.join(',')}&limit=24&sort=rating`)
      .then(r => setProducts(r.data.products || []))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="pt-28 pb-20 bg-[#FFF9FB]">
      {/* Hero */}
      <section className="relative overflow-hidden bg-white mb-20">
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-pink-50 via-white to-purple-50 opacity-60" />
        <div className="max-w-7xl mx-auto px-4 py-24 relative z-10 text-center">
          <div className="inline-flex items-center gap-2 bg-pink-100/50 backdrop-blur-sm px-6 py-2 rounded-full text-[10px] font-black uppercase tracking-widest text-pink-600 border border-pink-200 mb-8 animate-float">
            <Camera size={14} /> AI-Powered Virtual Try-On ✨
          </div>
          <h1 className="text-6xl md:text-8xl font-black font-playfair mb-6 leading-tight">
            Virtual Makeup <br />
            <span className="bg-gradient-to-r from-pink-500 via-purple-500 to-pink-500 bg-clip-text text-transparent italic">
              Studio Live ✨
            </span>
          </h1>
          <p className="text-lg text-gray-400 max-w-2xl mx-auto font-medium leading-relaxed mb-10">
            Try on any product in real-time. Our AI magic matches your skin tone perfectly for a Pinterest-ready look! 💄💖
          </p>

          <div className="flex justify-center gap-10 opacity-30 pointer-events-none">
            {['💄', '🌸', '✨', '🎀', '💋'].map((e, i) => (
              <span key={i} className="text-4xl animate-bounce" style={{ animationDelay: `${i * 0.2}s` }}>{e}</span>
            ))}
          </div>
        </div>

        {/* Floating circles deco */}
        <div className="absolute -top-20 -left-20 w-64 h-64 bg-pink-100 rounded-full blur-3xl opacity-30" />
        <div className="absolute -bottom-20 -right-20 w-64 h-64 bg-purple-100 rounded-full blur-3xl opacity-30" />
      </section>

      <div className="max-w-7xl mx-auto px-4">
        {/* Categories Pinterest style */}
        <section className="mb-24">
          <div className="flex items-center gap-3 mb-10">
            <div className="w-10 h-10 rounded-2xl bg-pink-500 flex items-center justify-center text-white shadow-lg">
              <Sparkles size={20} />
            </div>
            <h2 className="text-3xl font-black font-playfair text-gray-900 tracking-tight">Choose Your Vibe 💕</h2>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4">
            {AR_CATEGORIES.map(cat => (
              <Link key={cat.name} href={`/shop?category=${cat.name}`}
                className="group flex flex-col items-center p-6 bg-white rounded-[2.5rem] border border-pink-50 shadow-sm hover:shadow-2xl hover:-translate-y-2 transition-all duration-500">
                <div className={`w-16 h-16 rounded-full bg-gradient-to-br ${cat.color} flex items-center justify-center text-3xl mb-4 group-hover:scale-110 transition-transform shadow-md group-hover:shadow-pink-100`}>
                  {cat.icon}
                </div>
                <div className="text-center">
                  <h3 className="font-black text-[10px] uppercase tracking-widest text-gray-800">{cat.name}</h3>
                  <p className="text-[10px] font-bold text-pink-400 mt-0.5">{cat.desc}</p>
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* Products section */}
        <section>
          <div className="flex flex-col sm:flex-row justify-between items-end gap-6 mb-12">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <div className="w-12 h-[2px] bg-pink-500" />
                <span className="text-xs font-black uppercase tracking-[0.2em] text-pink-500">Hot For Try-On</span>
              </div>
              <h2 className="text-5xl font-black font-playfair text-gray-900 leading-tight">Trending Looks ✨</h2>
            </div>
            <div className="bg-pink-50 px-4 py-2 rounded-full border border-pink-100">
              <p className="text-[10px] font-black text-pink-500 uppercase tracking-widest leading-none">AI Powered Cam Ready</p>
            </div>
          </div>

          {loading ? (
            <div className="flex flex-col items-center justify-center py-32 gap-4">
              <Loader2 className="animate-spin text-pink-500" size={48} />
              <p className="text-xs font-black text-pink-400 uppercase tracking-[0.3em]">Loading Glam Studio...</p>
            </div>
          ) : (
            <div className="columns-2 md:columns-3 lg:columns-4 gap-6 space-y-6">
              {products.map(p => (
                <div key={p._id} className="break-inside-avoid group relative">
                  <div className="bg-white rounded-[2.5rem] overflow-hidden shadow-sm border border-pink-50 hover:shadow-2xl transition-all duration-700">
                    <div className="relative aspect-[3/4] overflow-hidden bg-gray-50">
                      {p.images?.[0]?.url && (
                        <Image src={p.images[0].url} alt={p.title} fill className="object-cover group-hover:scale-110 transition-transform duration-1000" />
                      )}

                      {/* AR Badge */}
                      <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-md px-3 py-1.5 rounded-2xl flex items-center gap-2 shadow-lg border border-pink-50">
                        <Camera size={12} className="text-pink-500 animate-pulse" />
                        <span className="text-[9px] font-black uppercase tracking-widest text-pink-600">Try Live</span>
                      </div>

                      {/* Try in AR overlay */}
                      <div className="absolute inset-x-0 bottom-4 px-4 translate-y-full opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500">
                        <Link href={`/ar-studio/${p._id}`}
                          className="w-full bg-gradient-to-r from-pink-500 to-purple-600 text-white py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-2 shadow-2xl shadow-pink-200 hover:scale-105 active:scale-95 transition-all">
                          <Sparkles size={16} /> Open Studio ✨
                        </Link>
                      </div>
                    </div>

                    <div className="p-5">
                      <div className="flex justify-between items-start mb-2">
                        <p className="text-[10px] font-black text-pink-400 uppercase tracking-widest">{p.brand}</p>
                        <div className="flex items-center gap-1">
                          <Star size={10} className="fill-amber-400 text-amber-400" />
                          <span className="text-[10px] font-black text-gray-400">{p.ratings}</span>
                        </div>
                      </div>
                      <h3 className="text-sm font-bold text-gray-800 line-clamp-2 leading-snug group-hover:text-pink-600 transition-colors">{p.title}</h3>
                      <p className="text-[10px] font-bold text-gray-400 uppercase tracking-tight mt-2">{p.category}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>

      {/* Aesthetic Call to Action */}
      <section className="max-w-4xl mx-auto px-4 pt-32 text-center pb-20">
        <div className="bg-gradient-to-br from-pink-500 to-purple-600 rounded-[3.5rem] p-16 text-white relative overflow-hidden shadow-2xl shadow-pink-200">
          <div className="absolute top-0 right-0 p-8 text-8xl opacity-10 font-black italic">✨</div>
          <h2 className="text-4xl md:text-5xl font-black font-playfair mb-6 leading-tight">Can't Find Your Vibe? 💕</h2>
          <p className="text-xl text-pink-50 font-medium mb-10 opacity-90">Explore our full catalog and find the accessories that speak to your soul. ✨🎀</p>
          <Link href="/shop" className="inline-flex items-center gap-3 bg-white text-pink-600 px-12 py-5 rounded-[2rem] font-black uppercase tracking-widest shadow-xl hover:scale-105 transition-all">
            Browse Catalog <ArrowRight size={20} />
          </Link>
        </div>
      </section>
    </div>
  );
}