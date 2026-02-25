'use client';
import { useEffect, useState } from 'react';
import { Users, Package, ShoppingBag, TrendingUp, DollarSign, Loader2 } from 'lucide-react';
import AdminSidebar from '@/components/AdminSidebar';
import { formatPrice, statusColor } from '@/utils/formatters';
import api from '@/lib/axios';

export default function AdminDashboardPage() {
  const [data,    setData]    = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/admin/stats')
      .then(r => setData(r.data))
      .finally(() => setLoading(false));
  }, []);

  const statsCards = data ? [
    { icon: DollarSign, label: 'Total Revenue',  val: formatPrice(data.stats.totalRevenue),  color: 'from-green-400 to-emerald-600', text: 'text-green-600' },
    { icon: ShoppingBag,label: 'Total Orders',   val: data.stats.totalOrders,                color: 'from-blue-400 to-blue-600',     text: 'text-blue-600' },
    { icon: Package,    label: 'Total Products', val: data.stats.totalProducts,              color: 'from-purple-400 to-purple-600', text: 'text-purple-600' },
    { icon: Users,      label: 'Total Users',    val: data.stats.totalUsers,                 color: 'from-pink-400 to-pink-600',     text: 'text-pink-600' },
  ] : [];

  return (
    <div className="pt-28 pb-12 max-w-7xl mx-auto px-4">
      <div className="flex gap-6">
        <AdminSidebar />
        <div className="flex-1 min-w-0">
          <h1 className="text-2xl font-black text-gray-900 mb-6">Admin Dashboard</h1>

          {loading ? (
            <div className="flex justify-center py-20"><Loader2 size={36} className="animate-spin text-pink-600" /></div>
          ) : (
            <>
              {/* Stats Grid */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                {statsCards.map(({ icon: Icon, label, val, color }) => (
                  <div key={label} className={`bg-gradient-to-br ${color} rounded-2xl p-5 text-white shadow-lg`}>
                    <Icon size={26} className="mb-2 opacity-80" />
                    <p className="text-2xl font-black">{val}</p>
                    <p className="text-sm opacity-80 mt-0.5">{label}</p>
                  </div>
                ))}
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                {/* Monthly Revenue */}
                <div className="glass-card p-5">
                  <h2 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                    <TrendingUp size={18} className="text-pink-600" /> Monthly Revenue
                  </h2>
                  <div className="space-y-3">
                    {data?.monthly?.map(m => {
                      const maxRevenue = Math.max(...(data?.monthly?.map(x => x.revenue) || [1]));
                      const pct = (m.revenue / maxRevenue) * 100;
                      return (
                        <div key={m._id} className="flex items-center gap-3">
                          <span className="text-xs text-gray-500 w-14 text-right font-mono">{m._id}</span>
                          <div className="flex-1 bg-gray-100 rounded-full h-6 overflow-hidden">
                            <div
                              className="h-full bg-gradient-to-r from-pink-400 to-pink-600 rounded-full flex items-center justify-end pr-2 transition-all duration-700"
                              style={{ width: `${pct}%` }}>
                              <span className="text-white text-[10px] font-bold">{formatPrice(m.revenue)}</span>
                            </div>
                          </div>
                          <span className="text-xs text-gray-500 w-12">{m.orders} ord</span>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Top Products */}
                <div className="glass-card p-5">
                  <h2 className="font-bold text-gray-900 mb-4">🏆 Top Selling Products</h2>
                  <div className="space-y-3">
                    {data?.topProducts?.map((tp, i) => (
                      <div key={i} className="flex items-center gap-3">
                        <span className="w-6 h-6 rounded-full bg-gradient-to-br from-pink-400 to-purple-500 text-white text-xs font-bold flex items-center justify-center">
                          {i + 1}
                        </span>
                        <div className="flex-1 min-w-0">
                                                    <p className="text-sm font-medium text-gray-800 truncate">{tp.product?.title || 'Product'}</p>
                        </div>
                        <span className="text-xs font-bold text-pink-600">{tp.sold} sold</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Recent Orders */}
                <div className="glass-card p-5 md:col-span-2">
                  <h2 className="font-bold text-gray-900 mb-4">Recent Orders</h2>
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b border-gray-100">
                          <th className="text-left py-2 px-2 text-gray-500 font-semibold">Order ID</th>
                          <th className="text-left py-2 px-2 text-gray-500 font-semibold">Customer</th>
                          <th className="text-left py-2 px-2 text-gray-500 font-semibold">Status</th>
                          <th className="text-left py-2 px-2 text-gray-500 font-semibold">Amount</th>
                          <th className="text-left py-2 px-2 text-gray-500 font-semibold">Date</th>
                        </tr>
                      </thead>
                      <tbody>
                        {data?.recentOrders?.map(order => (
                          <tr key={order._id} className="border-b border-gray-50 last:border-0 hover:bg-gray-50">
                            <td className="py-2.5 px-2 font-mono text-xs text-gray-600">
                              #{order._id.slice(-8).toUpperCase()}
                            </td>
                            <td className="py-2.5 px-2">
                              <p className="font-medium text-gray-800 text-xs">{order.user?.name}</p>
                              <p className="text-xs text-gray-500">{order.user?.email}</p>
                            </td>
                            <td className="py-2.5 px-2">
                              <span className={`badge ${statusColor(order.orderStatus)}`}>
                                {order.orderStatus}
                              </span>
                            </td>
                            <td className="py-2.5 px-2 font-semibold text-gray-800">
                              {formatPrice(order.totalAmount)}
                            </td>
                            <td className="py-2.5 px-2 text-gray-500 text-xs">
                              {new Date(order.createdAt).toLocaleDateString('en-IN')}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}