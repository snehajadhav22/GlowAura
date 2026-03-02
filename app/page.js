'use client';
import { Sparkles, Heart, Camera, ArrowRight, Star, ShoppingBag, Gift, Zap } from 'lucide-react';
import NextLink from 'next/link';
import Image from 'next/image';
import ProductCard from '@/components/ProductCard';
import api from '@/lib/axios';

async function getFeatured() {
  try {
    const { data } = await api.get('/products?featured=true&limit=4');
    return data.products;
  } catch { return []; }
}

async function getBestsellers() {
  try {
    const { data } = await api.get('/products?status=True&limit=8');
    return data.products;
  } catch { return []; }
}

export default async function HomePage() {
  const featured = await getFeatured();
  const bestsellers = await getBestsellers();

  return (
    <div className="transition-colors duration-500 overflow-x-hidden">
      {/* ── Hero section ── */}
      <section className="relative overflow-hidden bg-gradient-to-br from-pink-50 via-white to-purple-50 dark:from-pink-900/10 dark:via-black dark:to-purple-900/10 min-h-[70vh] md:min-h-[85vh] flex items-center pt-10 sm:pt-0">
        {/* Animated Background Elements - Reduced Blur for Performance */}
        <div className="absolute top-20 left-10 w-32 h-32 bg-pink-200 dark:bg-pink-500/10 rounded-full mix-blend-multiply dark:mix-blend-overlay filter blur-3xl opacity-30 animate-float pointer-events-none" />
        <div className="absolute bottom-20 right-10 w-44 h-44 bg-purple-200 dark:bg-purple-500/10 rounded-full mix-blend-multiply dark:mix-blend-overlay filter blur-3xl opacity-30 animate-float pointer-events-none" style={{ animationDelay: '1s' }} />

        <div className="max-w-7xl mx-auto px-4 py-12 md:py-24 grid lg:grid-cols-2 gap-8 md:gap-12 items-center relative z-10 w-full">
          <div className="text-center lg:text-left">
            <div className="inline-flex items-center gap-2 bg-white/80 dark:bg-white/5 backdrop-blur-md px-4 py-2 rounded-full border border-pink-100 dark:border-white/10 shadow-sm mb-6 animate-bounce transition-all">
              <Sparkles size={14} className="text-pink-500" />
              <span className="text-[10px] sm:text-xs font-black uppercase tracking-widest text-pink-600 dark:text-pink-400">Your Daily Dose of Glam ✨</span>
            </div>

            <h1 className="text-4xl xs:text-5xl md:text-6xl lg:text-7xl font-black font-playfair leading-[1.1] mb-6 dark:text-white">
              Discover Your <br />
              <span className="bg-gradient-to-r from-pink-500 via-purple-500 to-pink-500 bg-clip-text text-transparent italic">
                Perfect Shade 💄✨
              </span>
            </h1>

            <p className="text-sm sm:text-base md:text-lg text-gray-500 dark:text-gray-400 mb-8 leading-relaxed max-w-xl mx-auto lg:mx-0 font-medium whitespace-pre-line">
              {`Makeup that matches your mood.\nAccessories that match your vibe. 🎀✨`}
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <NextLink href="/shop" className="btn-primary !px-8 sm:!px-10 !py-4 !text-base sm:!text-lg shadow-2xl shadow-pink-200 dark:shadow-pink-900/20 group">
                Shop Now <Heart size={20} className="group-hover:fill-white transition-all ml-2" />
              </NextLink>
              <NextLink href="/ar-studio" className="btn-outline !px-8 sm:!px-10 !py-4 !text-base sm:!text-lg bg-white/50 dark:bg-white/5 backdrop-blur-md hover:bg-white dark:hover:bg-white/10 group flex items-center justify-center">
                <Camera size={20} className="mr-2 text-pink-500" />
                Try Virtual
              </NextLink>
            </div>

            {/* Aesthetic Stats/Social proof */}
            <div className="mt-12 flex items-center justify-center lg:justify-start gap-4">
              <div className="flex -space-x-3 sm:-space-x-4">
                {[1, 2, 3, 4].map(i => (
                  <div key={i} className="w-8 h-8 sm:w-10 sm:h-10 rounded-full border-2 border-white dark:border-gray-800 bg-gray-200 overflow-hidden shadow-sm relative">
                    <Image src={`https://i.pravatar.cc/100?img=${i + 10}`} alt="user" fill className="object-cover" />
                  </div>
                ))}
              </div>
              <div className="text-left">
                <p className="text-xs sm:text-sm font-black text-gray-800 dark:text-gray-200">⭐ 4.9/5</p>
                <p className="text-[10px] font-black uppercase tracking-widest text-pink-500">12k Happy Girls</p>
              </div>
            </div>
          </div>

          <div className="relative mt-8 lg:mt-0">
            <div className="relative aspect-square max-w-[320px] xs:max-w-md mx-auto">
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[95%] h-[95%] bg-gradient-to-tr from-pink-200 to-purple-200 dark:from-pink-900/20 dark:to-purple-900/20 rounded-[2.5rem] sm:rounded-[3rem] rotate-6 shadow-2xl transition-all duration-700" />
              <div className="relative w-full h-full rounded-[2.5rem] sm:rounded-[3.5rem] overflow-hidden border-[8px] sm:border-[12px] border-white dark:border-gray-800 shadow-2xl group">
                <Image
                  src="https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?q=80&w=2000"
                  alt="Glam"
                  fill
                  sizes="(max-width: 640px) 100vw, 50vw"
                  className="object-cover group-hover:scale-105 transition-transform duration-1000"
                  priority
                />
                <div className="absolute inset-0 bg-gradient-to-t from-pink-500/20 to-transparent" />
              </div>

              <div className="absolute -bottom-4 -left-4 sm:-bottom-6 sm:-left-6 bg-white dark:bg-gray-900 p-3 sm:p-4 rounded-2xl sm:rounded-3xl shadow-2xl border border-pink-50 dark:border-white/10 animate-float">
                <p className="text-[8px] sm:text-[10px] font-black text-pink-500 uppercase flex items-center gap-1">⭐⭐⭐⭐⭐ Viral</p>
                <p className="text-xs sm:text-sm font-black text-gray-800 dark:text-gray-100 italic">"This aesthetic is EVERYTHING! 💖"</p>
              </div>

              <div className="absolute -top-6 -right-2 sm:-top-10 sm:-right-4 w-16 h-16 sm:w-24 sm:h-24 bg-pink-100 dark:bg-pink-900/40 rounded-2xl sm:rounded-3xl rotate-12 flex items-center justify-center text-3xl sm:text-4xl shadow-xl animate-bounce">💄</div>
              <div className="absolute top-1/2 -right-8 text-3xl sm:text-5xl animate-pulse">✨</div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Shop Your Vibe ── */}
      <section className="py-16 md:py-24 bg-white dark:bg-[#0a0a0a] transition-colors overflow-hidden">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12 md:mb-16">
            <h2 className="text-3xl md:text-4xl font-black font-playfair mb-4 dark:text-white text-balance">Shop Your Vibe ✨</h2>
            <div className="h-1.5 w-24 bg-gradient-to-r from-pink-400 to-purple-500 mx-auto rounded-full" />
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6 sm:gap-8">
            {[
              { label: 'Matte Lips', icon: '💄', color: 'bg-rose-100' },
              { label: 'Glow Base', icon: '✨', color: 'bg-pink-100' },
              { label: 'Dream Eyes', icon: '👁️', color: 'bg-purple-100' },
              { label: 'Pink Flush', icon: '🌸', color: 'bg-rose-50' },
              { label: 'Accessories', icon: '🎀', color: 'bg-pink-50' },
              { label: 'New In', icon: '🔥', color: 'bg-orange-50' },
            ].map((cat) => (
              <NextLink href="/shop" key={cat.label} className="group text-center flex flex-col items-center">
                <div className={`w-28 h-28 sm:w-32 sm:h-32 ${cat.color} dark:bg-white/5 rounded-full flex items-center justify-center text-4xl sm:text-5xl mb-4 shadow-xl group-hover:scale-105 group-hover:shadow-pink-100 dark:group-hover:shadow-pink-900/20 transition-all border-4 border-white dark:border-white/10`}>
                  {cat.icon}
                </div>
                <span className="text-[10px] sm:text-xs font-black uppercase tracking-widest text-gray-500 dark:text-gray-400 group-hover:text-pink-500 transition-colors">{cat.label}</span>
              </NextLink>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-16 md:py-24 bg-pink-50/30 dark:bg-black/40">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex flex-col sm:flex-row items-center justify-between mb-12 text-center sm:text-left gap-4">
            <div>
              <h2 className="text-3xl md:text-4xl font-black font-playfair dark:text-white">Trending Glam ⚡</h2>
              <p className="text-pink-500 font-bold uppercase tracking-widest text-[10px] sm:text-xs mt-2">Bestie Approved Picks</p>
            </div>
            <NextLink href="/shop" className="text-xs font-black uppercase tracking-widest text-gray-400 hover:text-pink-500 flex items-center gap-2 transition-all">
              View All <ArrowRight size={16} />
            </NextLink>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {featured.map(p => <ProductCard key={p._id} product={p} />)}
          </div>
        </div>
      </section>

      {/* AR Studio Promo */}
      <section className="py-16 md:py-24 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4">
          <div className="bg-gradient-to-br from-gray-900 to-black rounded-[2.5rem] sm:rounded-[3rem] p-8 md:p-16 relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10 pointer-events-none" />
            <div className="absolute -bottom-24 -right-24 w-64 h-64 bg-pink-500 rounded-full blur-3xl opacity-20 pointer-events-none" />

            <div className="relative z-10 grid lg:grid-cols-2 gap-12 items-center">
              <div className="text-center lg:text-left">
                <div className="inline-flex items-center gap-2 bg-pink-500/10 border border-pink-500/20 px-4 py-2 rounded-full mb-6">
                  <Zap size={14} className="text-pink-500" />
                  <span className="text-[10px] font-black uppercase tracking-widest text-pink-400">Next-Gen Beauty</span>
                </div>
                <h2 className="text-4xl md:text-6xl font-black text-white font-playfair mb-8 leading-tight text-balance">
                  Try It On <br />
                  <span className="italic text-pink-500">Virtually ✨</span>
                </h2>
                <p className="text-gray-400 text-base md:text-lg mb-10 max-w-md mx-auto lg:mx-0">
                  Don't guess, just glow. Try any shade of lipstick or blush in real-time with our AI-powered studio.
                </p>
                <NextLink href="/ar-studio" className="btn-primary !px-8 sm:!px-12 !py-4 sm:!py-5 !text-lg sm:!text-xl shadow-2xl shadow-pink-500/20 w-fit mx-auto lg:mx-0">
                  Open AR Studio <Camera size={24} className="ml-2" />
                </NextLink>
              </div>
              <div className="relative lg:h-[450px] flex items-center justify-center">
                <div className="w-full aspect-square sm:aspect-video md:aspect-square lg:aspect-video bg-white/5 backdrop-blur-xl rounded-3xl border border-white/10 flex items-center justify-center p-8">
                  <div className="text-center">
                    <div className="w-16 h-16 sm:w-24 sm:h-24 rounded-full bg-pink-500/20 flex items-center justify-center mx-auto mb-6 border border-pink-500/30 animate-pulse">
                      <Camera size={32} className="text-pink-500" />
                    </div>
                    <p className="text-white font-black text-lg sm:text-xl mb-2 uppercase tracking-tight">Live Camera Demo</p>
                    <p className="text-gray-500 text-xs sm:text-sm uppercase font-bold tracking-widest">Tap to see the magic happen</p>
                  </div>
                </div>
                {/* Floating icons */}
                <div className="absolute -top-4 left-4 sm:-top-6 sm:left-12 text-3xl sm:text-4xl animate-float">💄</div>
                <div className="absolute bottom-10 right-0 sm:bottom-12 sm:right-0 text-4xl sm:text-5xl animate-bounce">💖</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Best Sellers */}
      <section className="py-16 md:py-24 bg-white dark:bg-[#0a0a0a]">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12 md:mb-16">
            <h2 className="text-3xl md:text-4xl font-black font-playfair dark:text-white">Hot This Week 🔥</h2>
            <p className="text-gray-400 font-bold uppercase tracking-widest text-[10px] sm:text-xs mt-3">What everyone's obsessing over</p>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-8">
            {bestsellers.map(p => <ProductCard key={p._id} product={p} />)}
          </div>
        </div>
      </section>

      {/* Newsletter */}
      <section className="py-16 md:py-24 px-4 overflow-hidden">
        <div className="max-w-5xl mx-auto">
          <div className="bg-pink-100/50 dark:bg-white/5 rounded-[2.5rem] sm:rounded-[3rem] p-8 md:p-12 text-center border border-pink-100 dark:border-white/10 relative">
            {/* Glow decor */}
            <div className="absolute -top-10 -right-10 w-40 h-40 bg-pink-400/20 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-purple-400/20 rounded-full blur-3xl pointer-events-none" />

            <Gift size={40} className="text-pink-500 mx-auto mb-6 sm:w-12 sm:h-12" />
            <h2 className="text-3xl md:text-4xl font-black font-playfair mb-4 dark:text-white">Join the Glow Squad ✨</h2>
            <p className="text-sm sm:text-base text-gray-500 dark:text-gray-400 mb-8 sm:mb-10 max-w-md mx-auto font-medium text-pretty font-playfair">
              Get early access to new launches, secret aesthetic tips, and 20% off your first order!
            </p>
            <form className="flex flex-col sm:flex-row gap-3 max-w-lg mx-auto relative z-10">
              <input type="email" placeholder="bestie@email.com" className="input-field !rounded-2xl shadow-xl border-none text-center sm:text-left" />
              <button className="btn-primary !px-8 hover:scale-105">Join Now</button>
            </form>
          </div>
        </div>
      </section>
    </div>
  );
}