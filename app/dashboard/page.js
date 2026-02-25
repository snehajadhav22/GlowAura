'use client';
import { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Image from 'next/image';
import { ShoppingBag, Heart, User, Package, Star, Loader2, MapPin, Phone, Mail, Clock } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import DashboardSidebar from '@/components/DashboardSidebar';
import { formatPrice, statusColor } from '@/utils/formatters';
import api from '@/lib/axios';
import toast from 'react-hot-toast';
import ProductCard from '@/components/ProductCard';

export default function DashboardPage() {
  return (
    <Suspense fallback={<div className="flex justify-center py-32"><Loader2 className="animate-spin text-pink-500" /></div>}>
      <DashboardContent />
    </Suspense>
  );
}

function DashboardContent() {
  const searchParams = useSearchParams();
  const activeTab = searchParams.get('tab') || '';
  const { user, updateUser } = useAuth();
  const [orders, setOrders] = useState([]);
  const [wishlist, setWishlist] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (activeTab === 'orders' || activeTab === '') fetchOrders();
    if (activeTab === 'wishlist') fetchWishlist();
  }, [activeTab]);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const { data } = await api.get('/orders/my-orders');
      setOrders(data.orders || []);
    } catch {
      // Handle error quietly
    } finally { setLoading(false); }
  };

  const fetchWishlist = async () => {
    setLoading(true);
    try {
      const { data } = await api.get('/auth/me');
      setWishlist(data.user.wishlist || []);
    } catch {
      // Handle error quietly
    } finally { setLoading(false); }
  };

  const handleProfileSave = async (e) => {
    e.preventDefault();
    const fd = new FormData(e.target);
    try {
      const { data } = await api.put('/auth/profile', {
        name: fd.get('name'),
        address: {
          name: fd.get('addr_name'),
          phone: fd.get('phone'),
          street: fd.get('street'),
          city: fd.get('city'),
          state: fd.get('state'),
          pincode: fd.get('pincode'),
        },
      });
      updateUser(data.user);
      toast.success('Profile updated vibes! ✨');
    } catch { toast.error('Update failed bestie 😭'); }
  };

  return (
    <div className="pb-24 max-w-7xl mx-auto px-4">
      <div className="flex flex-col lg:flex-row gap-8">
        <DashboardSidebar />

        <div className="flex-1 min-w-0">
          {/* Default — Dashboard home */}
          {(activeTab === '' || !['orders', 'wishlist', 'profile'].includes(activeTab)) && (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="mb-8">
                <h1 className="text-4xl font-black text-gray-900 dark:text-white font-playfair flex items-center gap-3">
                  Hi, {user?.name?.split(' ')[0] || 'Bestie'}! <span className="animate-bounce">🌸</span>
                </h1>
                <p className="text-gray-500 dark:text-gray-400 mt-2 font-medium">Here's what's happening in your glow-up journey.</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-10">
                {[
                  { icon: ShoppingBag, label: 'Glow Orders', val: orders.length, color: 'from-blue-400 to-blue-600' },
                  { icon: Heart, label: 'Wishlist Vibes', val: wishlist.length, color: 'from-pink-400 to-pink-600' },
                  { icon: Star, label: 'Glow Points', val: orders.reduce((s, o) => s + Math.floor((o.totalAmount || 0) / 100), 0), color: 'from-amber-400 to-orange-500' },
                ].map(({ icon: Icon, label, val, color }) => (
                  <div key={label} className={`relative overflow-hidden bg-gradient-to-br ${color} rounded-3xl p-6 text-white shadow-xl group hover:scale-[1.02] transition-all`}>
                    <div className="absolute -right-4 -bottom-4 opacity-10 group-hover:scale-150 transition-transform duration-700">
                      <Icon size={120} />
                    </div>
                    <Icon size={32} className="mb-4 opacity-80" />
                    <p className="text-4xl font-black tracking-tighter">{val}</p>
                    <p className="text-sm font-black uppercase tracking-widest opacity-80 mt-1">{label}</p>
                  </div>
                ))}
              </div>

              {/* Recent orders */}
              <div className="glass-card p-8 bg-white/70 dark:bg-white/5 backdrop-blur-2xl border-white/50 dark:border-white/10 shadow-2xl">
                <div className="flex items-center justify-between mb-8">
                  <h2 className="text-xl font-black text-gray-900 dark:text-white flex items-center gap-3">
                    <Package size={24} className="text-pink-600" /> Recent Vows
                  </h2>
                  <a href="/dashboard?tab=orders" className="text-xs font-black uppercase tracking-widest text-pink-500 hover:text-purple-600 transition-colors">View All</a>
                </div>

                {loading ? (
                  <div className="flex justify-center py-12"><Loader2 className="animate-spin text-pink-600" /></div>
                ) : orders.slice(0, 3).length === 0 ? (
                  <div className="text-center py-12 bg-gray-50 dark:bg-white/5 rounded-3xl border-2 border-dashed border-gray-100 dark:border-white/5">
                    <p className="text-gray-400 dark:text-gray-500 font-medium mb-4 text-sm">No orders yet. Ready to glow?</p>
                    <a href="/shop" className="btn-primary !px-6 !py-2.5 !text-xs">Start Shopping ✨</a>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {orders.slice(0, 3).map(order => (
                      <div key={order._id} className="group flex items-center justify-between p-4 bg-white/50 dark:bg-white/5 hover:bg-white dark:hover:bg-white/10 rounded-2xl border border-pink-50 dark:border-white/5 transition-all shadow-sm hover:shadow-md">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 rounded-xl bg-pink-50 dark:bg-pink-900/10 flex items-center justify-center text-pink-500">
                            <Package size={24} />
                          </div>
                          <div>
                            <p className="text-[10px] font-black font-mono text-gray-400 uppercase">#{order._id.slice(-8)}</p>
                            <p className="font-bold text-gray-800 dark:text-gray-200 text-sm">{order.items?.length} items delivered</p>
                            <p className="text-[10px] text-gray-500 flex items-center gap-1"><Clock size={10} /> {new Date(order.createdAt).toLocaleDateString()}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-black text-gray-900 dark:text-white">{formatPrice(order.totalAmount)}</p>
                          <span className={`inline-block px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-widest ${statusColor(order.orderStatus)}`}>{order.orderStatus}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Orders Tab */}
          {activeTab === 'orders' && (
            <div className="animate-in fade-in slide-in-from-right-4 duration-500">
              <h2 className="text-3xl font-black text-gray-900 dark:text-white font-playfair mb-8">Order History</h2>

              {loading ? (
                <div className="flex justify-center py-24"><Loader2 size={48} className="animate-spin text-pink-600" /></div>
              ) : orders.length === 0 ? (
                <div className="glass-card p-16 text-center bg-white/50 dark:bg-white/5">
                  <div className="w-20 h-20 bg-pink-50 dark:bg-white/5 rounded-full flex items-center justify-center mx-auto mb-6">
                    <ShoppingBag size={40} className="text-pink-300 dark:text-gray-700" />
                  </div>
                  <p className="text-gray-500 dark:text-gray-400 font-medium text-lg">Your bag is looking a bit lonely...</p>
                  <a href="/shop" className="btn-primary !px-10 mt-6 inline-block">Discover Trends</a>
                </div>
              ) : (
                <div className="space-y-6">
                  {orders.map(order => (
                    <div key={order._id} className="glass-card p-6 bg-white dark:bg-white/5 border border-pink-50 dark:border-white/10 shadow-lg hover:shadow-xl transition-all rounded-3xl group">
                      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 gap-4 border-b border-gray-50 dark:border-white/5 pb-6">
                        <div className="flex gap-4 items-center">
                          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-gray-50 to-gray-100 dark:from-white/5 dark:to-white/10 flex items-center justify-center">
                            <Package size={28} className="text-pink-500" />
                          </div>
                          <div>
                            <p className="text-xs font-black text-pink-500 uppercase tracking-[0.2em] mb-1">Order Confirmed</p>
                            <div className="flex items-center gap-3">
                              <p className="text-lg font-black text-gray-800 dark:text-white">#{order._id.slice(-8).toUpperCase()}</p>
                              <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${statusColor(order.orderStatus)}`}>{order.orderStatus}</span>
                            </div>
                          </div>
                        </div>
                        <div className="text-left sm:text-right">
                          <p className="text-[10px] font-black text-gray-400 uppercase mb-1">Total Impact</p>
                          <p className="font-black text-2xl text-gray-900 dark:text-white">{formatPrice(order.totalAmount)}</p>
                        </div>
                      </div>

                      <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide">
                        {order.items?.map((item, i) => (
                          <div key={i} className="flex-shrink-0 w-64 flex items-center gap-4 bg-gray-50 dark:bg-white/5 rounded-2xl p-3 border border-pink-50 dark:border-white/5">
                            <div className="w-16 h-16 rounded-xl overflow-hidden bg-gray-200 flex-shrink-0 shadow-sm">
                              {item.image ? (
                                <img src={item.image} alt={item.title} className="w-full h-full object-cover" />
                              ) : (
                                <div className="w-full h-full bg-pink-100 flex items-center justify-center"><ShoppingBag size={20} className="text-pink-300" /></div>
                              )}
                            </div>
                            <div className="min-w-0 pr-2">
                              <p className="text-xs font-black text-gray-800 dark:text-gray-100 truncate">{item.title}</p>
                              <p className="text-[10px] font-black text-pink-500 mt-1 uppercase tracking-widest">Qty: {item.quantity}</p>
                              <p className="text-[10px] font-bold text-gray-400">{formatPrice(item.price || 0)} ea</p>
                            </div>
                          </div>
                        ))}
                      </div>

                      <div className="mt-6 flex flex-wrap gap-4 items-center justify-between">
                        <div className="flex items-center gap-6 text-[10px] font-black uppercase tracking-widest text-gray-400">
                          <span className="flex items-center gap-2"><Clock size={12} /> {new Date(order.createdAt).toLocaleDateString()}</span>
                          <span className="flex items-center gap-2"><MapPin size={12} /> Express Delivery</span>
                        </div>
                        <button className="text-xs font-black text-pink-500 hover:text-purple-600 transition-colors uppercase tracking-widest">Download Receipt</button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Wishlist Tab */}
          {activeTab === 'wishlist' && (
            <div className="animate-in fade-in slide-in-from-right-4 duration-500">
              <div className="flex items-center justify-between mb-8">
                <div>
                  <h2 className="text-3xl font-black text-gray-900 dark:text-white font-playfair">My Wishlist</h2>
                  <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">Things you're currently crushing on. 💖</p>
                </div>
                <p className="text-xs font-black uppercase text-pink-500 tracking-widest">{wishlist.length} Items</p>
              </div>

              {loading ? (
                <div className="flex justify-center py-24"><Loader2 size={48} className="animate-spin text-pink-600" /></div>
              ) : wishlist.length === 0 ? (
                <div className="glass-card p-16 text-center bg-white/50 dark:bg-white/5">
                  <div className="w-20 h-20 bg-rose-50 dark:bg-white/5 rounded-full flex items-center justify-center mx-auto mb-6">
                    <Heart size={40} className="text-rose-300 dark:text-gray-700" />
                  </div>
                  <p className="text-gray-500 dark:text-gray-400 font-medium text-lg">No crushes yet? That's impossible!</p>
                  <a href="/shop" className="btn-primary !px-10 mt-6 inline-block">Fall in Love</a>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                  {wishlist.map(p => (
                    <div key={p._id || p}>
                      {typeof p === 'object' ? (
                        <ProductCard product={p} />
                      ) : (
                        <div className="glass-card p-8 text-center bg-gray-50/50 dark:bg-white/5 animate-pulse rounded-[2rem]">
                          <Loader2 size={24} className="animate-spin mx-auto text-pink-200 mb-2" />
                          <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">Loading Vibe...</p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Profile Tab */}
          {activeTab === 'profile' && (
            <div className="animate-in fade-in slide-in-from-right-4 duration-500">
              <h2 className="text-3xl font-black text-gray-900 dark:text-white font-playfair mb-8">Glow Profile</h2>
              <div className="glass-card p-8 sm:p-12 bg-white/80 dark:bg-white/5 backdrop-blur-2xl border-white/50 dark:border-white/10 shadow-2xl rounded-[3rem]">
                <form onSubmit={handleProfileSave} className="space-y-8">
                  <div className="grid md:grid-cols-2 gap-8">
                    <div className="space-y-5">
                      <h3 className="text-xs font-black uppercase tracking-[0.3em] text-pink-500 mb-6 flex items-center gap-3">
                        <User size={16} /> Identity Check
                      </h3>
                      <div>
                        <label className="block text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2 ml-1">Your Name</label>
                        <input name="name" defaultValue={user?.name} className="input-field !rounded-2xl dark:bg-black/40" placeholder="Sneha Jadhav" />
                      </div>
                      <div>
                        <label className="block text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2 ml-1">Email (Locked)</label>
                        <div className="relative">
                          <input value={user?.email} disabled className="input-field !rounded-2xl opacity-60 cursor-not-allowed dark:bg-black/20 pr-10" />
                          <Mail size={16} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-300" />
                        </div>
                      </div>
                    </div>

                    <div className="space-y-5">
                      <h3 className="text-xs font-black uppercase tracking-[0.3em] text-pink-500 mb-6 flex items-center gap-3">
                        <MapPin size={16} /> Delivery Vibe
                      </h3>
                      <div className="grid grid-cols-2 gap-4">
                        {[
                          ['phone', 'Vibe Phone', user?.address?.phone, <Phone size={14} />],
                          ['pincode', 'Zip Glow', user?.address?.pincode, null],
                        ].map(([name, label, def, icon]) => (
                          <div key={name}>
                            <label className="block text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2 ml-1">{label}</label>
                            <input name={name} defaultValue={def || ''} className="input-field !rounded-2xl dark:bg-black/40" />
                          </div>
                        ))}
                      </div>
                      <div>
                        <label className="block text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2 ml-1">Street Address</label>
                        <input name="street" defaultValue={user?.address?.street || ''} className="input-field !rounded-2xl dark:bg-black/40" />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        {[
                          ['city', 'City', user?.address?.city],
                          ['state', 'State', user?.address?.state],
                        ].map(([name, label, def]) => (
                          <div key={name}>
                            <label className="block text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2 ml-1">{label}</label>
                            <input name={name} defaultValue={def || ''} className="input-field !rounded-2xl dark:bg-black/40" />
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="pt-8 border-t border-pink-50 dark:border-white/5 flex flex-col sm:flex-row items-center justify-between gap-6">
                    <p className="text-[10px] font-bold text-gray-400 dark:text-gray-500 max-w-xs text-center sm:text-left italic">
                      Your beauty preferences and glow data are securely stored and encrypted. ✨
                    </p>
                    <button type="submit" className="btn-primary !px-12 !py-4 shadow-xl shadow-pink-200 dark:shadow-pink-900/20 active:scale-95 transition-all w-full sm:w-auto">
                      Save Identity ✨
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}