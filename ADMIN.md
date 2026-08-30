# Admin Dashboard

## Akses

URL: `/admin/login`

- Password: `admin123` (default, bisa di-override via env `ADMIN_PASSWORD`)

Tidak ada email — cukup masukkan password lalu klik Login.

## Arsitektur Autentikasi

Menggunakan **cookie-based session** sederhana (bukan Supabase Auth):

1. Login → server action `login()` cek password → set cookie `admin_session` (httpOnly, 7 hari)
2. Middleware cek cookie di semua request `/admin/*` — redirect ke `/admin/login` jika tidak ada session
3. Logout → hapus cookie → redirect ke login

**File terkait:**
- `app/admin/actions/auth.ts` — server action `login()` + `logout()`
- `app/admin/actions/is-admin.ts` — helper `isAdmin()` untuk cek session di layout
- `middleware.ts` — proteksi route `/admin/*` + set header `x-pathname`

## Halaman Admin

### `/admin` — Dashboard
Ringkasan jumlah typefaces, pages, dan settings di Supabase.

### `/admin/typefaces` — List Semua Typeface
- Lihat semua typefaces (dari Supabase atau fallback ke hardcoded data)
- Klik "+" untuk tambah baru
- Klik item untuk edit atau hapus

### `/admin/typefields/new` — Tambah Typeface
Form fields:
- `slug` — URL identifier (unique, lowercase, no spaces)
- `name` — Display name
- `designer` — Nama desainer/foundry
- `category` — Dropdown: sans, serif, display, mono, script
- `styles` — Jumlah style variants (integer)
- `price` — Harga dalam USD (integer)
- `year` — Tahun rilis
- `tagline` — Singkat, satu baris
- `description` — Deskripsi panjang
- `tags` — Comma-separated tags
- `featured` — Checkbox, tampil di homepage
- `fontFile` — Upload file font asli (`.otf`, `.ttf`, `.woff`, `.woff2`), maks 10MB

### `/admin/typefaces/[slug]` — Edit Typeface
Sama seperti form tambah, tapi slug tidak bisa diubah. Ada:
- Input file untuk **mengganti** font (hapus file lama, upload baru)
- Checkbox **"Remove file"** untuk menghapus font dari storage
- Tombol Delete di bawah

## Upload Font & Live Preview

Admin bisa upload file font asli per typeface. File disimpan di **Supabase Storage** (bucket `font-files`, public). Kolom `font_path` di tabel `typefaces` menyimpan path object.

Halaman font publik (`/fonts/<slug>`) memakai file asli itu untuk **live preview**:
- **TypeTester** (`01 / Try it live`) — mengetik langsung dengan font asli via FontFace API
- **GlyphTester** (`05 / Glyphs`) — grid glyph pakai font asli
- **Hero specimen** + grid styles + prev/next — pakai font asli (selama sudah ke-load)

Jika belum ada file di-upload (atau file gagal load), semua tampilan **fallback ke placeholder** Google Font. Indikator di footer TypeTester menampilkan "real font file" vs "placeholder".

Catatan:
- Font didaftarkan dengan family `"SN <slug>"` dan weight range 100–900 → **variable font** merespons slider weight; OTF statis tetap satu weight.
- File wajib `.otf/.ttf/.woff/.woff2` dan ≤10MB (limit `serverActions.bodySizeLimit` di `next.config.ts`).
- Hapus typeface = objek storage ikut terhapus.

## Supabase Database

### `/admin/pages` — List Pages
Menampilkan slug dan waktu update terakhir.

### `/admin/pages/[slug]` — Edit Page Content
Textarea untuk edit JSON content. Struktur JSON per page:

**home:**
```json
{
  "heroBar": ["String array", "untuk ticker"],
  "tagline": "Tagline utama",
  "services": [{"index": "01", "title": "...", "desc": "..."}],
  "manifestoTeaser": "Teaser singkat"
}
```

**about:**
```json
{
  "manifesto": "...",
  "values": [{"index": "01", "title": "...", "desc": "..."}],
  "team": [{"initials": "SN", "name": "...", "role": "..."}],
  "clients": ["Client 1", "Client 2"]
}
```

**contact:**
```json
{
  "channels": [{"label": "...", "value": "..."}],
  "socials": [{"label": "...", "value": "..."}],
  "address": "Alamat newline-separated"
}
```

### `/admin/settings` — Edit Settings
JSON editor untuk site-wide settings. Keys yang tersedia:

**footer:**
```json
{
  "columns": [{"title": "...", "links": [{"label": "...", "href": "..."}]}],
  "newsletter": "...",
  "copyright": "...",
  "notice": "...",
  "location": "..."
}
```

**nav:**
```json
{
  "links": [{"label": "...", "href": "..."}]
}
```

## Supabase Database

Project: `broztftclcbnuuycdxxq` (ap-southeast-1)

### Tables

| Table | PK | Unique | Purpose |
|-------|-----|--------|---------|
| `typefaces` | uuid | slug | Data typeface/font (`font_path` untuk file) |
| `pages` | uuid | slug | CMS content per page |
| `settings` | uuid | key | Key-value site config |

### Storage

| Bucket | Public | Isi |
|--------|--------|-----|
| `font-files` | yes | File font asli tiap typeface |

URL publik file: `https://<ref>.supabase.co/storage/v1/object/public/font-files/<path>`

### RLS Policies
- **Tables** — public read; insert/update/delete untuk anon + authenticated (dibuka agar admin cookie-auth bisa menulis via anon key)
- **Storage `font-files`** — public read + upload terbuka (anon/authenticated)

### Environment Variables

```
NEXT_PUBLIC_SUPABASE_URL=https://broztftclcbnuuycdxxq.supabase.co
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=sb_publishable_GM8JXYGwYI3yF643R2mnuA_-2tBNTo5
ADMIN_PASSWORD=admin123  (optional, default: admin123)
```

### Fallback
Jika Supabase tidak available, website tetap jalan menggunakan hardcoded data dari `lib/typefaces.ts` dan `lib/data.ts`.

### Seed SQL
File: `supabase/seed.sql` — CREATE TABLE (+ `font_path`), seed data, RLS, dan setup bucket storage `font-files`. Idempotent (DROP POLICY IF EXISTS + ON CONFLICT), aman di-run ulang.
File: `supabase/create-admin.sql` — SQL untuk buat admin user di Supabase Auth (tidak dipakai, auth sekarang cookie-based).

## Sidebar Navigation

- Dashboard — `/admin`
- Typeface — `/admin/typefaces`
- Pages — `/admin/pages`
- Settings — `/admin/settings`
- View site — buka `/` di tab baru
- Logout — hapus session cookie

## Catatan Teknis

- Admin layout terpisah dari main site (tidak ada Nav/Footer main site)
- Header `x-pathname` di-set oleh middleware untuk membedakan admin vs public routes
- Cookie `admin_session` bersifat httpOnly + secure (production) + sameSite lax
- Session berlaku 7 hari
