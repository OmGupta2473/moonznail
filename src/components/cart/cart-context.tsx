"use client";
import { createContext, useContext, useState, useCallback } from "react";
import type { CartView } from "@/lib/cart/types";
import {
  addToCart as addToCartAction,
  updateQuantity as updateQuantityAction,
  removeFromCart as removeFromCartAction,
  clearCart as clearCartAction,
} from "@/app/actions/cart";

type CartCtx = {
  cart: CartView;
  setCart: (c: CartView) => void;
  isDrawerOpen: boolean;
  openDrawer: () => void;
  closeDrawer: () => void;
  addToCart: (productId: string, quantity?: number) => Promise<{ ok: boolean; reason?: string }>;
  updateQuantity: (productId: string, quantity: number) => Promise<{ ok: boolean; reason?: string }>;
  removeFromCart: (productId: string) => Promise<{ ok: boolean; reason?: string }>;
  clearCart: () => Promise<{ ok: boolean; reason?: string }>;
};

const Ctx = createContext<CartCtx | null>(null);

export function CartProvider({ initialCart, children }: { initialCart: CartView; children: React.ReactNode }) {
  const [cart, setCart] = useState<CartView>(initialCart);
  const [isDrawerOpen, setDrawerOpen] = useState(false);
  const openDrawer = useCallback(() => setDrawerOpen(true), []);
  const closeDrawer = useCallback(() => setDrawerOpen(false), []);

  const wrap = useCallback(
    async <T extends { ok: true; cart: CartView } | { ok: false; reason: string }>(p: Promise<T>) => {
      const result = await p;
      if (result.ok) {
        setCart(result.cart);
        return { ok: true as const };
      }
      return { ok: false as const, reason: result.reason };
    },
    []
  );

  const addToCart = useCallback(
    async (productId: string, quantity = 1) => {
      const r = await wrap(addToCartAction(productId, quantity));
      if (r.ok) openDrawer();
      return r;
    },
    [wrap, openDrawer]
  );

  const updateQuantity = useCallback(
    (productId: string, quantity: number) => wrap(updateQuantityAction(productId, quantity)),
    [wrap]
  );

  const removeFromCart = useCallback(
    (productId: string) => wrap(removeFromCartAction(productId)),
    [wrap]
  );

  const clearCart = useCallback(
    () => wrap(clearCartAction()),
    [wrap]
  );

  return (
    <Ctx.Provider value={{ cart, setCart, isDrawerOpen, openDrawer, closeDrawer, addToCart, updateQuantity, removeFromCart, clearCart }}>
      {children}
    </Ctx.Provider>
  );
}

export function useCart() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useCart must be used inside CartProvider");
  return ctx;
}