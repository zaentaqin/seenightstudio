"use client";

import { useState } from "react";
import Link from "next/link";
import { Menu, X, ShoppingCart } from "lucide-react";
import { ThemeToggle } from "@/components/theme-toggle";
import { CartDrawer } from "@/components/cart-drawer";
import { useCartStore } from "@/lib/cart-store";
import { allTags, CATEGORIES } from "@/lib/typefaces";

const navLinks = [
  { label: "Fonts", href: "/fonts" },
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact" },
];

const tags = allTags();

const chipBase =
  "border px-2.5 py-1.5 font-mono text-[10px] tracking-[0.15em] uppercase transition-colors border-ink/25 hover:border-ink hover:bg-ink hover:text-paper";

function FilterChips({ onNavigate }: { onNavigate: () => void }) {
  return (
    <>
      <p className="mb-3 font-mono text-[10px] tracking-[0.25em] text-ink/40 uppercase">
        Categories
      </p>
      <div className="flex flex-wrap gap-1.5">
        <Link href="/fonts" className={chipBase} onClick={onNavigate}>
          All
        </Link>
        {CATEGORIES.map((cat) => (
          <Link
            key={cat}
            href={`/fonts?cat=${cat}`}
            className={chipBase}
            onClick={onNavigate}
          >
            {cat}
          </Link>
        ))}
      </div>

      <div className="my-4 border-t border-ink/15" />

      <p className="mb-3 font-mono text-[10px] tracking-[0.25em] text-ink/40 uppercase">
        Tags
      </p>
      <div className="flex flex-wrap gap-1.5">
        {tags.map((tag) => (
          <Link
            key={tag}
            href={`/fonts?tag=${tag}`}
            className={chipBase}
            onClick={onNavigate}
          >
            {tag}
          </Link>
        ))}
      </div>
    </>
  );
}

export function Nav() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);
  const totalItems = useCartStore((s) => s.totalItems());
  const badge = totalItems > 0 ? totalItems : null;

  return (
    <>
      <header className="sticky top-0 z-50 border-b border-ink/15 bg-paper/95 backdrop-blur-sm">
        <div className="mx-auto flex max-w-[1600px] items-stretch justify-between px-4 md:px-8">
          <Link
            href="/"
            className="group flex items-center gap-2 py-4 text-base font-bold tracking-tighter uppercase"
          >
            <span className="inline-block h-2.5 w-2.5 bg-accent transition-transform group-hover:rotate-45" />
            See Night
            <sup className="font-mono text-[9px] tracking-normal">®</sup>
          </Link>

          {/* Right side: cart + theme toggle + hamburger (mobile) / full nav (desktop) */}
          <div className="flex items-stretch">
            {/* Cart button — always visible */}
            <button
              type="button"
              onClick={() => setCartOpen(true)}
              className="relative flex items-center border-l border-ink/15 px-4 transition-colors hover:bg-ink hover:text-paper"
              aria-label={`Open cart, ${badge ? `${badge} items` : "empty"}`}
            >
              <ShoppingCart className="h-5 w-5" />
              {badge !== null && (
                <span className="absolute -top-1 -right-1 flex h-4 min-w-4 items-center justify-center bg-accent px-1 font-mono text-[9px] font-bold text-paper">
                  {badge}
                </span>
              )}
            </button>

            {/* Mobile theme toggle — always visible */}
            <ThemeToggle className="flex h-full items-center border-l border-ink/15 px-4 transition-colors hover:bg-ink hover:text-paper md:hidden" />

            {/* Mobile hamburger */}
            <button
              type="button"
              onClick={() => setMobileOpen(true)}
              className="flex items-center border-l border-ink/15 px-4 md:hidden"
              aria-label="Open menu"
              aria-expanded={mobileOpen}
            >
              <Menu className="h-5 w-5" />
            </button>

            {/* Desktop nav */}
            <nav className="hidden items-stretch md:flex">
              <div className="group/link relative">
                <Link
                  href="/fonts"
                  className="flex h-full items-center border-l border-ink/15 px-4 transition-colors hover:bg-ink hover:text-paper md:px-5"
                >
                  <span className="text-xs font-medium tracking-[0.15em] uppercase">
                    Fonts
                  </span>
                </Link>

                {/* Flyout — theme-aware surface */}
                <div className="invisible absolute right-0 top-full z-[60] w-screen max-w-[600px] translate-y-px opacity-0 transition-none group-hover/link:visible group-hover/link:opacity-100">
                  <div className="border border-ink/15 bg-paper p-5 shadow-2xl md:p-6">
                    <FilterChips onNavigate={() => {}} />
                  </div>
                </div>
              </div>

              {navLinks.slice(1).map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="flex h-full items-center border-l border-ink/15 px-4 transition-colors hover:bg-ink hover:text-paper md:px-5"
                >
                  <span className="text-xs font-medium tracking-[0.15em] uppercase">
                    {link.label}
                  </span>
                </Link>
              ))}

              <ThemeToggle className="flex h-full items-center border-l border-ink/15 px-4 transition-colors hover:bg-ink hover:text-paper md:px-5" />
            </nav>
          </div>
        </div>
      </header>

      {/* Mobile overlay */}
      {mobileOpen && (
        <div className="fixed inset-0 z-[100] flex flex-col bg-paper text-ink md:hidden">
          {/* Header */}
          <div className="flex items-stretch justify-between border-b border-ink/15 px-4">
            <Link
              href="/"
              className="group flex items-center gap-2 py-4 text-base font-bold tracking-tighter uppercase"
              onClick={() => setMobileOpen(false)}
            >
              <span className="inline-block h-2.5 w-2.5 bg-accent transition-transform group-hover:rotate-45" />
              See Night
              <sup className="font-mono text-[9px] tracking-normal">®</sup>
            </Link>
            <button
              type="button"
              onClick={() => setMobileOpen(false)}
              className="flex items-center px-4"
              aria-label="Close menu"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          <nav className="flex flex-1 flex-col overflow-y-auto border-b border-ink/15">
            {/* Fonts + filters as its submenu */}
            <div className="border-b border-ink/10">
              <Link
                href="/fonts"
                onClick={() => setMobileOpen(false)}
                className="flex items-center px-4 py-4 text-2xl font-bold tracking-tight uppercase transition-colors hover:bg-ink hover:text-paper"
              >
                Fonts
              </Link>
              <div className="px-4 pb-6 pt-1">
                <FilterChips onNavigate={() => setMobileOpen(false)} />
              </div>
            </div>

            {navLinks.slice(1).map((link, i) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className={`flex items-center px-4 py-4 text-2xl font-bold tracking-tight uppercase transition-colors hover:bg-ink hover:text-paper ${
                  i < navLinks.slice(1).length - 1
                    ? "border-b border-ink/10"
                    : ""
                }`}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Theme toggle */}
          <div className="flex items-center px-4 py-3">
            <ThemeToggle className="flex h-10 items-center gap-2 border border-ink/25 px-3 transition-colors hover:bg-ink hover:text-paper" />
            <span className="ml-3 font-mono text-[10px] tracking-[0.25em] text-ink/40 uppercase">
              Theme
            </span>
          </div>
        </div>
      )}

      <CartDrawer open={cartOpen} onClose={() => setCartOpen(false)} />
    </>
  );
}
