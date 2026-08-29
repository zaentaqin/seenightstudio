-- ============================================================
-- SEE NIGHT STUDIO — Full Supabase Schema
-- ============================================================

-- TYPEFACES
CREATE TABLE IF NOT EXISTS typefaces (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug        text NOT NULL UNIQUE,
  name        text NOT NULL,
  designer    text NOT NULL,
  category    text NOT NULL CHECK (category IN ('display', 'sans', 'serif', 'mono', 'script')),
  styles      integer NOT NULL DEFAULT 1,
  price       integer NOT NULL DEFAULT 0,
  year        integer NOT NULL DEFAULT extract(year from now()),
  tagline     text NOT NULL DEFAULT '',
  description text NOT NULL DEFAULT '',
  tags        text[] DEFAULT '{}',
  featured    boolean DEFAULT false,
  created_at  timestamptz DEFAULT now(),
  updated_at  timestamptz DEFAULT now()
);

ALTER TABLE typefaces ENABLE ROW LEVEL SECURITY;
CREATE POLICY "typefaces_select_public" ON typefaces FOR SELECT USING (true);
CREATE POLICY "typefaces_insert_auth" ON typefaces FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "typefaces_update_auth" ON typefaces FOR UPDATE TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "typefaces_delete_auth" ON typefaces FOR DELETE TO authenticated USING (true);

