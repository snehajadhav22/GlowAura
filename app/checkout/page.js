'use client';
import { useState }    from 'react';
import { useRouter }   from 'next/navigation';
import { useForm }     from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z }           from 'zod';
import { Lock, Tag, CheckCircle2, MapPin, Loader2 } from 'lucide-react';
import toast           from 'react-hot-toast';
import { useCart }     from '@/context/CartContext';
import { useAuth }     from '@/context/AuthContext';
import { formatPrice } from '@/utils/formatters';
import api             from '@/lib/axios';

const schema = z.object({
  name:    z.string().min(2, 'Name is required'),
  phone:   z.string().regex(/^[6-9]\d{9}$/, 'Enter valid 10-digit mobile number'),
  street:  z.string().min(5, 'Street address required'),
  city:    z.string().min(2, 'City required'),
  state:   z.string().min(2, 'State required'),
  pincode: z.string().regex(/^\d{6}$/, 'Enter valid 6-digit pincode'),
});

export default function CheckoutPage() {
  const { items, subtotal, deliveryCharge, salePrice, clearCart } = useCart();
  const { user }  = useAuth();
  const router    = useRouter();
  const [coupon,  setCoupon]  = useState('');
  const [discount, setDiscount] = useState(0);
  const [couponMsg, setCouponMsg] = useState('');
  const [couponApplied, setCouponApplied] = useState('');
  const [paying,  setPaying]  = useState(false);

  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      name:    user?.address?.name    || user?.name || '',
      phone:   user?.address?.phone   || '',
      street:  user?.address?.street  || '',
      city:    user?.address?.city    || '',
      state:   user?.address?.state   || '',
      pincode: user?.address?.pincode || '',
    }
  });

  const total = subtotal + deliveryCharge - discount;

  const applyCoupon = async () => {
    if (!coupon.trim()) return;
    try {
      const { data } = await api.post('/orders/validate-coupon', { code: coupon, orderValue: subtotal });
      setDiscount(data.discountAmount);
      setCouponApplied(coupon.toUpperCase());
      setCouponMsg(data.message);
      toast.success(data.message);
    } catch (e) {
      setCouponMsg(e.response?.data?.message || 'Invalid coupon');
      toast.error(e.response?.data?.message || 'Invalid coupon');
    }
  };

  const loadRazorpay = () =>
    new Promise(res => {
      const s = document.createElement('script');
      s.src  = 'https://checkout.razorpay.com/v1/checkout.js';
      s.onload = () => res(true);
      s.onerror = () => res(false);
      document.body.appendChild(s);
    });

  const onSubmit = async (address) => {
    if (!items.length) { toast.error('Cart is empty'); return; }
    setPaying(true);
    try {
      const loaded = await loadRazorpay();
      if (!loaded) throw new Error('Razorpay SDK failed to load');

      const { data: rzpOrder } = await api.post('/orders/create-razorpay-order', {
        amount: total, currency: 'INR',
      });

      const opts = {
        key:        process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        amount:     rzpOrder.amount,
        currency:   rzpOrder.currency,
        name:       'GlowAura',
        description:'Beauty & Fashion Purchase',
        order_id:   rzpOrder.orderId,
        prefill:    { name: address.name, contact: address.phone, email: user?.email },
        theme:      { color: '#db2777' },
        handler: async (response) => {
          try {
            const { data } = await api.post('/orders/verify-payment', {
              razorpayOrderId:   response.razorpay_order_id,
              razorpayPaymentId: response.razorpay_payment_id,
              razorpaySignature: response.razorpay_signature,
              items: items.map(i => ({
                product:  i._id,
                title:    i.title,
                price:    salePrice(i),
                image:    i.images?.[0]?.url || '',
                quantity: i.quantity,
                size:     i.size || '',
              })),
              shippingAddress: address,
              subtotal, deliveryCharge,
              discount, couponCode: couponApplied,
              totalAmount: total,
            });
            clearCart();
            router.push(`/payment-success?orderId=${data.orderId}`);
          } catch { toast.error('Order save failed. Contact support.'); }
        },
        modal: { ondismiss: () => { setPaying(false); toast.error('Payment cancelled'); } },
      };

      new window.Razorpay(opts).open();
    } catch (e) {
      toast.error(e.message || 'Payment failed');
      setPaying(false);
    }
  };

  return (
    <div className="pt-28 pb-12 max-w-5xl mx-auto px-4">
      <h1 className="text-3xl font-black text-gray-900 mb-8 flex items-center gap-3">
        <Lock size={28} className="text-pink-600" /> Secure Checkout
      </h1>

      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="grid lg:grid-cols-5 gap-8">
          {/* Address Form */}
          <div className="lg:col-span-3 space-y-5">
            <div className="glass-card p-6">
              <h2 className="font-bold text-gray-900 text-lg mb-5 flex items-center gap-2">
                <MapPin size={20} className="text-pink-600" /> Delivery Address
              </h2>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1">Full Name *</label>
                  <input {...register('name')} className="input-field" placeholder="Priya Sharma" />
                  {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>}
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1">Mobile Number *</label>
                  <input {...register('phone')} className="input-field" placeholder="9876543210" />
                  {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone.message}</p>}
                </div>
              </div>

              <div className="mt-4">
                <label className="block text-xs font-semibold text-gray-600 mb-1">Street Address *</label>
                <input {...register('street')} className="input-field" placeholder="House / Flat no., Building, Street" />
                {errors.street && <p className="text-red-500 text-xs mt-1">{errors.street.message}</p>}
              </div>

              <div className="grid grid-cols-3 gap-4 mt-4">
                {[['city','City *','Mumbai'],['state','State *','Maharashtra'],['pincode','Pincode *','400001']].map(
                  ([field, label, placeholder]) => (
                    <div key={field}>
                      <label className="block text-xs font-semibold text-gray-600 mb-1">{label}</label>
                      <input {...register(field)} className="input-field" placeholder={placeholder} />
                      {errors[field] && <p className="text-red-500 text-xs mt-1">{errors[field].message}</p>}
                    </div>
                  )
                )}
              </div>
            </div>

            {/* Coupon */}
            <div className="glass-card p-6">
              <h2 className="font-bold text-gray-900 text-lg mb-4 flex items-center gap-2">
                <Tag size={20} className="text-pink-600" /> Apply Coupon
              </h2>
              <div className="flex gap-3">
                <input value={coupon} onChange={e => setCoupon(e.target.value.toUpperCase())}
                  className="input-field flex-1 uppercase font-mono"
                  placeholder="Enter coupon code" />
                <button type="button" onClick={applyCoupon} className="btn-outline !py-2.5 !px-5">Apply</button>
              </div>
              {couponMsg && (
                <p className={`text-sm mt-2 font-medium ${discount > 0 ? 'text-green-600' : 'text-red-500'}`}>
                  {discount > 0 && <CheckCircle2 size={14} className="inline mr-1" />}
                  {couponMsg}
                </p>
              )}
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-2">
            <div className="glass-card p-6 sticky top-28">
              <h2 className="font-bold text-gray-900 text-lg mb-4">Order Summary</h2>

              {/* Items list */}
              <div className="space-y-3 max-h-48 overflow-y-auto mb-4 pr-1">
                {items.map(item => (
                  <div key={`${item._id}_${item.size}`} className="flex gap-2 text-sm">
                    <div className="w-10 h-10 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
                      {item.images?.[0]?.url && (
                        <img src={item.images[0].url} alt={item.title} className="w-full h-full object-cover" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-gray-800 line-clamp-1">{item.title}</p>
                      <p className="text-gray-500 text-xs">Qty: {item.quantity}{item.size && ` · ${item.size}`}</p>
                    </div>
                    <p className="font-semibold text-gray-900 text-xs whitespace-nowrap">
                      {formatPrice(salePrice(item) * item.quantity)}
                    </p>
                  </div>
                ))}
              </div>

              <hr className="border-gray-100 mb-4" />

              <div className="space-y-2.5 text-sm mb-4">
                {[
                  ['Subtotal', formatPrice(subtotal), ''],
                  ['Delivery', deliveryCharge === 0 ? 'FREE' : formatPrice(deliveryCharge), deliveryCharge === 0 ? 'text-green-600' : ''],
                  discount > 0 ? [`Coupon (${couponApplied})`, `-${formatPrice(discount)}`, 'text-green-600'] : null,
                ].filter(Boolean).map(([label, val, cls]) => (
                  <div key={label} className={`flex justify-between ${cls || 'text-gray-700'}`}>
                    <span>{label}</span><span className="font-medium">{val}</span>
                  </div>
                ))}
                <hr className="border-gray-100" />
                <div className="flex justify-between font-black text-base text-gray-900">
                  <span>Total</span><span>{formatPrice(total)}</span>
                </div>
              </div>

              <button type="submit" disabled={paying}
                className="btn-primary w-full text-base flex items-center justify-center gap-2">
                {paying
                  ? <><Loader2 size={18} className="animate-spin" /> Processing…</>
                  : <><Lock size={16} /> Pay {formatPrice(total)}</>
                }
              </button>

              <div className="mt-3 flex items-center justify-center gap-1 text-xs text-gray-500">
                <Lock size={11} /> Secured by Razorpay · 256-bit SSL
              </div>
              <div className="flex justify-center gap-3 mt-3">
                {['UPI','Card','EMI','NetBanking','Wallet'].map(m => (
                  <span key={m} className="text-[10px] bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">{m}</span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}