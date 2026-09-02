/**
 * Local JSON file store — used when Supabase is not configured.
 * Reads/writes to data/*.json files in the project root.
 */
import { readFile, writeFile } from "node:fs/promises";
import { join } from "node:path";

const DATA_DIR = join(process.cwd(), "data");

async function readJson<T>(filename: string): Promise<T[]> {
  try {
    const raw = await readFile(join(DATA_DIR, filename), "utf-8");
    return JSON.parse(raw) as T[];
  } catch {
    return [];
  }
}

async function writeJson<T>(filename: string, data: T[]): Promise<void> {
  await writeFile(join(DATA_DIR, filename), JSON.stringify(data, null, 2));
}

/* ── Typefaces ─────────────────────────────────────────── */

export type LocalTypeface = {
  id: string;
  slug: string;
  name: string;
  designer: string;
  category: string;
  styles: number;
  price: number;
  year: number;
  tagline: string;
  description: string;
  tags: string[];
  featured: boolean;
  font_path: string | null;
  weight_range: string | null;
  default_weight: number;
  has_italic: boolean;
  created_at: string;
  updated_at: string;
};

const TYPEFACES_FILE = "typefaces.json";

export async function localGetTypefaces(): Promise<LocalTypeface[]> {
  return readJson<LocalTypeface>(TYPEFACES_FILE);
}

export async function localGetTypefaceBySlug(
  slug: string,
): Promise<LocalTypeface | undefined> {
  const items = await localGetTypefaces();
  return items.find((t) => t.slug === slug);
}

export async function localCreateTypeface(
  typeface: Omit<LocalTypeface, "id" | "created_at" | "updated_at">,
): Promise<LocalTypeface> {
  const items = await localGetTypefaces();
  const now = new Date().toISOString();
  const newItem: LocalTypeface = {
    ...typeface,
    id: crypto.randomUUID(),
    created_at: now,
    updated_at: now,
  };
  items.push(newItem);
  await writeJson(TYPEFACES_FILE, items);
  return newItem;
}

export async function localUpdateTypeface(
  slug: string,
  updates: Partial<Omit<LocalTypeface, "id" | "slug" | "created_at">>,
): Promise<LocalTypeface | undefined> {
  const items = await localGetTypefaces();
  const idx = items.findIndex((t) => t.slug === slug);
  if (idx === -1) return undefined;
  items[idx] = {
    ...items[idx],
    ...updates,
    updated_at: new Date().toISOString(),
  };
  await writeJson(TYPEFACES_FILE, items);
  return items[idx];
}

export async function localDeleteTypeface(
  slug: string,
): Promise<boolean> {
  const items = await localGetTypefaces();
  const filtered = items.filter((t) => t.slug !== slug);
  if (filtered.length === items.length) return false;
  await writeJson(TYPEFACES_FILE, filtered);
  return true;
}

/* ── Pages ─────────────────────────────────────────────── */

export type LocalPage = {
  id: string;
  slug: string;
  content: Record<string, unknown>;
  created_at: string;
  updated_at: string;
};

const PAGES_FILE = "pages.json";

export async function localGetPages(): Promise<LocalPage[]> {
  return readJson<LocalPage>(PAGES_FILE);
}

export async function localGetPageBySlug(
  slug: string,
): Promise<LocalPage | undefined> {
  const items = await localGetPages();
  return items.find((p) => p.slug === slug);
}

export async function localUpdatePage(
  slug: string,
  content: Record<string, unknown>,
): Promise<LocalPage | undefined> {
  const items = await localGetPages();
  const idx = items.findIndex((p) => p.slug === slug);
  if (idx === -1) return undefined;
  items[idx] = {
    ...items[idx],
    content,
    updated_at: new Date().toISOString(),
  };
  await writeJson(PAGES_FILE, items);
  return items[idx];
}

/* ── Settings ──────────────────────────────────────────── */

export type LocalSetting = {
  id: string;
  key: string;
  value: Record<string, unknown>;
  created_at: string;
  updated_at: string;
};

const SETTINGS_FILE = "settings.json";

export async function localGetSettings(
  key: string,
): Promise<Record<string, unknown> | undefined> {
  const items = await readJson<LocalSetting>(SETTINGS_FILE);
  return items.find((s) => s.key === key)?.value;
}

export async function localUpdateSetting(
  key: string,
  value: Record<string, unknown>,
): Promise<void> {
  const items = await readJson<LocalSetting>(SETTINGS_FILE);
  const idx = items.findIndex((s) => s.key === key);
  const now = new Date().toISOString();
  if (idx === -1) {
    items.push({
      id: crypto.randomUUID(),
      key,
      value,
      created_at: now,
      updated_at: now,
    });
  } else {
    items[idx] = { ...items[idx], value, updated_at: now };
  }
  await writeJson(SETTINGS_FILE, items);
}
