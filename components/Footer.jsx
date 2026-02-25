import Link from 'next/link';
import { Sparkles } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-[var(--background)] border-t border-[var(--border-color)] transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          {/* Brand Column */}
          <div className="space-y-6 text-center md:text-left">
            <div className="flex items-center justify-center md:justify-start gap-2 group">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-pink-400 to-purple-500 flex items-center justify-center shadow-lg group-hover:scale-110 group-hover:rotate-6 transition-all">
                <Sparkles size={20} className="text-white" />
              </div>
              <span className="text-2xl font-black font-playfair bg-gradient-to-r from-pink-500 to-purple-600 bg-clip-text text-transparent">GlowAura</span>
            </div>
            <p className="text-gray-500 dark:text-gray-400 font-medium leading-relaxed">
              Your daily dose of glam. We bring you the most aesthetic beauty products with a touch of AI magic. ✨
            </p>
            <div className="flex items-center justify-center md:justify-start gap-4">
              {['Instagram', 'Twitter', 'Youtube'].map((social) => (
                <button key={social} className="w-10 h-10 rounded-xl bg-pink-50 dark:bg-white/5 flex items-center justify-center text-pink-500 hover:scale-110 active:scale-95 transition-all">
                  <span className="text-xl">
                    {social === 'Instagram' ? '📸' : social === 'Twitter' ? '🐦' : '📺'}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Links Columns */}
          {[
            { title: 'Shop', links: ['New Arrivals', 'Best Sellers', 'Virtual Try-On', 'Beauty Box'] },
            { title: 'Glow Squad', links: ['About Us', 'Careers', 'Bestie Program', 'Affiliates'] },
            { title: 'Support', links: ['Shipping Info', 'Returns', 'Beauty FAQ', 'Contact Us'] }
          ].map((col) => (
            <div key={col.title} className="text-center md:text-left">
              <h4 className="text-sm font-black uppercase tracking-widest text-pink-500 mb-6">{col.title}</h4>
              <ul className="space-y-4">
                {col.links.map((link) => (
                  <li key={link}>
                    <button className="text-gray-500 dark:text-gray-400 hover:text-pink-500 dark:hover:text-pink-400 font-bold transition-colors">
                      {link}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-[var(--border-color)] flex flex-col md:flex-row justify-between items-center gap-6">
          <p className="text-sm font-bold text-gray-400 dark:text-gray-500">
            © 2026 GlowAura. Designed with 💖 for besties.
          </p>
          <div className="flex items-center gap-8">
            <button className="text-xs font-black uppercase tracking-widest text-gray-400 hover:text-pink-500 transition-colors">Privacy Policy</button>
            <button className="text-xs font-black uppercase tracking-widest text-gray-400 hover:text-pink-500 transition-colors">Terms of Vibe</button>
          </div>
        </div>
      </div>
    </footer>
  );
}