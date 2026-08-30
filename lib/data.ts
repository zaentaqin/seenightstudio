import { createClient } from "@/lib/supabase/server";
import { hasSupabaseConfig } from "@/lib/supabase/has-config";
import {
  typefaces as fallbackTypefaces,
  type Typeface,
} from "@/lib/typefaces";

export async function getTypefaces(): Promise<Typeface[]> {
  if (!hasSupabaseConfig()) return fallbackTypefaces;

  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("typefaces")
      .select("*")
      .order("name");

    if (error || !data || data.length === 0) return fallbackTypefaces;
    return data as Typeface[];
  } catch {
    return fallbackTypefaces;
  }
}

export async function getTypefaceBySlug(
  slug: string,
): Promise<Typeface | undefined> {
  if (!hasSupabaseConfig())
    return fallbackTypefaces.find((t) => t.slug === slug);

  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("typefaces")
      .select("*")
      .eq("slug", slug)
      .single();

    if (error || !data) return fallbackTypefaces.find((t) => t.slug === slug);
    return data as Typeface;
  } catch {
    return fallbackTypefaces.find((t) => t.slug === slug);
  }
}

export async function getFeaturedTypefaces(): Promise<Typeface[]> {
  if (!hasSupabaseConfig())
    return fallbackTypefaces.filter((t) => t.featured);

  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("typefaces")
      .select("*")
      .eq("featured", true)
      .order("name");

    if (error || !data || data.length === 0)
      return fallbackTypefaces.filter((t) => t.featured);
    return data as Typeface[];
  } catch {
    return fallbackTypefaces.filter((t) => t.featured);
  }
}

export async function getAllTags(): Promise<string[]> {
  const typefaces = await getTypefaces();
  return [...new Set(typefaces.flatMap((t) => t.tags))].sort();
}

export async function getTypefaceMap(): Promise<Record<string, Typeface>> {
  const typefaces = await getTypefaces();
  return Object.fromEntries(typefaces.map((t) => [t.slug, t]));
}

/* eslint-disable @typescript-eslint/no-explicit-any */
type PageContent = Record<string, any>;

const fallbackPages: Record<string, PageContent> = {
  home: {
    heroBar: [
      "Independent type foundry",
      "Est. 2019",
      "Jakarta — GMT+7",
      "Open for custom work",
    ],
    tagline:
      "Typefaces for brands that keep late hours. Drawn by hand, spaced with obsession, released when ready.",
    services: [
      {
        index: "01",
        title: "Custom Typefaces",
        desc: "Bespoke letterforms drawn for your brand alone — logotypes, wordmarks, full families.",
      },
      {
        index: "02",
        title: "Retail Licensing",
        desc: "Desktop, web, and app licenses with terms written for humans, not lawyers.",
      },
      {
        index: "03",
        title: "Collaborations",
        desc: "Lettering, wordmark refinements, and joint releases with designers we admire.",
      },
    ],
    manifestoTeaser:
      "We draw letters after dark — because the best curves never happen at noon.",
  },
  about: {
    manifesto:
      "We are a foundry for the dark hours — drawing letters with more personality than any layout can contain.",
    values: [
      {
        index: "01",
        title: "Spacing is sacred",
        desc: "We will delay a release by a month to fix a single kerning pair. Clients notice. Readers feel it even if they never know why.",
      },
      {
        index: "02",
        title: "Personality over neutrality",
        desc: "The world has enough geometric sans. Every family we ship must have at least one detail that makes a designer smirk.",
      },
      {
        index: "03",
        title: "Drawn, then engineered",
        desc: "Letter first, outlines second, OpenType features third — but all three, always. Beauty that breaks in InDesign is not beauty.",
      },
      {
        index: "04",
        title: "Open process",
        desc: "Works in progress get published, rejected sketches stay visible. Type design looks like magic only when you hide the work.",
      },
    ],
    team: [
      { initials: "SN", name: "Sena Nakula", role: "Founder · Type Design" },
      {
        initials: "RA",
        name: "Rara Adhista",
        role: "Partner · Display & Script",
      },
      {
        initials: "DP",
        name: "Dimas Prayoga",
        role: "Engineer · Variable & Tooling",
      },
    ],
    clients: [
      "Midnight Records",
      "Kopiright Coffee",
      "Studio Larut",
      "Bulan Journal",
      "Nightshift FM",
      "Pasar Seni Digital",
    ],
  },
  contact: {
    channels: [
      { label: "General & licensing", value: "hello@seenight.studio" },
      { label: "Custom projects", value: "custom@seenight.studio" },
    ],
    socials: [
      { label: "Instagram", value: "@seenightstudio" },
      { label: "Behance", value: "/seenightstudio" },
      { label: "X / Twitter", value: "@seenightco" },
    ],
    address: "See Night Studio\nJl. Malam No. 13, Jakarta Selatan\nIndonesia 12730",
  },
};
/* eslint-enable @typescript-eslint/no-explicit-any */

export async function getPageContent(slug: string): Promise<PageContent> {
  if (!hasSupabaseConfig()) return fallbackPages[slug] ?? {};

  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("pages")
      .select("content")
      .eq("slug", slug)
      .single();

    if (error || !data) return fallbackPages[slug] ?? {};
    return data.content as PageContent;
  } catch {
    return fallbackPages[slug] ?? {};
  }
}

/* eslint-disable @typescript-eslint/no-explicit-any */
type SettingsValue = Record<string, any>;

const fallbackSettings: Record<string, SettingsValue> = {
  footer: {
    columns: [
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
          {
            label: "hello@seenight.studio",
            href: "mailto:hello@seenight.studio",
          },
          { label: "Jakarta, ID — GMT+7", href: "/contact" },
          { label: "Always after dark", href: "/contact" },
        ],
      },
    ],
    newsletter:
      "New typefaces, work in progress, and the occasional rant about spacing. No spam — we are too busy kerning.",
    copyright: "© 2026 See Night Studio",
    notice: "Typefaces shown are placeholders — see CONCEPT.md",
    location: "Set in the dead of night, Jakarta",
  },
  nav: {
    links: [
      { label: "Fonts", href: "/fonts" },
      { label: "About", href: "/about" },
      { label: "Contact", href: "/contact" },
    ],
  },
};
/* eslint-enable @typescript-eslint/no-explicit-any */

export async function getSettings(key: string): Promise<SettingsValue> {
  if (!hasSupabaseConfig()) return fallbackSettings[key] ?? {};

  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("settings")
      .select("value")
      .eq("key", key)
      .single();

    if (error || !data) return fallbackSettings[key] ?? {};
    return data.value as SettingsValue;
  } catch {
    return fallbackSettings[key] ?? {};
  }
}
