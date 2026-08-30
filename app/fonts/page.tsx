import type { Metadata } from "next";
import { Suspense } from "react";
import { getTypefaces, getAllTags } from "@/lib/data";
import { FontIndex } from "@/components/font-index";
import { PageBar } from "@/components/ui";

export const metadata: Metadata = {
  title: "Fonts",
  description:
    "The See Night Studio index — retail typefaces for brands that keep late hours.",
};

export default async function FontsPage() {
  const [typefaces, tags] = await Promise.all([getTypefaces(), getAllTags()]);

  return (
    <>
      <section className="mx-auto max-w-[1600px] px-4 md:px-8">
        <PageBar>
          <span>Index</span>
          <span>{typefaces.length} retail typefaces</span>
          <span className="hidden md:inline">Prices in USD</span>
        </PageBar>
      </section>

      <Suspense
        fallback={
          <div className="mx-auto max-w-[1600px] px-4 pb-24 md:px-8">
            <div className="h-96 animate-pulse border border-ink/15 bg-ink/5" />
          </div>
        }
      >
        <FontIndex items={typefaces} tags={tags} />
      </Suspense>
    </>
  );
}
