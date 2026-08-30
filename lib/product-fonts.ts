import {
  Space_Grotesk,
  JetBrains_Mono,
  Archivo,
  Anton,
  Instrument_Serif,
  Dancing_Script,
  Oswald,
  Roboto_Slab,
  Unbounded,
} from "next/font/google";

/* UI system fonts */
const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-space-grotesk",
});

const jetBrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains-mono",
});

/*
 * Placeholder typefaces. Each product maps to one Google font until real
 * font files replace them in phase 2 — see CONCEPT.md §5.
 */
const nocturne = Archivo({
  subsets: ["latin"],
  variable: "--font-nocturne-grotesk",
});

const moonfat = Anton({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-moonfat-display",
});

const insomnia = Instrument_Serif({
  weight: "400",
  style: ["normal", "italic"],
  subsets: ["latin"],
  variable: "--font-insomnia-serif",
});

const vanta = Dancing_Script({
  subsets: ["latin"],
  variable: "--font-vanta-script",
});

const afterhours = Oswald({
  subsets: ["latin"],
  variable: "--font-afterhours-condensed",
});

const stargazer = Roboto_Slab({
  subsets: ["latin"],
  variable: "--font-stargazer-slab",
});

const lucid = Unbounded({
  subsets: ["latin"],
  variable: "--font-lucid-wide",
});

/** All font variables, applied once on <html> so they resolve everywhere. */
export const allFontVariables = [
  spaceGrotesk.variable,
  jetBrainsMono.variable,
  nocturne.variable,
  moonfat.variable,
  insomnia.variable,
  vanta.variable,
  afterhours.variable,
  stargazer.variable,
  lucid.variable,
].join(" ");

type ProductFont = {
  /** CSS custom property name holding the family, e.g. `--font-moonfat-display` */
  cssVar: string;
  /** Variable weight axis bounds; omit for single-style faces */
  weightRange?: [number, number];
  defaultWeight: number;
  hasItalic: boolean;
};

export const productFonts: Record<string, ProductFont> = {
  "nocturne-grotesk": {
    cssVar: "--font-nocturne-grotesk",
    weightRange: [100, 900],
    defaultWeight: 500,
    hasItalic: false,
  },
  "moonfat-display": {
    cssVar: "--font-moonfat-display",
    defaultWeight: 400,
    hasItalic: false,
  },
  "insomnia-serif": {
    cssVar: "--font-insomnia-serif",
    defaultWeight: 400,
    hasItalic: true,
  },
  "nightshift-mono": {
    cssVar: "--font-jetbrains-mono",
    weightRange: [100, 800],
    defaultWeight: 400,
    hasItalic: false,
  },
  "vanta-script": {
    cssVar: "--font-vanta-script",
    weightRange: [400, 700],
    defaultWeight: 500,
    hasItalic: false,
  },
  "afterhours-condensed": {
    cssVar: "--font-afterhours-condensed",
    weightRange: [200, 700],
    defaultWeight: 400,
    hasItalic: false,
  },
  "stargazer-slab": {
    cssVar: "--font-stargazer-slab",
    weightRange: [100, 900],
    defaultWeight: 500,
    hasItalic: false,
  },
  "lucid-wide": {
    cssVar: "--font-lucid-wide",
    weightRange: [200, 900],
    defaultWeight: 500,
    hasItalic: false,
  },
};

/** Weight axis position → human-readable style name. */
export const WEIGHT_NAMES: Record<number, string> = {
  100: "Thin",
  200: "ExtraLight",
  300: "Light",
  400: "Regular",
  500: "Medium",
  600: "SemiBold",
  700: "Bold",
  800: "ExtraBold",
  900: "Black",
};

/** CSS custom property holding the family for a slug, with UI-font fallback. */
export function cssVarFor(slug: string): string {
  return productFonts[slug]?.cssVar ?? "--font-space-grotesk";
}

/** Family name registered client-side for a real uploaded font file. */
export function uploadedFamilyName(slug: string): string {
  return `SN ${slug}`;
}

/**
 * Font-family stack for a slug.
 * When a real font file exists we prefer it, falling back to the Google-font
 * placeholder CSS variable so nothing renders as a bare generic family.
 */
export function fontFamilyFor(slug: string, fontPath?: string | null): string {
  const fallback = `var(${cssVarFor(slug)})`;
  return fontPath ? `"${uploadedFamilyName(slug)}", ${fallback}` : fallback;
}

export function fontFamilyStyle(
  slug: string,
  fontPath?: string | null,
): React.CSSProperties {
  return { fontFamily: fontFamilyFor(slug, fontPath) };
}
