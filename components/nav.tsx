import Link from "next/link";

const links = [
  { index: "01", label: "Fonts", href: "/fonts" },
  { index: "02", label: "About", href: "/about" },
  { index: "03", label: "Contact", href: "/contact" },
];

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

        <nav className="flex items-center">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="group flex items-baseline gap-1.5 border-l border-ink/15 px-3 py-4 transition-colors first:border-l-0 hover:bg-ink hover:text-paper md:px-5"
            >
              <span className="hidden font-mono text-[9px] text-ink/40 transition-colors group-hover:text-paper/50 sm:inline">
                {link.index}
              </span>
              <span className="text-xs font-medium tracking-[0.15em] uppercase">
                {link.label}
              </span>
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}
