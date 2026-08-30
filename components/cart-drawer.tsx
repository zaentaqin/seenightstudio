"use client";

import { useEffect, useRef } from "react";
import { X, Trash2, ShoppingBag } from "lucide-react";
import { useCartStore } from "@/lib/cart-store";
import { getLicensePrice, formatPrice, type Typeface } from "@/lib/typefaces";

type Props = {
  open: boolean;
  onClose: () => void;
  typefaceMap: Record<string, Typeface>;
};

export function CartDrawer({ open, onClose, typefaceMap }: Props) {
  const items = useCartStore((s) => s.items);
  const removeItem = useCartStore((s) => s.removeItem);
  const clearCart = useCartStore((s) => s.clearCart);
  const overlayRef = useRef<HTMLDivElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  const total = items.reduce((sum, item) => {
    const font = typefaceMap[item.slug];
    return sum + (font ? getLicensePrice(font, item.tier) * item.qty : 0);
  }, 0);

  return (
    <>
      {/* Overlay */}
      <div
        ref={overlayRef}
        className={`fixed inset-0 z-[150] bg-ink/60 transition-opacity duration-300 ${
          open ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Panel */}
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-label="Shopping cart"
        className={`fixed top-0 right-0 z-[160] flex h-full w-full max-w-md flex-col bg-paper transition-transform duration-300 ease-out ${
          open ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-ink/15 px-6 py-4">
          <h2 className="text-lg font-bold tracking-tight uppercase">Cart</h2>
          <button
            type="button"
            onClick={onClose}
            className="border border-ink/25 p-2 transition-colors hover:bg-ink hover:text-paper"
            aria-label="Close cart"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Items */}
        <div className="flex-1 overflow-y-auto px-6 py-4">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <ShoppingBag className="mb-4 h-10 w-10 text-ink/20" />
              <p className="text-sm text-ink/50">Your cart is empty.</p>
            </div>
          ) : (
            <ul className="space-y-4">
              {items.map((item) => {
                const font = typefaceMap[item.slug];
                if (!font) return null;
                const price = getLicensePrice(font, item.tier);
                return (
                  <li
                    key={`${item.slug}-${item.tier}`}
                    className="border border-ink/15 p-4"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-bold tracking-tight">
                          {font.name}
                        </p>
                        <p className="mt-0.5 font-mono text-[10px] tracking-[0.15em] uppercase text-ink/50">
                          {item.tier} license
                          {item.qty > 1 ? ` × ${item.qty}` : ""}
                        </p>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="text-sm font-bold text-accent">
                          {formatPrice(price * item.qty)}
                        </span>
                        <button
                          type="button"
                          onClick={() => removeItem(item.slug, item.tier)}
                          className="text-ink/30 transition-colors hover:text-accent"
                          aria-label={`Remove ${font.name} ${item.tier}`}
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  </li>
                );
              })}
            </ul>
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className="border-t border-ink/15 px-6 py-4">
            <div className="mb-4 flex items-baseline justify-between">
              <span className="font-mono text-[10px] tracking-[0.2em] uppercase text-ink/50">
                Total
              </span>
              <span className="text-xl font-bold">{formatPrice(total)}</span>
            </div>
            <button
              type="button"
              className="w-full border border-ink bg-ink py-3 text-xs font-bold tracking-[0.2em] uppercase text-paper transition-colors hover:border-accent hover:bg-accent"
              disabled
            >
              Checkout — Coming Soon
            </button>
            <button
              type="button"
              onClick={clearCart}
              className="mt-2 w-full py-2 font-mono text-[10px] tracking-[0.15em] uppercase text-ink/40 transition-colors hover:text-accent"
            >
              Clear cart
            </button>
          </div>
        )}
      </div>
    </>
  );
}