-- PAGES
CREATE TABLE IF NOT EXISTS pages (
  id         uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug       text NOT NULL UNIQUE,
  content    jsonb NOT NULL DEFAULT '{}'::jsonb,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE pages ENABLE ROW LEVEL SECURITY;
CREATE POLICY "pages_select_public" ON pages FOR SELECT USING (true);
CREATE POLICY "pages_insert_auth" ON pages FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "pages_update_auth" ON pages FOR UPDATE TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "pages_delete_auth" ON pages FOR DELETE TO authenticated USING (true);

-- SETTINGS
CREATE TABLE IF NOT EXISTS settings (
  id         uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  key        text NOT NULL UNIQUE,
  value      jsonb NOT NULL DEFAULT '{}'::jsonb,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE settings ENABLE ROW LEVEL SECURITY;
CREATE POLICY "settings_select_public" ON settings FOR SELECT USING (true);
CREATE POLICY "settings_insert_auth" ON settings FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "settings_update_auth" ON settings FOR UPDATE TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "settings_delete_auth" ON settings FOR DELETE TO authenticated USING (true);

-- ============================================================
-- SEED DATA
-- ============================================================

INSERT INTO typefaces (slug, name, designer, category, styles, price, year, tagline, description, tags, featured)
VALUES
  ('nocturne-grotesk', 'Nocturne Grotesk', 'See Night Studio', 'sans', 18, 120, 2025, 'A workhorse sans for the dark hours.', 'Nocturne Grotesk is a nine-weight superfamily built for interfaces that never sleep.', ARRAY['variable', 'grotesk', 'ui', 'branding', 'editorial'], true),
  ('moonfat-display', 'Moonfat', 'Rara Adhista', 'display', 1, 60, 2026, 'Fat letters, zero apologies.', 'Moonfat is a single-style display monster drawn at maximum density.', ARRAY['poster', 'heavy', 'branding', 'headline'], true),
  ('insomnia-serif', 'Insomnia Serif', 'See Night Studio', 'serif', 2, 90, 2024, 'Editorial elegance with a restless pulse.', 'Insomnia Serif pairs razor-thin hairlines with wedge serifs.', ARRAY['editorial', 'magazine', 'elegant', 'high-contrast'], true),
  ('nightshift-mono', 'Nightshift Mono', 'Dimas Prayoga', 'mono', 8, 80, 2025, 'Code, captions, and cargo manifests.', 'Nightshift Mono treats monospace as a personality.', ARRAY['code', 'technical', 'ui', 'monospace'], false),
  ('vanta-script', 'Vanta Script', 'Rara Adhista', 'script', 4, 70, 2023, 'The darkest black, written by hand.', 'Vanta Script is a connected brush script with an attitude problem.', ARRAY['handwritten', 'logo', 'packaging', 'script'], true),
  ('afterhours-condensed', 'Afterhours Condensed', 'See Night Studio', 'display', 12, 110, 2024, 'Every poster is a tall order.', 'Afterhours Condensed squeezes six weights and two widths.', ARRAY['condensed', 'poster', 'variable', 'headline'], false),
  ('stargazer-slab', 'Stargazer Slab', 'Dimas Prayoga', 'serif', 18, 130, 2022, 'Heavy shoulders for heavy stories.', 'Stargazer Slab is a nine-weight slab serif.', ARRAY['variable', 'slab', 'robust', 'branding'], false),
  ('lucid-wide', 'Lucid Wide', 'See Night Studio', 'sans', 14, 140, 2026, 'Wide awake and taking up space.', 'Lucid Wide is an expanded geometric sans.', ARRAY['wide', 'geometric', 'variable', 'fashion', 'poster'], true);

INSERT INTO pages (slug, content)
VALUES
  ('home', '{
    "heroBar": ["Independent type foundry", "Est. 2019", "Jakarta — GMT+7", "Open for custom work"],
    "tagline": "Typefaces for brands that keep late hours. Drawn by hand, spaced with obsession, released when ready.",
    "services": [
      {"index": "01", "title": "Custom Typefaces", "desc": "Bespoke letterforms drawn for your brand alone."},
      {"index": "02", "title": "Retail Licensing", "desc": "Desktop, web, and app licenses with terms written for humans."},
      {"index": "03", "title": "Collaborations", "desc": "Lettering, wordmark refinements, and joint releases."}
    ],
    "manifestoTeaser": "We draw letters after dark — because the best curves never happen at noon."
  }'::jsonb),
  ('about', '{
    "manifesto": "We are a foundry for the dark hours — drawing letters with more personality than any layout can contain.",
    "values": [
      {"index": "01", "title": "Spacing is sacred", "desc": "We will delay a release by a month to fix a single kerning pair."},
      {"index": "02", "title": "Personality over neutrality", "desc": "Every family we ship must have at least one detail that makes a designer smirk."},
      {"index": "03", "title": "Drawn, then engineered", "desc": "Letter first, outlines second, OpenType features third."},
      {"index": "04", "title": "Open process", "desc": "Works in progress get published, rejected sketches stay visible."}
    ],
    "team": [
      {"initials": "SN", "name": "Sena Nakula", "role": "Founder · Type Design"},
      {"initials": "RA", "name": "Rara Adhista", "role": "Partner · Display & Script"},
      {"initials": "DP", "name": "Dimas Prayoga", "role": "Engineer · Variable & Tooling"}
    ],
    "clients": ["Midnight Records", "Kopiright Coffee", "Studio Larut", "Bulan Journal", "Nightshift FM", "Pasar Seni Digital"]
  }'::jsonb),
  ('contact', '{
    "channels": [
      {"label": "General & licensing", "value": "hello@seenight.studio"},
      {"label": "Custom projects", "value": "custom@seenight.studio"}
    ],
    "socials": [
      {"label": "Instagram", "value": "@seenightstudio"},
      {"label": "Behance", "value": "/seenightstudio"},
      {"label": "X / Twitter", "value": "@seenightco"}
    ],
    "address": "See Night Studio\nJl. Malam No. 13, Jakarta Selatan\nIndonesia 12730"
  }'::jsonb);

INSERT INTO settings ("key", value)
VALUES
  ('footer', '{
    "columns": [
      {"title": "Index", "links": [{"label": "Home", "href": "/"}, {"label": "All fonts", "href": "/fonts"}, {"label": "About", "href": "/about"}, {"label": "Contact", "href": "/contact"}]},
      {"title": "Elsewhere", "links": [{"label": "Instagram", "href": "https://instagram.com"}, {"label": "Behance", "href": "https://behance.net"}, {"label": "X / Twitter", "href": "https://x.com"}]},
      {"title": "Office", "links": [{"label": "hello@seenight.studio", "href": "mailto:hello@seenight.studio"}, {"label": "Jakarta, ID — GMT+7", "href": "/contact"}, {"label": "Always after dark", "href": "/contact"}]}
    ],
    "newsletter": "New typefaces, work in progress, and the occasional rant about spacing. No spam.",
    "copyright": "© 2026 See Night Studio",
    "notice": "Typefaces shown are placeholders",
    "location": "Set in the dead of night, Jakarta"
  }'::jsonb),
  ('nav', '{
    "links": [
      {"label": "Fonts", "href": "/fonts"},
      {"label": "About", "href": "/about"},
      {"label": "Contact", "href": "/contact"}
    ]
  }'::jsonb);
