'use client';
import { useEffect, useState } from 'react';
import { Loader2, ChevronDown, ChevronUp } from 'lucide-react';
import toast from 'react-hot-toast';
import AdminSidebar from '@/components/AdminSidebar';
import { formatPrice, statusColor } from '@/utils/formatters';
import api from '@/lib/axios';

const STATUSES = ['Pending', 'Confirmed', 'Shipped', 'Delivered', 'Cancelled'];

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [filter, setFilter] = useState('');
  const [expanded, setExpanded] = useState(null);

  useEffect(() => { fetchOrders(); }, [page, filter]);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const q = `?page=${page}${filter ? `&status=${filter}` : ''}`;
      const { data } = await api.get(`/admin/orders${q}`);
      setOrders(data.orders);
      setPages(data.pages);
    } finally { setLoading(false); }
  };

  const updateStatus = async (orderId, status) => {
    try {
      await api.put(`/admin/orders/${orderId}/status`, { status });
      toast.success(`Order ${status.toLowerCase()}`);
      fetchOrders();
    } catch { toast.error('Update failed'); }
  };

  return (
    <div className="pt-28 pb-12 max-w-7xl mx-auto px-4">
      <div className="flex gap-6">
        <AdminSidebar />
        <div className="flex-1 min-w-0">
          <h1 className="text-2xl font-black text-gray-900 mb-6">Manage Orders</h1>

          {/* Filters */}
          <div className="flex flex-wrap gap-2 mb-6">
            <button
              onClick={() => { setFilter(''); setPage(1); }}
              className={`px-4 py-2 rounded-xl text-sm font-medium transition-all
                ${!filter ? 'bg-pink-600 text-white' : 'bg-white border border-gray-200 text-gray-600 hover:border-pink-400'}`}>
              All
            </button>
            {STATUSES.map(s => (
              <button
                key={s}
                onClick={() => { setFilter(s); setPage(1); }}
                className={`px-4 py-2 rounded-xl text-sm font-medium transition-all
                  ${filter === s ? 'bg-pink-600 text-white' : 'bg-white border border-gray-200 text-gray-600 hover:border-pink-400'}`}>
                {s}
              </button>
            ))}
          </div>

          {loading ? (
            <div className="flex justify-center py-20"><Loader2 size={36} className="animate-spin text-pink-600" /></div>
          ) : orders.length === 0 ? (
            <div className="glass-card p-12 text-center text-gray-500">No orders found</div>
          ) : (
            <div className="space-y-4">
              {orders.map(order => (
                <div key={order._id} className="glass-card overflow-hidden">
                  {/* Header */}
                  <div
                    className="p-4 flex items-center justify-between cursor-pointer hover:bg-gray-50 transition-colors"
                    onClick={() => setExpanded(expanded === order._id ? null : order._id)}
                  >
                    <div>
                      <p className="font-mono text-sm text-gray-500">#{order._id.slice(-8).toUpperCase()}</p>
                      <p className="text-xs text-gray-400">{new Date(order.createdAt).toLocaleString('en-IN')}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-gray-900">{formatPrice(order.totalAmount)}</p>
                      <span className={`badge ${statusColor(order.orderStatus)}`}>{order.orderStatus}</span>
                    </div>
                    {expanded === order._id ? <ChevronUp size={20} className="text-gray-400" /> : <ChevronDown size={20} className="text-gray-400" />}
                  </div>

                  {/* Expanded Details */}
                  {expanded === order._id && (
                    <div className="border-t border-gray-100 p-4 bg-gray-50/50">
                      {/* Customer */}
                      <div className="mb-4">
                        <p className="text-xs text-gray-500 uppercase tracking-wide font-semibold mb-1">Customer</p>
                        <p className="font-medium text-gray-800">{order.user?.name}</p>
                        <p className="text-sm text-gray-500">{order.user?.email}</p>
                      </div>

                      {/* Shipping */}
                      <div className="mb-4">
                        <p className="text-xs text-gray-500 uppercase tracking-wide font-semibold mb-1">Shipping Address</p>
                        <p className="text-sm text-gray-700">
                          {order.shippingAddress?.name}<br />
                          {order.shippingAddress?.street}, {order.shippingAddress?.city}<br />
                          {order.shippingAddress?.state} - {order.shippingAddress?.pincode}<br />
                          📱 {order.shippingAddress?.phone}
                        </p>
                      </div>

                      {/* Items */}
                      <div className="mb-4">
                        <p className="text-xs text-gray-500 uppercase tracking-wide font-semibold mb-2">Items</p>
                        <div className="space-y-2">
                          {order.items?.map((item, i) => (
                            <div key={i} className="flex items-center gap-3 bg-white p-2 rounded-xl">
                              <div className="w-12 h-12 rounded-lg bg-gray-100 overflow-hidden relative">
                                {item.image && <img src={item.image} alt={item.title} className="w-full h-full object-cover" />}
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium text-gray-800 truncate">{item.title}</p>
                                <p className="text-xs text-gray-500">Qty: {item.quantity} {item.size && `· Size: ${item.size}`}</p>
                              </div>
                              <p className="text-sm font-semibold text-gray-900">{formatPrice(item.price * item.quantity)}</p>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Payment */}
                      <div className="flex flex-wrap items-center justify-between gap-4">
                        <div>
                          <p className="text-xs text-gray-500">Payment: <span className="font-semibold text-green-600 capitalize">{order.paymentStatus}</span></p>
                          {order.razorpayPaymentId && (
                            <p className="text-xs text-gray-400 font-mono">Razorpay ID: {order.razorpayPaymentId}</p>
                          )}
                        </div>

                        {/* Status Update */}
                        {order.orderStatus !== 'Cancelled' && order.orderStatus !== 'Delivered' && (
                          <div className="flex items-center gap-2">
                            <span className="text-sm text-gray-600">Update Status:</span>
                            <select
                              value={order.orderStatus}
                              onChange={e => updateStatus(order._id, e.target.value)}
                              className="input-field !py-2 !text-sm !w-auto"
                            >
                              {STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
                            </select>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* Pagination */}
          {pages > 1 && (
            <div className="flex justify-center gap-2 mt-8">
              {Array.from({ length: pages }, (_, i) => i + 1).map(p => (
                <button
                  key={p}
                  onClick={() => setPage(p)}
                  className={`w-10 h-10 rounded-xl text-sm font-medium transition-all
                    ${p === page ? 'bg-pink-600 text-white shadow-lg' : 'bg-white border border-gray-200 hover:border-pink-400'}`}>
                  {p}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}