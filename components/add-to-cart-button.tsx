"use client";

import { Plus } from "lucide-react";
import { useCartStore } from "@/lib/cart-store";
import { useToast } from "@/components/toast";
import type { LicenseTier } from "@/lib/typefaces";

type Props = {
  slug: string;
  tier: LicenseTier;
  fontName: string;
};

export function AddToCartButton({ slug, tier, fontName }: Props) {
  const addItem = useCartStore((s) => s.addItem);
  const toast = useToast();

  return (
    <button
      type="button"
      onClick={() => {
        addItem(slug, tier);
        toast(`Added to cart — ${fontName} (${tier})`);
      }}
      className="ml-3 inline-flex h-7 w-7 shrink-0 items-center justify-center border border-ink/25 transition-colors hover:border-accent hover:bg-accent hover:text-paper"
      aria-label={`Add ${fontName} ${tier} license to cart`}
    >
      <Plus className="h-3.5 w-3.5" />
    </button>
  );
}
