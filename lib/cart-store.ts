"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { LicenseTier } from "@/lib/typefaces";

export type CartItem = {
  slug: string;
  tier: LicenseTier;
  qty: number;
};

type CartStore = {
  items: CartItem[];
  addItem: (slug: string, tier: LicenseTier) => void;
  removeItem: (slug: string, tier: LicenseTier) => void;
  clearCart: () => void;
  totalItems: () => number;
};

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],

      addItem: (slug, tier) =>
        set((state) => {
          const existing = state.items.find(
            (i) => i.slug === slug && i.tier === tier,
          );
          if (existing) {
            return {
              items: state.items.map((i) =>
                i.slug === slug && i.tier === tier
                  ? { ...i, qty: i.qty + 1 }
                  : i,
              ),
            };
          }
          return { items: [...state.items, { slug, tier, qty: 1 }] };
        }),

      removeItem: (slug, tier) =>
        set((state) => ({
          items: state.items.filter(
            (i) => !(i.slug === slug && i.tier === tier),
          ),
        })),

      clearCart: () => set({ items: [] }),

      totalItems: () => get().items.reduce((sum, i) => sum + i.qty, 0),
    }),
    { name: "seenight-cart" },
  ),
);
