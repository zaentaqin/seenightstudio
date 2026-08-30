import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowRight, ArrowUpRight } from "lucide-react";
import { getTypefaces, getTypefaceBySlug } from "@/lib/data";
import { formatPrice, type Typeface } from "@/lib/typefaces";
import {
  fontFamilyStyle,
  productFonts,
  WEIGHT_NAMES,
  cssVarFor,
} from "@/lib/product-fonts";
import { getFontFileUrlOrNull } from "@/lib/supabase/storage";
import { TypeTester } from "@/components/type-tester";
import { GlyphTester } from "@/components/glyph-tester";
import { FontFaceLoader } from "@/components/font-face-loader";
import { AddToCartButton } from "@/components/add-to-cart-button";
import { SectionHeading } from "@/components/ui";

export async function generateStaticParams() {
  const typefaces = await getTypefaces();
  return typefaces.map((t) => ({ slug: t.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const font = await getTypefaceBySlug(slug);
  if (!font) return { title: "Not found" };
  return { title: font.name, description: font.tagline };
}

function styleList(slug: string): string[] {
  const range = productFonts[slug]?.weightRange;
  if (!range) return ["Regular"];
  const names: string[] = [];
  for (let w = range[0]; w <= range[1]; w += 100) {
    names.push(WEIGHT_NAMES[w] ?? String(w));
  }
  return names;
}

async function getNeighbors(slug: string): Promise<{
  prev: Typeface;
  next: Typeface;
}> {
  const typefaces = await getTypefaces();
  const len = typefaces.length;
  const i = Math.max(
    0,
    typefaces.findIndex((t) => t.slug === slug),
  );
  return {
    prev: typefaces[(i - 1 + len) % len],
    next: typefaces[(i + 1) % len],
  };
}

export default async function TypefacePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const font = await getTypefaceBySlug(slug);
  if (!font) notFound();

  const meta = productFonts[slug];
  const styles = styleList(slug);
  const { prev, next } = await getNeighbors(slug);
  const webPrice = Math.round((font.price * 1.5) / 5) * 5;
  const appPrice = font.price * 3;
  const fontUrl = getFontFileUrlOrNull(font.font_path);

  return (
    <>
      <FontFaceLoader slug={slug} fontPath={font.font_path} />
      {/* ── Meta bar ─────────────────────────────────────── */}
      <div className="mx-auto max-w-[1600px] px-4 md:px-8">
        <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-1 border-b border-ink py-4 font-mono text-[10px] tracking-[0.2em] uppercase">
          <span>
            <Link href="/fonts" className="transition-colors hover:text-accent">
              Index
            </Link>{" "}
            / {font.name}
          </span>
          <span className="hidden sm:inline">{font.designer}</span>
          <span>©{font.year}</span>
          <span className="text-accent">{formatPrice(font.price)}</span>
        </div>
      </div>

      {/* ── Hero specimen ────────────────────────────────── */}
      <section className="mx-auto max-w-[1600px] border-b border-ink/15 px-4 py-14 md:px-8 md:py-20">
        <p
          className="text-center leading-[0.9] break-words [font-size:clamp(3rem,13vw,13rem)]"
          style={fontFamilyStyle(slug, font.font_path)}
        >
          {font.name}
        </p>
        <p className="mx-auto mt-8 max-w-md text-center text-lg leading-snug font-medium">
          {font.tagline}
        </p>
      </section>

      {/* ── Live tester ──────────────────────────────────── */}
      <section className="mx-auto max-w-[1600px] px-4 pt-16 md:px-8">
        <SectionHeading>01 / Try it live</SectionHeading>
        <TypeTester
          slug={slug}
          fontVar={cssVarFor(slug)}
          fontUrl={fontUrl}
          initialText="The night is long; the type is patient."
          weightRange={meta?.weightRange}
          defaultWeight={meta?.defaultWeight ?? 400}
          hasItalic={meta?.hasItalic ?? false}
        />
      </section>

      {/* ── About the face + specs ───────────────────────── */}
      <section className="mx-auto grid max-w-[1600px] grid-cols-1 gap-12 px-4 py-16 md:px-8 lg:grid-cols-12 lg:py-24">
        <div className="lg:col-span-7">
          <SectionHeading className="mb-8">02 / About the face</SectionHeading>
          <p className="max-w-xl text-xl leading-relaxed font-medium md:text-2xl">
            {font.description}
          </p>
        </div>

        <div className="lg:col-span-4 lg:col-start-9">
          <SectionHeading className="mb-8">03 / Specs</SectionHeading>
          <dl className="divide-y divide-ink/15 border-y border-ink/15">
            {[
              ["Designer", font.designer],
              ["Category", font.category],
              ["Styles", `${styles.length} of ${font.styles}`],
              ["Release", String(font.year)],
              [
                "Formats",
                meta?.weightRange ? "Variable + Static" : "OTF · TTF · WOFF2",
              ],
              ["From", formatPrice(font.price)],
            ].map(([label, value]) => (
              <div
                key={label}
                className="flex items-baseline justify-between py-3"
              >
                <dt className="font-mono text-[10px] tracking-[0.2em] text-ink/50 uppercase">
                  {label}
                </dt>
                <dd className="text-sm font-medium capitalize">{value}</dd>
              </div>
            ))}
          </dl>

          {font.tags.length > 0 && (
            <div className="mt-6 flex flex-wrap gap-1.5">
              {font.tags.map((tag) => (
                <span
                  key={tag}
                  className="border border-ink/25 px-2.5 py-1 font-mono text-[10px] tracking-[0.15em] uppercase"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ── Styles ───────────────────────────────────────── */}
      <section className="mx-auto max-w-[1600px] px-4 pb-16 md:px-8">
        <SectionHeading>04 / Styles</SectionHeading>
        <div className="grid grid-cols-2 gap-px border-x border-b border-ink/15 bg-ink/15 sm:grid-cols-3 lg:grid-cols-5">
          {styles.map((style, i) => (
            <Link
              key={style}
              href="/contact"
              className="group flex flex-col justify-between bg-paper p-4 transition-colors hover:bg-ink hover:text-paper"
            >
              <span className="font-mono text-[9px] tracking-[0.15em] text-ink/40 uppercase group-hover:text-paper/40">
                {String(i + 1).padStart(2, "0")}
              </span>
              <span
                className="mt-6 text-3xl leading-none transition-transform duration-200 group-hover:-translate-y-0.5"
                style={fontFamilyStyle(slug, font.font_path)}
              >
                Aa
              </span>
              <span className="mt-4 truncate font-mono text-[10px] tracking-[0.1em] uppercase">
                {font.name} {style}
              </span>
            </Link>
          ))}
        </div>
      </section>

      {/* ── Glyph grid ───────────────────────────────────── */}
      <section className="mx-auto max-w-[1600px] px-4 pb-16 md:px-8">
        <SectionHeading>05 / Glyphs — partial set</SectionHeading>
        <GlyphTester slug={slug} fontVar={cssVarFor(slug)} fontUrl={fontUrl} />
      </section>

      {/* ── Licensing ────────────────────────────────────── */}
      <section className="mx-auto max-w-[1600px] px-4 pb-16 md:px-8">
        <SectionHeading>06 / Licensing</SectionHeading>
        <div className="border-x border-b border-ink/15">
          {[
            {
              name: "Desktop",
              tier: "desktop" as const,
              desc: "Logos, print, packaging. Per workstation.",
              price: formatPrice(font.price),
            },
            {
              name: "Web",
              tier: "web" as const,
              desc: "Self-hosted WOFF2 for one domain, unlimited traffic.",
              price: formatPrice(webPrice),
            },
            {
              name: "App",
              tier: "app" as const,
              desc: "Embedded in one mobile or desktop application title.",
              price: formatPrice(appPrice),
            },
          ].map((tier) => (
            <div
              key={tier.name}
              className="group grid grid-cols-12 items-center gap-2 border-b border-ink/15 px-4 py-7 transition-colors last:border-b-0 hover:bg-ink hover:text-paper md:px-8"
            >
              <h3 className="col-span-5 text-xl font-bold tracking-tight uppercase md:col-span-3 md:text-2xl">
                {tier.name}
              </h3>
              <p className="col-span-11 col-start-2 text-sm text-ink/60 group-hover:text-paper/60 md:col-span-5 md:col-start-4">
                {tier.desc}
              </p>
              <span className="col-span-3 col-start-9 justify-self-end font-mono text-sm group-hover:text-accent md:col-span-2 md:col-start-10">
                {tier.price}
              </span>
              <div className="col-span-2 col-start-12 justify-self-end">
                <AddToCartButton
                  slug={slug}
                  tier={tier.tier}
                  fontName={font.name}
                />
              </div>
            </div>
          ))}
        </div>
        <p className="pt-4 font-mono text-[10px] tracking-[0.15em] text-ink/40 uppercase">
          Placeholder tiers — real EULA arrives with phase two.
        </p>
      </section>

      {/* ── Prev / Next ──────────────────────────────────── */}
      <nav className="mx-auto grid max-w-[1600px] grid-cols-1 border-t border-ink sm:grid-cols-2">
        <Link
          href={`/fonts/${prev.slug}`}
          className="group flex items-center gap-3 border-b border-ink px-4 py-8 transition-colors hover:bg-ink hover:text-paper sm:border-r sm:border-b-0 md:px-8"
        >
          <ArrowLeft className="h-5 w-5 shrink-0 transition-transform group-hover:-translate-x-1" />
          <span>
            <span className="block font-mono text-[9px] tracking-[0.2em] text-ink/40 uppercase group-hover:text-paper/40">
              Previous
            </span>
            <span
              className="text-2xl leading-tight md:text-3xl"
              style={fontFamilyStyle(prev.slug, prev.font_path)}
            >
              {prev.name}
            </span>
          </span>
        </Link>
        <Link
          href={`/fonts/${next.slug}`}
          className="group flex items-center justify-end gap-3 px-4 py-8 text-right transition-colors hover:bg-ink hover:text-paper md:px-8"
        >
          <span>
            <span className="block font-mono text-[9px] tracking-[0.2em] text-ink/40 uppercase group-hover:text-paper/40">
              Next
            </span>
            <span
              className="text-2xl leading-tight md:text-3xl"
              style={fontFamilyStyle(next.slug, next.font_path)}
            >
              {next.name}
            </span>
          </span>
          <ArrowRight className="h-5 w-5 shrink-0 transition-transform group-hover:translate-x-1" />
        </Link>
      </nav>

      {/* ── CTA ──────────────────────────────────────────── */}
      <div className="mx-auto max-w-[1600px] px-4 py-16 md:px-8">
        <Link
          href="/contact"
          className="group inline-flex items-center gap-2 border border-ink px-6 py-4 text-xs font-medium tracking-[0.2em] uppercase transition-colors hover:border-accent hover:bg-accent hover:text-paper"
        >
          Questions about {font.name}? Talk to us
          <ArrowUpRight className="h-4 w-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
        </Link>
      </div>
    </>
  );
}
