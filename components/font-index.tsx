"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { ArrowUpRight, Search, X } from "lucide-react";
import {
  formatPrice,
  CATEGORIES,
  type Category,
  type Typeface,
} from "@/lib/typefaces";
import { fontFamilyStyle } from "@/lib/product-fonts";

function Row({ font }: { font: Typeface }) {
  return (
    <Link
      href={`/fonts/${font.slug}`}
      className="group grid grid-cols-12 items-center gap-2 border-b border-ink/15 px-4 py-6 transition-colors hover:bg-ink hover:text-paper md:px-8"
    >
      <span
        className="col-span-12 truncate text-3xl leading-none transition-transform duration-200 group-hover:translate-x-2 sm:col-span-5 md:text-4xl"
        style={fontFamilyStyle(font.slug)}
      >
        {font.name}
      </span>

      <span className="col-span-12 truncate text-xs text-ink/50 italic group-hover:text-paper/50 sm:col-span-4 sm:col-start-6 md:text-sm">
        {font.tagline}
      </span>

      <span className="hidden font-mono text-[10px] tracking-[0.1em] uppercase group-hover:text-paper/60 sm:col-span-1 sm:block">
        {font.styles} st
      </span>
      <span className="hidden font-mono text-[10px] tracking-[0.1em] group-hover:text-paper/60 sm:col-span-1 sm:block">
        ©{String(font.year).slice(2)}
      </span>
      <span className="col-span-1 text-right font-mono text-xs group-hover:text-accent">
        {formatPrice(font.price)}
      </span>
      <ArrowUpRight className="col-span-1 h-5 w-5 justify-self-end opacity-0 transition-all group-hover:translate-x-0.5 group-hover:text-accent group-hover:opacity-100" />
    </Link>
  );
}

export function FontIndex({
  items,
}: {
  items: Typeface[];
}) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [query, setQuery] = useState(() => searchParams.get("q") ?? "");
  const [category, setCategory] = useState<"all" | Category>(
    () => (searchParams.get("cat") as Category) ?? "all",
  );
  const [activeTags, setActiveTags] = useState<string[]>(() =>
    (searchParams.get("tag")?.split(",").filter(Boolean) ?? []),
  );

  const mounted = useRef(false);
  useEffect(() => {
    if (!mounted.current) {
      mounted.current = true;
      return;
    }
    setQuery(searchParams.get("q") ?? "");
    setCategory((searchParams.get("cat") as Category) ?? "all");
    setActiveTags(searchParams.get("tag")?.split(",").filter(Boolean) ?? []);
  }, [searchParams]);

  const firstRender = useRef(true);
  useEffect(() => {
    if (firstRender.current) {
      firstRender.current = false;
      return;
    }
    const t = setTimeout(() => {
      const params = new URLSearchParams();
      if (query.trim()) params.set("q", query.trim());
      if (category !== "all") params.set("cat", category);
      if (activeTags.length) params.set("tag", activeTags.join(","));
      const qs = params.toString();
      router.replace(qs ? `/fonts?${qs}` : "/fonts", { scroll: false });
    }, 250);
    return () => clearTimeout(t);
  }, [query, category, activeTags, router]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return items.filter((item) => {
      if (category !== "all" && item.category !== category) return false;
      if (activeTags.length && !item.tags.some((t) => activeTags.includes(t)))
        return false;
      if (!q) return true;
      return [item.name, item.designer, item.tagline, ...item.tags].some(
        (field) => field.toLowerCase().includes(q),
      );
    });
  }, [items, query, category, activeTags]);

  const groups = useMemo(
    () =>
      CATEGORIES.map((cat) => ({
        cat,
        fonts: filtered.filter((t) => t.category === cat),
      })).filter((g) => g.fonts.length > 0),
    [filtered],
  );

  const hasActiveFilters =
    Boolean(query.trim()) || category !== "all" || activeTags.length > 0;

  const clearAll = () => {
    setQuery("");
    setCategory("all");
    setActiveTags([]);
  };

  return (
    <section className="mx-auto max-w-[1600px] px-4 pb-24 md:px-8">
      {/* ── Search bar ─────────────────────────────────── */}
      <div className="flex items-center gap-4 border-b border-ink py-4">
        <label className="flex flex-1 items-center gap-3">
          <Search className="h-4 w-4 shrink-0 text-ink/40" />
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search name, designer, tagline…"
            aria-label="Search typefaces"
            className="w-full bg-transparent text-sm outline-none placeholder:text-ink/30"
          />
          {query && (
            <button
              type="button"
              onClick={() => setQuery("")}
              aria-label="Clear search"
              className="text-ink/40 transition-colors hover:text-accent"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </label>

        <div className="flex items-center gap-2 font-mono text-[10px] tracking-[0.2em] uppercase">
          <span>
            <span className="text-accent">{filtered.length}</span> /{" "}
            {items.length}
          </span>
          {hasActiveFilters && (
            <button
              type="button"
              onClick={clearAll}
              className="inline-flex items-center gap-1 transition-colors hover:text-accent"
            >
              Clear
              <X className="h-3 w-3" />
            </button>
          )}
        </div>
      </div>

      {/* ── Results ─────────────────────────────────────── */}
      <div className="border-t border-ink">
        {groups.length === 0 ? (
          <div className="flex min-h-[320px] flex-col items-center justify-center gap-6 border border-ink/25 p-10 text-center">
            <p className="text-3xl font-bold tracking-tight uppercase md:text-5xl">
              Nothing found
              <span className="text-outline"> in the dark</span>
            </p>
            <p className="max-w-sm text-sm text-ink/60">
              No typeface matches that combination. Loosen the search, or start
              over.
            </p>
            <button
              type="button"
              onClick={clearAll}
              className="border border-ink px-5 py-3 text-xs font-medium tracking-[0.2em] uppercase transition-colors hover:bg-ink hover:text-paper"
            >
              Reset →
            </button>
          </div>
        ) : (
          groups.map((group) => (
            <div key={group.cat}>
              <div className="flex items-baseline justify-between border-b border-ink bg-ink px-4 py-2.5 text-paper md:px-8">
                <h2 className="font-mono text-[10px] tracking-[0.25em] uppercase">
                  {group.cat}
                </h2>
                <span className="font-mono text-[10px] text-paper/50">
                  {group.fonts.length}
                </span>
              </div>
              {group.fonts.map((font) => (
                <Row key={font.slug} font={font} />
              ))}
            </div>
          ))
        )}
      </div>
    </section>
  );
}
