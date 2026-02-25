'use client';
import Link from 'next/link';
import { usePathname, useSearchParams } from 'next/navigation';
import { LayoutDashboard, ShoppingBag, Heart, User, LogOut, ChevronRight } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

const links = [
  { href: '/dashboard',              icon: LayoutDashboard, label: 'Dashboard',  tab: '' },
  { href: '/dashboard?tab=orders',   icon: ShoppingBag,     label: 'My Orders',  tab: 'orders' },
  { href: '/dashboard?tab=wishlist', icon: Heart,           label: 'Wishlist',   tab: 'wishlist' },
  { href: '/dashboard?tab=profile',  icon: User,            label: 'Profile',    tab: 'profile' },
];

export default function DashboardSidebar() {
  const { user, logout } = useAuth();
  const searchParams     = useSearchParams();
  const activeTab        = searchParams.get('tab') || '';

  return (
    <aside className="w-64 flex-shrink-0">
      <div className="glass-card p-4 bg-white/70 dark:bg-white/5 backdrop-blur-2xl border-white/50 dark:border-white/10 shadow-xl">
        {/* Profile preview */}
        <div className="flex items-center gap-3 pb-4 mb-4 border-b border-gray-100 dark:border-white/5">
          <div className="w-12 h-12 rounded-[1rem] bg-gradient-to-br from-pink-400 to-purple-500 flex items-center justify-center text-white text-lg font-black shadow-lg">
            {user?.name?.[0]?.toUpperCase() || '✨'}
          </div>
          <div className="overflow-hidden">
            <p className="font-black text-gray-900 dark:text-white truncate text-sm">{user?.name || 'Bestie'}</p>
            <p className="text-[10px] font-medium text-gray-500 dark:text-gray-400 truncate">{user?.email}</p>
          </div>
        </div>

        <nav className="space-y-1">
          {links.map(({ href, icon: Icon, label, tab }) => (
            <Link key={href} href={href}
              className={`sidebar-link flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-bold transition-all ${activeTab === tab 
                ? 'bg-pink-500 text-white shadow-lg shadow-pink-200 dark:shadow-pink-900/20' 
                : 'text-gray-500 dark:text-gray-400 hover:bg-pink-50 dark:hover:bg-white/5 hover:text-pink-500'}`}>
              <Icon size={18} />
              <span className="flex-1">{label}</span>
              <ChevronRight size={14} className={activeTab === tab ? 'text-white' : 'text-gray-300'} />
            </Link>
          ))}
          <button onClick={logout}
            className="sidebar-link w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-black text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-900/10 transition-all mt-4 border-t border-gray-100 dark:border-white/5 pt-4">
            <LogOut size={18} />
            <span>Logout Vibe</span>
          </button>
        </nav>
      </div>
    </aside>
  );
}