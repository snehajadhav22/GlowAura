'use client';
import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import toast from 'react-hot-toast';

const CartContext = createContext(null);

export function CartProvider({ children }) {
  const [items,   setItems]   = useState([]);
  const [hydrated, setHydrated] = useState(false);

  // Load from localStorage on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem('glowaura_cart');
      if (saved) setItems(JSON.parse(saved));
    } catch {}
    setHydrated(true);
  }, []);

  // Persist to localStorage
  useEffect(() => {
    if (hydrated) localStorage.setItem('glowaura_cart', JSON.stringify(items));
  }, [items, hydrated]);

  const addItem = useCallback((product, quantity = 1, size = '') => {
    setItems(prev => {
      const key = `${product._id}_${size}`;
      const existing = prev.find(i => `${i._id}_${i.size}` === key);
      if (existing) {
        toast.success('Quantity updated!');
        return prev.map(i =>
          `${i._id}_${i.size}` === key
            ? { ...i, quantity: Math.min(i.quantity + quantity, 10) }
            : i
        );
      }
      toast.success('Added to cart! 🛍️');
      return [...prev, { ...product, quantity, size }];
    });
  }, []);

  const removeItem = useCallback((productId, size = '') => {
    setItems(prev => prev.filter(i => !(i._id === productId && i.size === size)));
    toast.success('Removed from cart');
  }, []);

  const updateQuantity = useCallback((productId, size, qty) => {
    if (qty < 1) return;
    setItems(prev =>
      prev.map(i =>
        i._id === productId && i.size === size
          ? { ...i, quantity: Math.min(qty, 10) }
          : i
      )
    );
  }, []);

  const clearCart = useCallback(() => {
    setItems([]);
    localStorage.removeItem('glowaura_cart');
  }, []);

  const salePrice = (p) => Math.round(p.price * (1 - (p.discount || 0) / 100));

  const subtotal      = items.reduce((s, i) => s + salePrice(i) * i.quantity, 0);
  const totalItems    = items.reduce((s, i) => s + i.quantity, 0);
  const deliveryCharge = subtotal >= 1500 ? 0 : subtotal > 0 ? 99 : 0;
  const freeDeliveryLeft = Math.max(0, 1500 - subtotal);

  return (
    <CartContext.Provider value={{
      items, addItem, removeItem, updateQuantity, clearCart,
      subtotal, totalItems, deliveryCharge, freeDeliveryLeft, salePrice,
    }}>
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used within CartProvider');
  return ctx;
};