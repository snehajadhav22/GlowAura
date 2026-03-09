'use client';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import {
  Search, ShoppingBag, User, Heart, Menu, X,
  Sparkles, Bell, Ghost, LogOut, Settings,
  CreditCard, Package, Sun, Moon
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useCart } from '@/context/CartContext';

const BRANDS = ['Lakme', 'Maybelline', 'Huda', 'MAC', 'Nykaa', 'L\'Oreal', 'Sugar', 'Colorbar'];

export default function Navbar() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [searchTerm, setSearchTerm] = useState(searchParams.get('search') || '');
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [isDark, setIsDark] = useState(false);
  const { user, logout } = useAuth();
  const { items } = useCart();

  const handleSearch = (e) => {
    if (e.key === 'Enter') {
      const params = new URLSearchParams(searchParams.toString());
      if (searchTerm) params.set('search', searchTerm);
      else params.delete('search');
      params.set('page', '1');
      router.push(`/shop?${params.toString()}`);
      setIsMenuOpen(false);
    }
  };

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    if (document.documentElement.classList.contains('dark')) setIsDark(true);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleDarkMode = () => {
    const root = document.documentElement;
    if (isDark) {
      root.classList.remove('dark');
      setIsDark(false);
    } else {
      root.classList.add('dark');
      setIsDark(true);
    }
  };

  return (
    <nav className={`fixed top-0 left-0 right-0 z-[100] pointer-events-none transition-all duration-500 ${scrolled ? 'py-2' : 'py-4'}`}>
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-pink-400 via-purple-400 to-pink-400 py-1.5 overflow-hidden pointer-events-auto">
        <div className="flex animate-infinite-scroll whitespace-nowrap gap-10">
          {[1, 2, 3, 4, 5].map(i => (
            <span key={i} className="text-[10px] font-black uppercase tracking-[0.3em] text-white flex items-center gap-2">
              ✨ Free Delivery on orders above ₹1500 | Use GLOW20 for 20% OFF ✨
            </span>
          ))}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 mt-2">
        <div className={`bg-white/80 dark:bg-black/60 backdrop-blur-2xl rounded-[2rem] border border-white/40 dark:border-white/10 shadow-xl transition-all duration-500 px-4 sm:px-6 py-3 flex items-center justify-between gap-4 pointer-events-auto`}>

          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group flex-shrink-0">
            <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-2xl bg-gradient-to-br from-pink-400 to-purple-50 flex items-center justify-center shadow-lg group-hover:scale-110 group-hover:rotate-6 transition-all">
              <Sparkles size={18} className="text-white" />
            </div>
            <span className="text-xl sm:text-2xl font-black font-playfair bg-gradient-to-r from-pink-500 to-purple-600 bg-clip-text text-transparent hidden xs:block">
              GlowAura
            </span>
          </Link>

          {/* Search Bar */}
          <div className="hidden md:flex flex-1 max-w-sm lg:max-w-md relative group">
            <div className="absolute inset-0 bg-pink-100 dark:bg-pink-900/20 rounded-2xl translate-y-1 opacity-0 group-focus-within:opacity-100 transition-all blur-md" />
            <div className="relative w-full flex items-center bg-gray-50/50 dark:bg-white/5 border border-pink-100 dark:border-white/10 rounded-2xl px-4 py-1 focus-within:border-pink-400 focus-within:bg-white dark:focus-within:bg-black/40 transition-all">
              <Search size={16} className="text-pink-300" />
              <input
                type="text"
                placeholder="Search..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyDown={handleSearch}
                className="w-full bg-transparent border-none outline-none px-3 py-2 text-sm font-medium placeholder:text-pink-200"
              />
            </div>
          </div>

          {/* Right Actions */}
          <div className="flex items-center gap-1 sm:gap-3">
            <button
              onClick={toggleDarkMode}
              className="w-9 h-9 sm:w-10 sm:h-10 rounded-2xl bg-pink-50 dark:bg-white/5 flex items-center justify-center text-pink-500 dark:text-pink-400 hover:scale-110 active:scale-95 transition-all"
            >
              {isDark ? <Sun size={18} /> : <Moon size={18} />}
            </button>

            <Link href="/dashboard?tab=wishlist" className="hidden sm:flex w-10 h-10 rounded-2xl bg-pink-50 dark:bg-white/5 items-center justify-center text-pink-500 dark:text-pink-400 hover:scale-110 active:scale-95 transition-all">
              <Heart size={20} />
            </Link>

            <Link href="/cart" className="w-9 h-9 sm:w-10 sm:h-10 rounded-2xl bg-pink-50 dark:bg-white/5 flex items-center justify-center text-pink-500 dark:text-pink-400 hover:scale-110 active:scale-95 transition-all relative">
              <ShoppingBag size={18} />
              {items.length > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-pink-500 text-white text-[10px] font-black rounded-full flex items-center justify-center shadow-lg animate-bounce border-2 border-white dark:border-black">
                  {items.length}
                </span>
              )}
            </Link>

            <div className="relative">
              <button
                onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                className="flex items-center gap-2 p-1 sm:p-1.5 sm:pl-3 bg-pink-50 dark:bg-white/5 rounded-2xl hover:bg-pink-100 dark:hover:bg-white/10 transition-all border border-pink-100 dark:border-white/10"
              >
                <div className="hidden lg:block text-right">
                  <p className="text-[9px] font-black uppercase text-pink-500 tracking-tight leading-none mb-1">Welcome!</p>
                  <p className="text-xs font-bold text-gray-800 dark:text-gray-200 leading-none truncate max-w-[60px]">{user?.name ? user.name.split(' ')[0] : 'Bestie'}</p>
                </div>
                <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-gradient-to-br from-pink-400 to-purple-500 flex items-center justify-center text-white shadow-md">
                  <User size={16} />
                </div>
              </button>

              {isUserMenuOpen && (
                <div className="absolute top-14 right-0 w-64 bg-white/95 dark:bg-black/90 backdrop-blur-2xl rounded-3xl border border-pink-50 dark:border-white/10 shadow-2xl p-3 animate-in fade-in slide-in-from-top-4 duration-300 z-[101]">
                  {user?.email ? (
                    <>
                      <div className="p-4 bg-pink-50 dark:bg-white/5 rounded-2xl mb-2">
                        <p className="text-xs font-black text-pink-500 uppercase tracking-widest mb-1">Your Profile</p>
                        <p className="text-base font-black text-gray-800 dark:text-gray-100 truncate">{user?.name || 'VIBE CHECK ✨'}</p>
                      </div>
                      <div className="space-y-1">
                        {[
                          { icon: <Package size={16} />, label: 'My Orders', href: '/dashboard?tab=orders' },
                          { icon: <Heart size={16} />, label: 'My Wishlist', href: '/dashboard?tab=wishlist' },
                          { icon: <Settings size={16} />, label: 'Profile Settings', href: '/dashboard?tab=profile' },
                        ].map(item => (
                          <Link
                            key={item.label}
                            href={item.href}
                            onClick={() => setIsUserMenuOpen(false)}
                            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-pink-50 dark:hover:bg-white/5 text-gray-600 dark:text-gray-300 text-sm font-bold transition-all"
                          >
                            <span className="text-pink-400">{item.icon}</span>
                            {item.label}
                          </Link>
                        ))}
                        <button
                          onClick={() => { logout(); setIsUserMenuOpen(false); }}
                          className="w-full flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-rose-50 dark:hover:bg-rose-900/10 text-rose-500 text-sm font-bold transition-all border-t border-pink-50 dark:border-white/5 mt-2 pt-2"
                        >
                          <LogOut size={16} /> Logout Vibe
                        </button>
                      </div>
                    </>
                  ) : (
                    <div className="space-y-3 p-2">
                      <div className="text-center pb-2">
                        <p className="text-sm font-black text-gray-800 dark:text-gray-100">Join the Glow Squad ✨</p>
                        <p className="text-[10px] text-gray-500 mt-1">Unlock exclusive deals & virtual try-on!</p>
                      </div>
                      <Link
                        href="/login"
                        onClick={() => setIsUserMenuOpen(false)}
                        className="btn-primary !py-3 w-full text-xs font-black uppercase tracking-widest shadow-none"
                      >
                        Sign In Bestie
                      </Link>
                      <Link
                        href="/register"
                        onClick={() => setIsUserMenuOpen(false)}
                        className="flex items-center justify-center w-full py-3 rounded-2xl border-2 border-pink-100 dark:border-white/10 text-pink-500 text-xs font-black uppercase tracking-widest hover:bg-pink-50 dark:hover:bg-white/5 transition-all"
                      >
                        Create Account
                      </Link>
                    </div>
                  )}
                </div>
              )}
            </div>

            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="lg:hidden w-9 h-9 sm:w-10 sm:h-10 rounded-2xl flex items-center justify-center text-pink-500 transition-all active:scale-90"
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Categories Bar */}
        <div className="hidden lg:flex items-center gap-4 mt-4 px-2 overflow-x-auto no-scrollbar pointer-events-auto">
          <Link href="/ar-studio" className="bg-gradient-to-r from-pink-500 to-purple-600 text-white px-6 py-2 rounded-xl text-xs font-black uppercase tracking-widest flex items-center gap-2 shadow-lg hover:scale-105 transition-all">
            <Sparkles size={14} /> AR Studio Live
          </Link>
          <div className="w-px h-6 bg-pink-100 dark:bg-white/10 mx-2" />
          <Link href="/shop" className="bg-pink-100/50 dark:bg-white/5 text-pink-600 dark:text-pink-400 px-5 py-2 rounded-xl text-xs font-black uppercase tracking-widest hover:bg-pink-100 transition-all">
            All ✨
          </Link>
          {BRANDS.map(brand => (
            <Link key={brand} href={`/shop?brand=${brand}`} className="bg-white/50 dark:bg-white/5 dark:text-gray-300 px-5 py-2 rounded-xl text-xs font-bold text-gray-500 hover:text-pink-500 hover:bg-white transition-all border border-pink-50 dark:border-white/5 whitespace-nowrap">
              {brand}
            </Link>
          ))}
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="lg:hidden absolute top-full left-0 right-0 h-screen bg-white/95 dark:bg-black/95 backdrop-blur-3xl border-t border-pink-50 dark:border-white/10 p-6 animate-in slide-in-from-top duration-500 pointer-events-auto">
          <div className="space-y-6 overflow-y-auto max-h-[calc(100vh-100px)] no-scrollbar">
            <div className="relative mb-8">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-pink-300" size={18} />
              <input
                type="text"
                placeholder="Find your vibe..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyDown={handleSearch}
                className="w-full bg-pink-50/50 dark:bg-white/5 rounded-2xl pl-12 pr-6 py-4 outline-none border border-pink-100 dark:border-white/10 font-medium"
              />
            </div>
            <div className="grid grid-cols-2 gap-4 mb-8">
              <Link href="/shop" onClick={() => setIsMenuOpen(false)} className="flex items-center gap-3 p-4 bg-pink-50 dark:bg-white/5 rounded-2xl">
                <ShoppingBag className="text-pink-500" />
                <span className="font-black uppercase tracking-tight text-xs">Shop</span>
              </Link>
              <Link href="/ar-studio" onClick={() => setIsMenuOpen(false)} className="flex items-center gap-3 p-4 bg-purple-50 dark:bg-white/5 rounded-2xl">
                <Sparkles className="text-purple-500" />
                <span className="font-black uppercase tracking-tight text-xs">AR Studio</span>
              </Link>
            </div>
            <div className="space-y-4">
              <p className="text-[10px] font-black text-pink-400 uppercase tracking-[0.3em]">Quick Links</p>
              {['New In', 'Trending', 'Accessories', 'About'].map(link => (
                <Link key={link} href="/shop" onClick={() => setIsMenuOpen(false)} className="block text-xl font-black text-gray-800 dark:text-gray-200 hover:text-pink-500 transition-colors">
                  {link}
                </Link>
              ))}
            </div>
            {user?.email ? (
              <button
                onClick={() => { logout(); setIsMenuOpen(false); }}
                className="w-full py-4 text-center text-rose-500 font-black uppercase tracking-[0.2em] border-t border-pink-50 dark:border-white/5 mt-8 flex items-center justify-center gap-2"
              >
                <LogOut size={18} /> Logout Vibe
              </button>
            ) : (
              <div className="pt-8 border-t border-pink-50 dark:border-white/5 flex flex-col gap-3">
                <Link href="/login" onClick={() => setIsMenuOpen(false)} className="btn-primary w-full !py-4 text-sm font-black uppercase tracking-widest">
                  Sign In
                </Link>
                <Link href="/register" onClick={() => setIsMenuOpen(false)} className="flex items-center justify-center w-full py-4 rounded-2xl border-2 border-pink-100 dark:border-white/10 text-pink-500 text-sm font-black uppercase tracking-widest">
                  Create Account
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}