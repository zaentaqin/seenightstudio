import Link from "next/link";
import { formatPrice, typefaces } from "@/lib/typefaces";

export function Marquee() {
  const items = typefaces.map(
    (t) => `${t.name.toUpperCase()} — ${formatPrice(t.price)}`,
  );
  // Two copies so translateX(-50%) loops seamlessly
  const loop = [...items, ...items];

  return (
    <div className="marquee-paused overflow-hidden border-y border-ink bg-ink text-paper">
      <div className="animate-marquee flex w-max items-center">
        {loop.map((item, i) => (
          <Link
            key={`${item}-${i}`}
            href="/fonts"
            className="flex items-center gap-6 px-6 py-3 text-sm tracking-wide uppercase transition-colors hover:text-accent"
          >
            <span aria-hidden className="text-accent">
              ✦
            </span>
            {item}
          </Link>
        ))}
      </div>
    </div>
  );
}
