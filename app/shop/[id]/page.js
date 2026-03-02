'use client';
import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import {
    ShoppingBag, Heart, Star, Sparkles, ArrowLeft,
    Truck, ShieldCheck, RotateCcw, Info, Check,
    ChevronRight, Plus, Minus, Camera
} from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';
import { formatPrice, salePrice } from '@/utils/formatters';
import api from '@/lib/axios';
import toast from 'react-hot-toast';

export default function ProductDetailPage() {
    const { id } = useParams();
    const router = useRouter();
    const { addItem } = useCart();
    const { user } = useAuth();
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [activeImg, setActiveImg] = useState(0);
    const [quantity, setQuantity] = useState(1);
    const [selectedShade, setSelectedShade] = useState(null);

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const { data } = await api.get(`/products/${id}`);
                setProduct(data.product);
                if (data.product.arConfig?.shades?.length > 0) {
                    setSelectedShade(data.product.arConfig.shades[0]);
                }
            } catch (e) {
                toast.error('Product not found');
                router.push('/shop');
            } finally {
                setLoading(false);
            }
        };
        fetchProduct();
    }, [id, router]);

    if (loading) {
        return (
            <div className="pt-32 flex flex-col items-center justify-center min-h-[60vh]">
                <div className="w-16 h-16 border-4 border-pink-200 border-t-pink-600 rounded-full animate-spin mb-4" />
                <p className="text-gray-500 font-medium animate-pulse">Loading perfection... ✨</p>
            </div>
        );
    }

    if (!product) return null;

    const currentPrice = salePrice(product.price, product.discount);
    const isWishlisted = user?.wishlist?.some(p => (typeof p === 'string' ? p : p._id) === product._id);

    const handleWishlist = async () => {
        if (!user) return toast.error('Please login first');
        try {
            await api.post(`/auth/wishlist/${product._id}`);
            toast.success(isWishlisted ? 'Removed from wishlist' : 'Added to wishlist ❤️');
        } catch { toast.error('Something went wrong'); }
    };

    const handleAddToCart = () => {
        addItem({ ...product, quantity, selectedShade: selectedShade?.shadeName });
        toast.success('Added to Bag! 🛍️');
    };

    return (
        <div className="pt-28 pb-20 max-w-7xl mx-auto px-4">
            {/* Breadcrumbs */}
            <nav className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-gray-400 mb-8 overflow-x-auto whitespace-nowrap pb-2">
                <Link href="/" className="hover:text-pink-500 transition-colors">Home</Link>
                <ChevronRight size={12} />
                <Link href="/shop" className="hover:text-pink-500 transition-colors">Shop</Link>
                <ChevronRight size={12} />
                <span className="text-pink-500 truncate">{product.title}</span>
            </nav>

            <div className="grid lg:grid-cols-2 gap-12 lg:gap-16">
                {/* Left: Images */}
                <div className="space-y-4">
                    <div className="relative aspect-square rounded-[3rem] overflow-hidden bg-pink-50 dark:bg-pink-900/10 border-4 border-white dark:border-gray-800 shadow-2xl group">
                        <Image
                            src={product.images?.[activeImg]?.url || 'https://via.placeholder.com/600'}
                            alt={product.title}
                            fill
                            priority
                            className="object-cover transition-transform duration-700 group-hover:scale-105"
                        />
                        {product.discount > 0 && (
                            <div className="absolute top-6 left-6 bg-rose-500 text-white px-4 py-2 rounded-2xl text-xs font-black uppercase tracking-widest shadow-lg animate-bounce">
                                {product.discount}% OFF
                            </div>
                        )}
                        <button
                            onClick={handleWishlist}
                            className={`absolute top-6 right-6 w-12 h-12 rounded-2xl flex items-center justify-center backdrop-blur-xl border border-white/20 shadow-xl transition-all duration-300
                ${isWishlisted ? 'bg-rose-500 text-white' : 'bg-white/80 dark:bg-black/60 text-gray-400 hover:text-pink-500'}`}
                        >
                            <Heart size={24} fill={isWishlisted ? 'currentColor' : 'none'} />
                        </button>
                    </div>

                    {/* Thumbnails */}
                    {product.images?.length > 1 && (
                        <div className="flex gap-4 overflow-x-auto pb-4 no-scrollbar">
                            {product.images.map((img, idx) => (
                                <button
                                    key={idx}
                                    onClick={() => setActiveImg(idx)}
                                    className={`relative w-24 h-24 rounded-2xl overflow-hidden flex-shrink-0 border-4 transition-all
                    ${activeImg === idx ? 'border-pink-500 scale-95 shadow-lg' : 'border-white dark:border-gray-800 hover:border-pink-200 opacity-60 hover:opacity-100'}`}
                                >
                                    <Image src={img.url} alt={product.title} fill className="object-cover" />
                                </button>
                            ))}
                        </div>
                    )}
                </div>

                {/* Right: Info */}
                <div className="flex flex-col">
                    <div className="mb-8">
                        <p className="text-pink-500 font-black uppercase tracking-[0.3em] text-sm mb-3">
                            {product.brand} {product.bestseller && '• 🏆 BESTSELLER'}
                        </p>
                        <h1 className="text-4xl md:text-5xl font-black text-gray-900 dark:text-white mb-4 leading-tight">
                            {product.title}
                        </h1>

                        <div className="flex items-center gap-6 mb-6">
                            <div className="flex items-center gap-1.5 bg-amber-50 dark:bg-amber-900/20 px-3 py-1.5 rounded-xl border border-amber-100 dark:border-amber-900/30">
                                <Star size={16} className="text-amber-500 fill-amber-500" />
                                <span className="text-amber-700 dark:text-amber-400 font-black text-sm">{product.ratings}</span>
                                <span className="text-amber-300 mx-1">|</span>
                                <span className="text-xs font-bold text-amber-600/80 uppercase tracking-widest">{product.numReviews} Reviews</span>
                            </div>
                            <div className="text-xs font-black uppercase tracking-widest text-green-600 bg-green-50 dark:bg-green-900/20 px-3 py-1.5 rounded-xl">
                                Ready to Glow (In Stock)
                            </div>
                        </div>

                        <div className="flex items-baseline gap-4 mb-8">
                            <span className="text-5xl font-black text-gray-900 dark:text-white tracking-tighter">
                                {formatPrice(currentPrice)}
                            </span>
                            {product.discount > 0 && (
                                <span className="text-2xl text-gray-400 line-through font-medium">
                                    {formatPrice(product.price)}
                                </span>
                            )}
                        </div>

                        <p className="text-gray-500 dark:text-gray-400 leading-relaxed font-medium mb-8 border-l-4 border-pink-500 pl-6 py-2 italic">
                            "{product.description}"
                        </p>
                    </div>

                    {/* Shades/Options */}
                    {product.arConfig?.shades?.length > 0 && (
                        <div className="mb-8">
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="text-xs font-black uppercase tracking-widest text-gray-800 dark:text-white flex items-center gap-2">
                                    Select Shade <span className="text-pink-500">— {selectedShade?.shadeName}</span>
                                </h3>
                                {['Lipstick', 'Foundation', 'Blush', 'Eyeshadow'].includes(product.category) && (
                                    <Link href={`/ar-studio/${id}`} className="text-[10px] font-black uppercase tracking-[0.1em] text-pink-600 flex items-center gap-1.5 hover:underline">
                                        <Camera size={14} /> Try On Virtually
                                    </Link>
                                )}
                            </div>
                            <div className="flex flex-wrap gap-3">
                                {product.arConfig.shades.map((shade, idx) => (
                                    <button
                                        key={idx}
                                        onClick={() => setSelectedShade(shade)}
                                        title={shade.shadeName}
                                        className={`group relative w-10 h-10 rounded-full border-2 transition-all p-0.5
                      ${selectedShade?.shadeName === shade.shadeName ? 'border-pink-500 scale-110 shadow-lg' : 'border-gray-200 dark:border-gray-700 hover:border-pink-300'}`}
                                    >
                                        <div className="w-full h-full rounded-full shadow-inner" style={{ backgroundColor: shade.hexColor }} />
                                        {selectedShade?.shadeName === shade.shadeName && (
                                            <div className="absolute -top-1 -right-1 bg-pink-500 text-white rounded-full p-0.5 shadow-md">
                                                <Check size={10} strokeWidth={4} />
                                            </div>
                                        )}
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Actions */}
                    <div className="flex flex-col sm:flex-row gap-4 mb-10">
                        <div className="flex items-center border-2 border-gray-200 dark:border-gray-800 rounded-2xl px-2">
                            <button
                                onClick={() => setQuantity(q => Math.max(1, q - 1))}
                                className="w-12 h-12 flex items-center justify-center text-gray-400 hover:text-pink-500 transition-colors"
                                disabled={quantity === 1}
                            >
                                <Minus size={18} />
                            </button>
                            <span className="w-12 text-center font-black text-lg text-gray-900 dark:text-white">{quantity}</span>
                            <button
                                onClick={() => setQuantity(q => q + 1)}
                                className="w-12 h-12 flex items-center justify-center text-gray-400 hover:text-pink-500 transition-colors"
                            >
                                <Plus size={18} />
                            </button>
                        </div>

                        <button
                            onClick={handleAddToCart}
                            className="flex-1 btn-primary py-4 text-lg font-black uppercase tracking-widest shadow-2xl shadow-pink-200 dark:shadow-pink-900/30 flex items-center justify-center gap-3 transition-transform active:scale-95"
                        >
                            <ShoppingBag size={22} />
                            Add to Bag 🛍️
                        </button>
                    </div>

                    {/* Virtual Try On CTA if applicable */}
                    {['Lipstick', 'Foundation', 'Blush', 'Eyeshadow'].includes(product.category) && (
                        <Link href={`/ar-studio/${id}`}
                            className="mb-10 w-full py-5 rounded-3xl bg-gradient-to-r from-pink-500 via-purple-600 to-pink-500 bg-[length:200%_auto] animate-gradient flex items-center justify-center gap-3 text-white font-black uppercase tracking-[0.2em] shadow-xl hover:scale-[1.02] transition-all group"
                        >
                            <Sparkles size={24} className="group-hover:rotate-12 transition-transform" />
                            Open AI Virtual Studio
                            <Sparkles size={24} className="group-hover:-rotate-12 transition-transform" />
                        </Link>
                    )}

                    {/* Benefits */}
                    <div className="grid grid-cols-3 gap-4 border-t-2 border-gray-100 dark:border-gray-800 pt-8">
                        {[
                            { icon: Truck, label: 'Fast Delivery', sub: '2-4 Days' },
                            { icon: ShieldCheck, label: '100% Original', sub: 'Authentic' },
                            { icon: RotateCcw, label: 'Easy Returns', sub: '7 Day Policy' }
                        ].map((item, i) => (
                            <div key={i} className="text-center group">
                                <div className="w-12 h-12 bg-pink-50 dark:bg-pink-900/20 rounded-2xl mx-auto flex items-center justify-center text-pink-500 mb-3 group-hover:scale-110 transition-transform">
                                    <item.icon size={20} />
                                </div>
                                <p className="text-[10px] font-black uppercase tracking-wider text-gray-800 dark:text-gray-200 mb-0.5">{item.label}</p>
                                <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">{item.sub}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Product Details Tabs / Deep Dive */}
            <div className="mt-24">
                <div className="border-b-2 border-gray-100 dark:border-gray-800 flex gap-8 mb-12 overflow-x-auto no-scrollbar">
                    {['Description', 'How to Use', 'Reviews'].map((tab, i) => (
                        <button key={tab} className={`pb-4 text-xs font-black uppercase tracking-[0.2em] relative transition-colors
              ${i === 0 ? 'text-pink-600' : 'text-gray-400 hover:text-gray-600'}`}>
                            {tab}
                            {i === 0 && <div className="absolute bottom-0 left-0 right-0 h-1 bg-pink-600 rounded-full" />}
                        </button>
                    ))}
                </div>

                <div className="grid md:grid-cols-2 gap-16">
                    <div className="space-y-6">
                        <h3 className="text-2xl font-black text-gray-900 dark:text-white font-playfair flex items-center gap-2">
                            The Glow Secret <Sparkles size={20} className="text-pink-500" />
                        </h3>
                        <div className="prose prose-pink dark:prose-invert max-w-none text-gray-600 dark:text-gray-400 font-medium">
                            <p>{product.description}</p>
                            <ul className="grid grid-cols-2 gap-x-8 gap-y-4 pt-4 list-none p-0">
                                {[
                                    'Paraben Free', 'Cruelty Free', 'Dermatologically Tested', 'Long Lasting', 'Water Resistant', 'Suitable for all skin'
                                ].map(feature => (
                                    <li key={feature} className="flex items-center gap-2 text-xs font-black uppercase tracking-wider">
                                        <div className="w-5 h-5 rounded-full bg-pink-100 dark:bg-pink-900/30 flex items-center justify-center text-pink-600">
                                            <Check size={12} strokeWidth={4} />
                                        </div>
                                        {feature}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>

                    <div className="bg-pink-50/50 dark:bg-pink-900/5 rounded-[3rem] p-10 border-2 border-pink-100 dark:border-pink-900/10 h-fit">
                        <h3 className="text-2xl font-black text-gray-900 dark:text-white font-playfair mb-6 flex items-center gap-2">
                            Bestie's Pro Tip <Info size={20} className="text-pink-500" />
                        </h3>
                        <p className="text-gray-600 dark:text-gray-400 font-medium italic mb-6">
                            "For the most seamless finish, apply after your favorite GlowAura serum. Layer for buildable intensity that catches every light! ✨"
                        </p>
                        <div className="space-y-4">
                            <div className="flex items-center gap-3">
                                <div className="w-1 c-1 bg-pink-500 rounded-full h-12" />
                                <p className="text-sm font-bold text-gray-800 dark:text-gray-200 uppercase tracking-wide">Limited Edition Packaging</p>
                            </div>
                            <div className="flex items-center gap-3">
                                <div className="w-1 c-1 bg-purple-500 rounded-full h-12" />
                                <p className="text-sm font-bold text-gray-800 dark:text-gray-200 uppercase tracking-wide">Exclusive Member Access</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
