'use client';
import Image    from 'next/image';
import Link     from 'next/link';
import { useRouter }         from 'next/navigation';
import { Minus, Plus, Trash2, ShoppingBag, Tag, Lock, Truck } from 'lucide-react';
import { useCart }  from '@/context/CartContext';
import { formatPrice } from '@/utils/formatters';

export default function CartPage() {
  const { items, removeItem, updateQuantity, subtotal, deliveryCharge, freeDeliveryLeft, salePrice } = useCart();
  const router = useRouter();
  const total  = subtotal + deliveryCharge;
  const FREE_THRESHOLD = 1500;
  const progress = Math.min((subtotal / FREE_THRESHOLD) * 100, 100);

  if (items.length === 0) {
    return (
      <div className="pt-28 min-h-screen flex items-center justify-center px-4">
        <div className="text-center">
          <div className="w-24 h-24 bg-pink-50 rounded-full flex items-center justify-center mx-auto mb-6">
            <ShoppingBag size={40} className="text-pink-400" />
          </div>
          <h2 className="text-2xl font-black text-gray-900 mb-2">Your cart is empty</h2>
          <p className="text-gray-500 mb-8">Looks like you haven't added anything yet.</p>
          <Link href="/shop" className="btn-primary inline-flex items-center gap-2">
            <ShoppingBag size={18}/> Start Shopping
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-28 pb-12 max-w-6xl mx-auto px-4">
      <h1 className="text-3xl font-black text-gray-900 mb-8">Shopping Cart</h1>

      {/* Delivery progress */}
      <div className="glass-card p-4 mb-6">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2 text-sm">
            <Truck size={16} className={deliveryCharge === 0 ? 'text-green-500' : 'text-gray-500'} />
            {deliveryCharge === 0
              ? <span className="font-semibold text-green-600">🎉 You've got FREE delivery!</span>
              : <span className="text-gray-700">Add <strong>{formatPrice(freeDeliveryLeft)}</strong> more for FREE delivery</span>
            }
          </div>
          <span className="text-xs text-gray-400">{Math.round(progress)}%</span>
        </div>
        <div className="w-full bg-gray-100 rounded-full h-2.5 overflow-hidden">
          <div className="h-full bg-gradient-to-r from-pink-400 to-pink-600 rounded-full transition-all duration-500"
            style={{ width: `${progress}%` }} />
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Items */}
        <div className="lg:col-span-2 space-y-4">
          {items.map(item => {
            const sp  = salePrice(item);
            const img = item.images?.[0]?.url || 'https://via.placeholder.com/100x100';
            return (
              <div key={`${item._id}_${item.size}`}
                className="glass-card p-4 flex gap-4 items-start group hover:shadow-lg transition-shadow">
                <div className="relative w-24 h-24 flex-shrink-0 rounded-xl overflow-hidden bg-gray-100">
                  <Image src={img} alt={item.title} fill className="object-cover" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-pink-500 font-semibold uppercase mb-0.5">{item.brand}</p>
                  <h3 className="font-semibold text-gray-900 text-sm leading-snug line-clamp-2 mb-1">{item.title}</h3>
                  {item.size && <p className="text-xs text-gray-500 mb-2">Size: <strong>{item.size}</strong></p>}

                  <div className="flex items-center justify-between">
                    {/* Qty */}
                    <div className="flex items-center gap-2 border-2 border-gray-100 rounded-xl overflow-hidden">
                      <button onClick={() => updateQuantity(item._id, item.size, item.quantity - 1)}
                        disabled={item.quantity <= 1}
                        className="p-2 hover:bg-gray-50 disabled:opacity-40 text-gray-600 transition-colors">
                        <Minus size={14} />
                      </button>
                      <span className="w-8 text-center text-sm font-bold">{item.quantity}</span>
                      <button onClick={() => updateQuantity(item._id, item.size, item.quantity + 1)}
                        disabled={item.quantity >= 10}
                        className="p-2 hover:bg-gray-50 disabled:opacity-40 text-gray-600 transition-colors">
                        <Plus size={14} />
                      </button>
                    </div>

                    {/* Price */}
                    <div className="text-right">
                      <p className="font-bold text-gray-900">{formatPrice(sp * item.quantity)}</p>
                      {item.discount > 0 && (
                        <p className="text-xs text-gray-400 line-through">{formatPrice(item.price * item.quantity)}</p>
                      )}
                    </div>
                  </div>
                </div>

                <button onClick={() => removeItem(item._id, item.size)}
                  className="text-gray-300 hover:text-red-500 transition-colors mt-1 opacity-0 group-hover:opacity-100">
                  <Trash2 size={18} />
                </button>
              </div>
            );
          })}
        </div>

        {/* Summary */}
        <div className="space-y-4">
          <div className="glass-card p-5">
            <h2 className="font-bold text-gray-900 text-lg mb-4">Price Summary</h2>

            <div className="space-y-3 text-sm mb-4">
              <div className="flex justify-between text-gray-700">
                <span>Subtotal ({items.reduce((s,i)=>s+i.quantity,0)} items)</span>
                <span className="font-medium">{formatPrice(subtotal)}</span>
              </div>
              <div className="flex justify-between text-gray-700">
                <span>Delivery</span>
                <span className={`font-medium ${deliveryCharge === 0 ? 'text-green-600' : ''}`}>
                  {deliveryCharge === 0 ? 'FREE' : formatPrice(deliveryCharge)}
                </span>
              </div>
              {subtotal > 0 && (
                <div className="flex justify-between text-green-600 font-medium">
                  <span>You Save</span>
                  <span>
                    {formatPrice(items.reduce((s,i) => s + (i.price - salePrice(i)) * i.quantity, 0))}
                  </span>
                </div>
              )}
              <hr className="border-gray-100" />
              <div className="flex justify-between font-black text-gray-900 text-base">
                <span>Total</span>
                <span>{formatPrice(total)}</span>
              </div>
            </div>

            <button onClick={() => router.push('/checkout')} className="btn-primary w-full text-base flex items-center justify-center gap-2">
              <Lock size={16} /> Secure Checkout
            </button>

            <div className="flex items-center justify-center gap-1.5 mt-3 text-xs text-gray-500">
              <Lock size={11} /> 100% Secure Payment
            </div>
          </div>

          {/* Coupon hint */}
          <div className="glass-card p-4">
            <div className="flex items-center gap-2 mb-2">
              <Tag size={16} className="text-pink-600" />
              <span className="text-sm font-semibold text-gray-800">Available Coupons</span>
            </div>
            {['GLOW20 — 20% off (max ₹300)', 'FLAT100 — ₹100 off on ₹999+', 'NEWUSER — 15% off for new users'].map((c, i) => (
              <p key={i} className="text-xs text-gray-500 py-1 border-b border-gray-100 last:border-0">{c}</p>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}