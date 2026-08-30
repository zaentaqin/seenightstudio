import Link from "next/link";
import { getSettings } from "@/lib/data";

type FooterLink = { label: string; href: string };
type FooterColumn = { title: string; links: FooterLink[] };

const fallbackColumns: FooterColumn[] = [
  {
    title: "Index",
    links: [
      { label: "Home", href: "/" },
      { label: "All fonts", href: "/fonts" },
      { label: "About", href: "/about" },
      { label: "Contact", href: "/contact" },
    ],
  },
  {
    title: "Elsewhere",
    links: [
      { label: "Instagram", href: "https://instagram.com" },
      { label: "Behance", href: "https://behance.net" },
      { label: "X / Twitter", href: "https://x.com" },
    ],
  },
  {
    title: "Office",
    links: [
      { label: "hello@seenight.studio", href: "mailto:hello@seenight.studio" },
      { label: "Jakarta, ID — GMT+7", href: "/contact" },
      { label: "Always after dark", href: "/contact" },
    ],
  },
];

export async function Footer() {
  const settings = await getSettings("footer");
  const columns: FooterColumn[] = settings.columns ?? fallbackColumns;
  const newsletter: string =
    settings.newsletter ??
    "New typefaces, work in progress, and the occasional rant about spacing. No spam — we are too busy kerning.";
  const copyright: string = settings.copyright ?? "© 2026 See Night Studio";
  const notice: string =
    settings.notice ?? "Typefaces shown are placeholders — see CONCEPT.md";
  const location: string =
    settings.location ?? "Set in the dead of night, Jakarta";

  return (
    <footer className="border-t border-ink/15 bg-paper">
      <div className="mx-auto max-w-[1600px] px-4 md:px-8">
        <div className="grid grid-cols-2 gap-x-8 border-b border-ink/15 py-12 md:grid-cols-4 md:py-16">
          {columns.map((col) => (
            <div key={col.title}>
              <p className="mb-5 font-mono text-[10px] tracking-[0.2em] text-ink/50 uppercase">
                {col.title}
              </p>
              <ul className="space-y-2.5">
                {col.links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-sm transition-colors hover:text-accent"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
          <div className="col-span-2 md:col-span-1">
            <p className="mb-5 font-mono text-[10px] tracking-[0.2em] text-ink/50 uppercase">
              Newsletter
            </p>
            <p className="max-w-xs text-sm text-ink/70">{newsletter}</p>
          </div>
        </div>

        <h2 className="py-8 text-center leading-[0.85] font-bold tracking-tighter whitespace-nowrap uppercase select-none [font-size:clamp(3rem,11.5vw,11rem)]">
          See Night
        </h2>

        <div className="flex flex-col gap-2 border-t border-ink/15 py-5 font-mono text-[10px] tracking-[0.15em] text-ink/50 uppercase md:flex-row md:justify-between">
          <span>{copyright}</span>
          <span>{notice}</span>
          <span>{location}</span>
        </div>
      </div>
    </footer>
  );
}
