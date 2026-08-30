import Link from "next/link";
import { ArrowDown, ArrowUpRight } from "lucide-react";
import { getFeaturedTypefaces, getPageContent, getTypefaces } from "@/lib/data";
import { formatPrice } from "@/lib/typefaces";
import { fontFamilyStyle } from "@/lib/product-fonts";
import { Marquee } from "@/components/marquee";
import { RevealSection } from "@/components/reveal-section";
import { PageBar, SectionHeading } from "@/components/ui";

export default async function Home() {
  const [featured, homeContent, allTypefaces] = await Promise.all([
    getFeaturedTypefaces(),
    getPageContent("home"),
    getTypefaces(),
  ]);

  const services = homeContent.services ?? [];
  const heroBar: string[] = homeContent.heroBar ?? [
    "Independent type foundry",
    "Est. 2019",
    "Jakarta — GMT+7",
    "Open for custom work",
  ];
  const tagline =
    homeContent.tagline ??
    "Typefaces for brands that keep late hours. Drawn by hand, spaced with obsession, released when ready.";
  const manifestoTeaser =
    homeContent.manifestoTeaser ??
    "We draw letters after dark — because the best curves never happen at noon.";

  return (
    <>
      {/* ── Hero ─────────────────────────────────────────── */}
      <section className="mx-auto max-w-[1600px] px-4 md:px-8">
        <PageBar subtle>
          {heroBar.map((item: string, i: number) => (
            <span key={i} className={i === heroBar.length - 1 ? "text-accent" : ""}>
              {item}
            </span>
          ))}
        </PageBar>

        <div className="grid grid-cols-1 gap-10 py-10 md:py-16 lg:grid-cols-12">
          <h1 className="leading-[0.82] font-bold tracking-tighter uppercase select-none lg:col-span-9 [font-size:clamp(4.5rem,17vw,17rem)]">
            <div className="hero-stagger">
              <span className="block">See</span>
              <span className="text-outline block">Night</span>
              <span className="block pl-[8%]">
                Studio
                <sup className="align-super font-mono text-[0.14em] tracking-normal">
                  ®
                </sup>
              </span>
            </div>
          </h1>

          <div className="flex flex-col justify-end gap-6 lg:col-span-3">
            <p className="max-w-xs text-lg leading-snug font-medium">
              {tagline}
            </p>
            <Link
              href="/fonts"
              className="group inline-flex w-fit items-center gap-3 border border-ink px-5 py-3 text-xs font-medium tracking-[0.2em] uppercase transition-colors hover:bg-ink hover:text-paper"
            >
              Browse fonts
              <ArrowDown className="h-4 w-4 transition-transform group-hover:translate-y-0.5" />
            </Link>
          </div>
        </div>
      </section>

      {/* ── Ticker ───────────────────────────────────────── */}
      <Marquee typefaces={allTypefaces} />

      {/* ── Featured typefaces ───────────────────────────── */}
      <RevealSection>
      <section className="mx-auto max-w-[1600px] px-4 md:px-8">
        <div className="flex items-baseline justify-between border-b border-ink py-4">
          <h2 className="font-mono text-[10px] tracking-[0.25em] uppercase">
            01 / Featured Typefaces
          </h2>
          <Link
            href="/fonts"
            className="group inline-flex items-center gap-1 font-mono text-[10px] tracking-[0.2em] uppercase transition-colors hover:text-accent"
          >
            All fonts
            <ArrowUpRight className="h-3.5 w-3.5 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 gap-px border-x border-b border-ink/15 bg-ink/15 sm:grid-cols-2 lg:grid-cols-4">
          {featured.map((font, i) => (
            <Link
              key={font.slug}
              href={`/fonts/${font.slug}`}
              className="group flex min-h-[320px] flex-col justify-between bg-paper p-5 transition-colors hover:bg-ink hover:text-paper md:min-h-[380px]"
            >
              <div className="flex items-center justify-between font-mono text-[9px] tracking-[0.2em] text-ink/50 uppercase group-hover:text-paper/50">
                <span>{String(i + 1).padStart(2, "0")}</span>
                <span>{font.category}</span>
              </div>

              <p
                className="my-8 text-center leading-none break-words transition-transform duration-200 group-hover:scale-[1.04] [font-size:clamp(2.5rem,4vw,4rem)]"
                style={fontFamilyStyle(font.slug)}
              >
                {font.name.split(" ")[0]}
              </p>

              <div>
                <p className="truncate text-sm font-bold tracking-tight uppercase">
                  {font.name}
                </p>
                <div className="mt-1 flex items-center justify-between font-mono text-[10px] tracking-[0.15em] text-ink/50 uppercase group-hover:text-paper/50">
                  <span>{font.styles} styles</span>
                  <span className="text-accent">{formatPrice(font.price)}</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>
      </RevealSection>

      {/* ── Manifesto teaser ─────────────────────────────── */}
      <RevealSection delay={100}>
      <section className="mx-auto max-w-[1600px] px-4 md:px-8">
        <SectionHeading className="py-4">02 / The Studio</SectionHeading>
        <div className="grid grid-cols-1 gap-10 py-16 md:py-24 lg:grid-cols-12">
          <p className="lg:col-span-8 leading-[1.02] font-bold tracking-tight uppercase [font-size:clamp(2rem,5.5vw,5rem)]">
            We draw letters{" "}
            <span className="text-outline">after dark</span> — because the best
            curves never happen at noon.
          </p>
          <div className="flex flex-col justify-end gap-6 lg:col-span-3 lg:col-start-10">
            <p className="max-w-xs text-sm leading-relaxed text-ink/70">
              {manifestoTeaser}
            </p>
            <Link
              href="/about"
              className="group inline-flex w-fit items-center gap-1 font-mono text-[11px] tracking-[0.2em] uppercase transition-colors hover:text-accent"
            >
              Read the manifesto
              <ArrowUpRight className="h-3.5 w-3.5 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
            </Link>
          </div>
        </div>
      </section>
      </RevealSection>

      {/* ── Services ─────────────────────────────────────── */}
      <RevealSection delay={200}>
      <section className="mx-auto max-w-[1600px] px-4 pb-24 md:px-8">
        <SectionHeading className="py-4">03 / What we do</SectionHeading>
        <div className="border-x border-b border-ink/15">
          {services.map((s: { index: string; title: string; desc: string }) => (
            <Link
              key={s.index}
              href="/contact"
              className="group grid grid-cols-12 items-center gap-4 border-b border-ink/15 px-4 py-8 transition-colors last:border-b-0 hover:bg-ink hover:text-paper md:px-8"
            >
              <span className="col-span-2 font-mono text-[10px] tracking-[0.2em] text-ink/50 group-hover:text-paper/50 md:col-span-1">
                {s.index}
              </span>
              <h3 className="col-span-10 text-xl font-bold tracking-tight uppercase md:col-span-4 md:text-3xl">
                {s.title}
              </h3>
              <p className="col-span-10 col-start-3 text-sm leading-relaxed text-ink/60 group-hover:text-paper/60 md:col-span-6 md:col-start-6">
                {s.desc}
              </p>
              <ArrowUpRight className="col-span-2 col-start-11 h-6 w-6 justify-self-end transition-transform group-hover:-translate-y-1 group-hover:translate-x-1 group-hover:text-accent" />
            </Link>
          ))}
        </div>
      </section>
      </RevealSection>
    </>
  );
}
