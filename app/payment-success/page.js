'use client';
import { useEffect, useState } from 'react';
import { useSearchParams }     from 'next/navigation';
import Link from 'next/link';
import { CheckCircle2, Package, ShoppingBag, ArrowRight } from 'lucide-react';
import api from '@/lib/axios';

export default function PaymentSuccessPage() {
  const searchParams = useSearchParams();
  const orderId      = searchParams.get('orderId');
  const [order, setOrder] = useState(null);

  useEffect(() => {
    if (orderId) {
      api.get(`/orders/${orderId}`)
        .then(r => setOrder(r.data.order))
        .catch(() => {});
    }
  }, [orderId]);

  return (
    <div className="pt-28 pb-12 min-h-screen flex items-center justify-center px-4">
      <div className="max-w-md w-full">
        {/* Success card */}
        <div className="glass-card p-8 text-center">
          {/* Animated check */}
          <div className="relative mx-auto w-24 h-24 mb-6">
            <div className="absolute inset-0 bg-green-100 rounded-full animate-ping opacity-30" />
            <div className="relative w-24 h-24 bg-gradient-to-br from-green-400 to-emerald-500 rounded-full flex items-center justify-center shadow-xl">
              <CheckCircle2 size={44} className="text-white" strokeWidth={2.5} />
            </div>
          </div>

          <h1 className="text-3xl font-black text-gray-900 mb-2">Payment Successful!</h1>
          <p className="text-gray-600 mb-1">Thank you for shopping with <span className="text-pink-600 font-bold">GlowAura</span> ✨</p>
          {orderId && (
            <p className="text-xs text-gray-400 mb-6 font-mono">
              Order ID: <span className="text-gray-600">{orderId}</span>
            </p>
          )}

          {/* Order summary */}
          {order && (
            <div className="bg-gray-50 rounded-xl p-4 mb-6 text-left">
              <p className="text-sm font-semibold text-gray-800 mb-3 flex items-center gap-2">
                <Package size={16} className="text-pink-600"/> Order Details
              </p>
              <div className="space-y-2">
                {order.items?.slice(0, 3).map((item, i) => (
                  <div key={i} className="flex justify-between text-xs text-gray-600">
                    <span className="line-clamp-1 flex-1">{item.title} × {item.quantity}</span>
                    <span className="ml-2 font-medium">₹{(item.price * item.quantity).toLocaleString('en-IN')}</span>
                  </div>
                ))}
                {order.items?.length > 3 && (
                  <p className="text-xs text-gray-400">+{order.items.length - 3} more items</p>
                )}
                <hr className="border-gray-200" />
                <div className="flex justify-between text-sm font-bold text-gray-900">
                  <span>Total Paid</span>
                  <span>₹{order.totalAmount?.toLocaleString('en-IN')}</span>
                </div>
              </div>
            </div>
          )}

          {/* Delivery info */}
          <div className="bg-pink-50 rounded-xl p-3 mb-6 text-sm text-pink-700 font-medium">
            📦 Expected delivery in 5–7 business days
          </div>

          <div className="flex gap-3">
            <Link href="/dashboard?tab=orders"
              className="flex-1 btn-primary text-sm flex items-center justify-center gap-2">
              <Package size={16} /> Track Order
            </Link>
            <Link href="/shop"
              className="flex-1 btn-outline text-sm flex items-center justify-center gap-2">
              <ShoppingBag size={16} /> Shop More
            </Link>
          </div>
        </div>

        {/* Trust badges */}
        <div className="flex justify-center gap-4 mt-6 text-xs text-gray-500">
          {['🔒 Secure Payment', '↩️ Easy Returns', '⭐ Authentic Products'].map(t => (
            <span key={t}>{t}</span>
          ))}
        </div>
      </div>
    </div>
  );
}