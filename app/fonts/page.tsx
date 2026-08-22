import type { Metadata } from "next";
import { Suspense } from "react";
import { allTags, typefaces } from "@/lib/typefaces";
import { productFonts } from "@/lib/product-fonts";
import { FontIndex } from "@/components/font-index";

export const metadata: Metadata = {
  title: "Fonts",
  description:
    "The See Night Studio index — retail typefaces for brands that keep late hours.",
};

export default function FontsPage() {
  const items = typefaces.map((t) => ({
    ...t,
    fontVar: productFonts[t.slug]?.cssVar ?? "--font-space-grotesk",
  }));

  return (
    <>
      <section className="mx-auto max-w-[1600px] px-4 md:px-8">
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-ink py-4 font-mono text-[10px] tracking-[0.2em] uppercase">
          <span>Index</span>
          <span>{typefaces.length} retail typefaces</span>
          <span className="hidden md:inline">Prices in USD</span>
        </div>

        <h1 className="py-10 leading-[0.85] font-bold tracking-tighter uppercase select-none [font-size:clamp(3.5rem,12vw,12rem)]">
          All<span className="text-outline">Fonts</span>
        </h1>
      </section>

      <Suspense
        fallback={
          <div className="mx-auto max-w-[1600px] px-4 pb-24 md:px-8">
            <div className="h-96 animate-pulse border border-ink/15 bg-ink/5" />
          </div>
        }
      >
        <FontIndex items={items} tags={allTags()} />
      </Suspense>
    </>
  );
}
