import Link from "next/link";
import { ThemeToggle } from "@/components/theme-toggle";
import { allTags, CATEGORIES } from "@/lib/typefaces";

const navLinks = [
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact" },
];

const tags = allTags();

const chipBase =
  "border px-2.5 py-1.5 font-mono text-[10px] tracking-[0.15em] uppercase transition-colors border-paper/25 hover:border-paper hover:bg-paper hover:text-ink";

export function Nav() {
  return (
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

        <nav className="flex items-stretch">
          {/* Fonts flyout trigger */}
          <div className="group/link relative">
            <Link
              href="/fonts"
              className="flex h-full items-center border-l border-ink/15 px-4 transition-colors hover:bg-ink hover:text-paper md:px-5"
            >
              <span className="text-xs font-medium tracking-[0.15em] uppercase">
                Fonts
              </span>
            </Link>

            {/* Flyout panel */}
            <div className="invisible absolute right-0 top-full w-screen max-w-[600px] translate-y-px opacity-0 transition-none group-hover/link:visible group-hover/link:opacity-100">
              <div className="border border-ink/15 bg-ink p-5 text-paper shadow-2xl md:p-6">
                <p className="mb-4 font-mono text-[10px] tracking-[0.25em] text-paper/40 uppercase">
                  Categories
                </p>
                <div className="flex flex-wrap gap-1.5">
                  <Link href="/fonts" className={chipBase}>
                    All
                  </Link>
                  {CATEGORIES.map((cat) => (
                      <Link
                        key={cat}
                        href={`/fonts?cat=${cat}`}
                        className={chipBase}
                      >
                        {cat}
                      </Link>
                  ))}
                </div>

                <div className="my-4 border-t border-paper/15" />

                <p className="mb-4 font-mono text-[10px] tracking-[0.25em] text-paper/40 uppercase">
                  Tags
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {tags.map((tag) => (
                    <Link
                      key={tag}
                      href={`/fonts?tag=${tag}`}
                      className={chipBase}
                    >
                      {tag}
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {navLinks.map((link) => (
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

          <ThemeToggle />
        </nav>
      </div>
    </header>
  );
}
