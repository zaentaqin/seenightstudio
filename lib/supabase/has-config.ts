let _available: boolean | null = null;

/**
 * Check if Supabase is configured AND has the required tables.
 * Caches the result for the lifetime of the server process.
 */
export async function hasSupabaseTables(): Promise<boolean> {
  if (_available !== null) return _available;

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
  if (!url || !key) {
    _available = false;
    return false;
  }

  try {
    // Use raw fetch to avoid Supabase client throwing
    const res = await fetch(
      `${url}/rest/v1/typefaces?select=id&limit=1`,
      {
        headers: {
          apikey: key,
          Authorization: `Bearer ${key}`,
        },
        // Short timeout so we don't block the page
        signal: AbortSignal.timeout(5000),
      },
    );
    _available = res.ok;
    return res.ok;
  } catch {
    _available = false;
    return false;
  }
}
