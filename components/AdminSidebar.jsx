'use client';
import Link from 'next/link';
import { usePathname }   from 'next/navigation';
import { LayoutDashboard, Package, ShoppingBag, BarChart3, LogOut, Sparkles } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

const links = [
  { href: '/admin',          icon: LayoutDashboard, label: 'Dashboard' },
  { href: '/admin/products', icon: Package,         label: 'Products'  },
  { href: '/admin/orders',   icon: ShoppingBag,     label: 'Orders'    },
  { href: '/admin/reports',  icon: BarChart3,       label: 'Reports'   },
];

export default function AdminSidebar() {
  const { logout } = useAuth();
  const pathname   = usePathname();

  return (
    <aside className="w-60 flex-shrink-0 bg-gradient-to-b from-gray-900 to-gray-800 min-h-screen rounded-2xl p-4 shadow-xl">
      <div className="flex items-center gap-2 mb-8 px-2">
        <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-pink-500 to-purple-600 flex items-center justify-center">
          <Sparkles size={15} className="text-white" />
        </div>
        <span className="font-extrabold text-white text-lg">GlowAura</span>
        <span className="text-[10px] bg-pink-600 text-white px-1.5 py-0.5 rounded-full font-semibold ml-auto">ADMIN</span>
      </div>

      <nav className="space-y-1">
        {links.map(({ href, icon: Icon, label }) => (
          <Link key={href} href={href}
            className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all
              ${pathname === href
                ? 'bg-pink-600 text-white shadow-lg shadow-pink-900/30'
                : 'text-gray-400 hover:bg-gray-700 hover:text-white'}`}>
            <Icon size={18} />
            {label}
          </Link>
        ))}
      </nav>

      <div className="mt-auto pt-8">
        <button onClick={logout}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-gray-400 hover:bg-red-900/40 hover:text-red-400 transition-all">
          <LogOut size={18} /> Logout
        </button>
      </div>
    </aside>
  );
}