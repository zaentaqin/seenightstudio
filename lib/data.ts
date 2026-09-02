import { createClient } from "@/lib/supabase/server";
import { hasSupabaseTables } from "@/lib/supabase/has-config";
import { type Typeface } from "@/lib/typefaces";
import {
  localGetTypefaces,
  localGetTypefaceBySlug,
  localGetPages,
  localGetSettings,
} from "@/lib/local-store";

function toTypefaces(items: unknown[]): Typeface[] {
  return items as Typeface[];
}

function toTypeface(item: unknown): Typeface | undefined {
  return item as Typeface | undefined;
}

/** Try Supabase, silently fall back to local JSON store on any error. */
async function withSupabaseFallback<T>(
  supabaseFn: () => Promise<T>,
  fallbackFn: () => Promise<T>,
): Promise<T> {
  if (!(await hasSupabaseTables())) return fallbackFn();
  try {
    return await supabaseFn();
  } catch {
    return fallbackFn();
  }
}

export async function getTypefaces(): Promise<Typeface[]> {
  return withSupabaseFallback(
    async () => {
      const supabase = await createClient();
      const { data, error } = await supabase
        .from("typefaces")
        .select("*")
        .order("name");
      if (error || !data || data.length === 0) throw new Error("no data");
      return data as Typeface[];
    },
    async () => toTypefaces(await localGetTypefaces()),
  );
}

export async function getTypefaceBySlug(
  slug: string,
): Promise<Typeface | undefined> {
  return withSupabaseFallback(
    async () => {
      const supabase = await createClient();
      const { data, error } = await supabase
        .from("typefaces")
        .select("*")
        .eq("slug", slug)
        .single();
      if (error || !data) throw new Error("no data");
      return data as Typeface;
    },
    async () => toTypeface(await localGetTypefaceBySlug(slug)),
  );
}

export async function getFeaturedTypefaces(): Promise<Typeface[]> {
  return withSupabaseFallback(
    async () => {
      const supabase = await createClient();
      const { data, error } = await supabase
        .from("typefaces")
        .select("*")
        .eq("featured", true)
        .order("name");
      if (error || !data || data.length === 0) throw new Error("no data");
      return data as Typeface[];
    },
    async () => {
      const all = await localGetTypefaces();
      return toTypefaces(all.filter((t) => t.featured));
    },
  );
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

export async function getPageContent(slug: string): Promise<PageContent> {
  return withSupabaseFallback(
    async () => {
      const supabase = await createClient();
      const { data, error } = await supabase
        .from("pages")
        .select("content")
        .eq("slug", slug)
        .single();
      if (error || !data) throw new Error("no data");
      return data.content as PageContent;
    },
    async () => {
      const page = await localGetPages();
      return page.find((p) => p.slug === slug)?.content ?? {};
    },
  );
}

/* eslint-disable @typescript-eslint/no-explicit-any */
type SettingsValue = Record<string, any>;

export async function getSettings(key: string): Promise<SettingsValue> {
  return withSupabaseFallback(
    async () => {
      const supabase = await createClient();
      const { data, error } = await supabase
        .from("settings")
        .select("value")
        .eq("key", key)
        .single();
      if (error || !data) throw new Error("no data");
      return data.value as SettingsValue;
    },
    async () => (await localGetSettings(key)) ?? {},
  );
}
