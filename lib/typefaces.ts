export type Category = "display" | "sans" | "serif" | "mono" | "script";

export type Typeface = {
  slug: string;
  name: string;
  designer: string;
  category: Category;
  styles: number;
  price: number;
  year: number;
  tagline: string;
  description: string;
  tags: string[];
  featured?: boolean;
};

export const typefaces: Typeface[] = [
  {
    slug: "nocturne-grotesk",
    tags: ["variable", "grotesk", "ui", "branding", "editorial"],
    name: "Nocturne Grotesk",
    designer: "See Night Studio",
    category: "sans",
    styles: 18,
    price: 120,
    year: 2025,
    tagline: "A workhorse sans for the dark hours.",
    description:
      "Nocturne Grotesk is a nine-weight superfamily built for interfaces that never sleep. Its tight spacing and open apertures stay legible from billboard to breadcrumb, with a variable weight axis that swings from hairline whispers to black-out shouting.",
    featured: true,
  },
  {
    slug: "moonfat-display",
    tags: ["poster", "heavy", "branding", "headline"],
    name: "Moonfat",
    designer: "Rara Adhista",
    category: "display",
    styles: 1,
    price: 60,
    year: 2026,
    tagline: "Fat letters, zero apologies.",
    description:
      "Moonfat is a single-style display monster drawn at maximum density. Counters are an afterthought; impact is the point. Use it where the message must survive being read at fifty meters, or while squinting.",
    featured: true,
  },
  {
    slug: "insomnia-serif",
    tags: ["editorial", "magazine", "elegant", "high-contrast"],
    name: "Insomnia Serif",
    designer: "See Night Studio",
    category: "serif",
    styles: 2,
    price: 90,
    year: 2024,
    tagline: "Editorial elegance with a restless pulse.",
    description:
      "Insomnia Serif pairs razor-thin hairlines with wedge serifs for headlines that feel pulled straight from a midnight magazine spread. Comes with true italics that lean harder than they should.",
    featured: true,
  },
  {
    slug: "nightshift-mono",
    tags: ["code", "technical", "ui", "monospace"],
    name: "Nightshift Mono",
    designer: "Dimas Prayoga",
    category: "mono",
    styles: 8,
    price: 80,
    year: 2025,
    tagline: "Code, captions, and cargo manifests.",
    description:
      "Nightshift Mono treats monospace as a personality, not a punishment. Generous x-height, unambiguous glyphs, and punctuation tuned for long reading sessions that end long after they should.",
  },
  {
    slug: "vanta-script",
    tags: ["handwritten", "logo", "packaging", "script"],
    name: "Vanta Script",
    designer: "Rara Adhista",
    category: "script",
    styles: 4,
    price: 70,
    year: 2023,
    tagline: "The darkest black, written by hand.",
    description:
      "Vanta Script is a connected brush script with an attitude problem in the best way. Swashes land where you want them, ligatures tie the room together, and the weight axis pours from espresso-thin to syrup-heavy.",
    featured: true,
  },
  {
    slug: "afterhours-condensed",
    tags: ["condensed", "poster", "variable", "headline"],
    name: "Afterhours Condensed",
    designer: "See Night Studio",
    category: "display",
    styles: 12,
    price: 110,
    year: 2024,
    tagline: "Every poster is a tall order.",
    description:
      "Afterhours Condensed squeezes six weights and two widths into every vertical inch of your layout. Built for gig posters, ticket stubs, and anywhere horizontal space sold out early.",
  },
  {
    slug: "stargazer-slab",
    tags: ["variable", "slab", "robust", "branding"],
    name: "Stargazer Slab",
    designer: "Dimas Prayoga",
    category: "serif",
    styles: 18,
    price: 130,
    year: 2022,
    tagline: "Heavy shoulders for heavy stories.",
    description:
      "Stargazer Slab is a nine-weight slab serif with italics, designed for brands that need warmth without softness. Its bracketed serifs hold up under print pressure and screen glare alike.",
  },
  {
    slug: "lucid-wide",
    tags: ["wide", "geometric", "variable", "fashion", "poster"],
    name: "Lucid Wide",
    designer: "See Night Studio",
    category: "sans",
    styles: 14,
    price: 140,
    year: 2026,
    tagline: "Wide awake and taking up space.",
    description:
      "Lucid Wide is an expanded geometric sans that refuses to whisper. Seven weights, variable width, and a lowercase that behaves like small caps with better manners.",
    featured: true,
  },
];

export function allTags(): string[] {
  return [...new Set(typefaces.flatMap((t) => t.tags))].sort();
}

export function getTypeface(slug: string): Typeface | undefined {
  return typefaces.find((t) => t.slug === slug);
}

export function featuredTypefaces(): Typeface[] {
  return typefaces.filter((t) => t.featured);
}

export function neighbors(slug: string): {
  prev: Typeface;
  next: Typeface;
} {
  const len = typefaces.length;
  const i = Math.max(0, typefaces.findIndex((t) => t.slug === slug));
  return {
    prev: typefaces[(i - 1 + len) % len],
    next: typefaces[(i + 1) % len],
  };
}

export function formatPrice(n: number): string {
  return `$${n}`;
}
