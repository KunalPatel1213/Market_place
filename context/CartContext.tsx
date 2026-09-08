"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";
import type { ReactNode } from "react";

export type CartItem = {
  productId: number;
  title: string;
  price: number;
  image: string;
  quantity: number;
  sellerId: string;
};

type CartContextValue = {
  items: CartItem[];
  addItem: (item: Omit<CartItem, "quantity">, quantity?: number) => void;
  removeItem: (productId: number) => void;
  updateQuantity: (productId: number, quantity: number) => void;
  clearCart: () => void;
  getTotal: () => number;
  itemCount: number;
  isHydrated: boolean;
};

const CartContext = createContext<CartContextValue | undefined>(undefined);
const STORAGE_KEY = "trustkart-cart";

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    try {
      const saved = window.localStorage.getItem(STORAGE_KEY);
      // localStorage is the external source that rehydrates the cart after mount.
      // eslint-disable-next-line react-hooks/set-state-in-effect
      if (saved) setItems(JSON.parse(saved) as CartItem[]);
    } catch {
      window.localStorage.removeItem(STORAGE_KEY);
    } finally {
      setIsHydrated(true);
    }
  }, []);

  useEffect(() => {
    if (isHydrated) window.localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  }, [isHydrated, items]);

  const value = useMemo<CartContextValue>(() => ({
    items,
    addItem: (item, quantity = 1) => setItems((current) => {
      const existing = current.find((entry) => entry.productId === item.productId);
      if (existing) return current.map((entry) => entry.productId === item.productId ? { ...entry, quantity: entry.quantity + quantity } : entry);
      return [...current, { ...item, quantity }];
    }),
    removeItem: (productId) => setItems((current) => current.filter((item) => item.productId !== productId)),
    updateQuantity: (productId, quantity) => setItems((current) => quantity <= 0 ? current.filter((item) => item.productId !== productId) : current.map((item) => item.productId === productId ? { ...item, quantity } : item)),
    clearCart: () => setItems([]),
    getTotal: () => items.reduce((total, item) => total + item.price * item.quantity, 0),
    itemCount: items.reduce((total, item) => total + item.quantity, 0),
    isHydrated,
  }), [isHydrated, items]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) throw new Error("useCart must be used inside CartProvider");
  return context;
}
