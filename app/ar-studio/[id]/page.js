'use client';
import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import dynamic from 'next/dynamic';
import { Loader2 } from 'lucide-react';
import api from '@/lib/axios';

// Dynamic import — avoids SSR issues with MediaPipe
const ARStudio = dynamic(() => import('@/components/ar/ARStudio'), { ssr: false });

// Default shades per product category
const DEFAULT_SHADES = {
  Lipstick: [
    { hex: '#CC3344', name: 'Classic Red' },
    { hex: '#AA2233', name: 'Deep Crimson' },
    { hex: '#D4736E', name: 'Rose Nude' },
    { hex: '#CC5577', name: 'Berry Kiss' },
    { hex: '#B85C5C', name: 'Dusty Mauve' },
    { hex: '#E8967A', name: 'Peach Coral' },
    { hex: '#993333', name: 'Wine' },
    { hex: '#CC7766', name: 'Warm Nude' },
    { hex: '#885544', name: 'Chocolate' },
    { hex: '#DD6688', name: 'Pink Pop' },
  ],
  Foundation: [
    { hex: '#F5DEB3', name: 'Fair Ivory' },
    { hex: '#E8C8A0', name: 'Light Beige' },
    { hex: '#D4A873', name: 'Natural Sand' },
    { hex: '#C8A070', name: 'Golden Beige' },
    { hex: '#BA8C5C', name: 'Warm Honey' },
    { hex: '#A88050', name: 'Caramel' },
    { hex: '#8B6538', name: 'Rich Almond' },
    { hex: '#6E4820', name: 'Deep Espresso' },
  ],
  Blush: [
    { hex: '#F5A0A0', name: 'Baby Pink' },
    { hex: '#E8B0A0', name: 'Peach Glow' },
    { hex: '#DD8899', name: 'Rose' },
    { hex: '#CC7788', name: 'Berry Flush' },
    { hex: '#E0A090', name: 'Coral Sun' },
    { hex: '#CC8888', name: 'Dusty Rose' },
  ],
  Eyeshadow: [
    { hex: '#C8A088', name: 'Nude Shimmer' },
    { hex: '#8B6848', name: 'Bronze' },
    { hex: '#665544', name: 'Smoky Brown' },
    { hex: '#997766', name: 'Champagne' },
    { hex: '#554433', name: 'Dark Chocolate' },
    { hex: '#887766', name: 'Taupe' },
    { hex: '#BB8899', name: 'Mauve' },
    { hex: '#6B4466', name: 'Plum' },
  ],
  Eyeliner: [
    { hex: '#111111', name: 'Jet Black' },
    { hex: '#333333', name: 'Charcoal' },
    { hex: '#443322', name: 'Dark Brown' },
    { hex: '#222244', name: 'Navy' },
    { hex: '#442244', name: 'Deep Purple' },
  ],
  Mascara: [
    { hex: '#000000', name: 'Blackest Black' },
    { hex: '#221100', name: 'Brown-Black' },
    { hex: '#332211', name: 'Deep Brown' },
  ],
  Highlighter: [
    { hex: '#FFE8CC', name: 'Champagne Glow' },
    { hex: '#FFDDC0', name: 'Golden Hour' },
    { hex: '#FFD0E0', name: 'Pink Ice' },
    { hex: '#FFF0E0', name: 'Pearl' },
    { hex: '#F0D0B0', name: 'Sunset Bronze' },
  ],
  Contour: [
    { hex: '#A08060', name: 'Light Sculpt' },
    { hex: '#8B6B4A', name: 'Medium Sculpt' },
    { hex: '#705838', name: 'Dark Sculpt' },
    { hex: '#5C4830', name: 'Deep Sculpt' },
  ],
};

export default function ARStudioPage() {
  const { id } = useParams();
  const router = useRouter();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showAR, setShowAR] = useState(false);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const { data } = await api.get(`/products/${id}`);
        setProduct(data.product);
        setShowAR(true);
      } catch {
        router.push('/shop');
      } finally { setLoading(false); }
    };
    fetchProduct();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <Loader2 size={32} className="text-pink-500 animate-spin" />
      </div>
    );
  }

  if (!product) return null;

  const category = product.category || 'Lipstick';
  const shades = product.arConfig?.shades?.length
    ? product.arConfig.shades
    : DEFAULT_SHADES[category] || DEFAULT_SHADES.Lipstick;

  return showAR ? (
    <ARStudio
      product={product}
      shades={shades}
      onClose={() => router.back()}
    />
  ) : null;
}