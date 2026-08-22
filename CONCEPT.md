# SEE NIGHT STUDIO — Website Concept v0.1

> Company profile × independent type foundry. Static-first build untuk validasi
> konsep visual sebelum masuk implementasi expert (e-commerce, CMS).

## 1. Positioning

Bukan corporate website yang kebetulan jualan font — tapi **katalog specimen
yang berfungsi ganda sebagai company profile**. Identitas studio diceritakan
lewat bahasa visual type foundry: tipografi raksasa, grid tegas, indeks angka,
font sebagai produk pahlawan.

Tone: *serious about type, playful about everything else.*

Referensi: OH no Type Co (marquee nama+harga, kegilaan typographic), Dinamo /
Grilli Type (brutalist editorial, hitam-putih, hairline grid), Nicky Laatz /
SilverStag (struktur katalog & kategori).

## 2. Goals / Non-Goals

**Fase 1 (ini):**

- Konsep visual solid & konsisten di semua halaman
- Konten Inggris, data dummy terstruktur rapi (mudah diganti)
- Live type tester client-side tanpa backend
- Deployable static

**Fase 2 (nanti):**

- Checkout & payment, akun user
- CMS untuk katalog font
- File font asli + delivery lisensi
- Blog/journal konten nyata, i18n

## 3. Design System — "Brutalist Editorial"

### Warna

| Token     | Nilai                  | Fungsi                              |
| --------- | ---------------------- | ----------------------------------- |
| `--ink`   | `#111111`              | teks utama, blok invert             |
| `--paper` | `#F2EFE9`              | background dasar                    |
| `--accent`| `#FF3D00`              | hover, badge harga, CTA — dipakai hemat |
| `--line`  | `rgba(17,17,17,.18)`   | hairline grid 1px                   |

### Tipografi

- Display: oversized, clamp sampai ~20vw, boleh overlap gambar / keluar grid.
- Mono/label: uppercase, letter-spacing lebar, ukuran mikro (indeks `01/`,
  breadcrumb, meta info).
- Body: netral, kontras ukuran ekstrem dengan display.
- Placeholder via `next/font/google` — tiap produk font dipetakan ke satu
  Google Font berkarakter (Anton, Instrument Serif, Bricolage Grotesque,
  Unbounded, Space Grotesk, JetBrains Mono, dst).

### Grid & Layout

- 12 kolom, garis hairline terlihat antar-section (border collapse).
- Nomor indeks + micro-label di tiap section.
- Row katalog full-width, invert penuh saat hover.
- Marquee strip CSS-only untuk ticker nama font + harga (ala Ohno).

### Motion

CSS-only: marquee loop, hover invert / weight-shift (variable font), transisi
150–250ms ease-out. Tanpa library animasi agar mudah di-port ke fase 2.

## 4. Sitemap & Spesifikasi Halaman

### `/` Home

1. Hero: wordmark SEE NIGHT raksasa + tagline satu kalimat.
2. Ticker marquee: `FONTNAME — $XX` bergantian.
3. Featured Typefaces: grid specimen card (tiap kartu preview dalam fontnya).
4. Manifesto teaser: statement besar → link ke `/about`.
5. Services: Custom Type, Licensing, Collaboration (baris indeks).
6. Footer wordmark besar.

### `/fonts` Katalog

Indeks rapat gaya tabel: tiap baris = nomor, nama, preview live dalam font itu,
jumlah style, kategori, harga. Filter kategori statis (anchor). Hover = invert.

### `/fonts/[slug]` Detail

1. Specimen hero full-bleed dalam font produk.
2. **Live type tester** (client component): edit teks, slider ukuran, toggle
   align & weight.
3. Daftar style/weight, grid glyph sample.
4. Tier lisensi Desktop / Web / App (visual saja) + CTA ke contact.
5. Prev/next typeface.

### `/about` Company Profile

Manifesto editorial: statement besar, nilai studio, tim, daftar klien &
layanan — tanpa bahasa korporat.

### `/contact`

Email besar-besar sebagai objek desain, info studio, sosial, form statis
(mailto).

## 5. Data Model (`lib/fonts.ts`)

```ts
type Typeface = {
  slug: string;
  name: string;
  designer: string;
  category: "display" | "sans" | "serif" | "mono" | "script";
  styles: number;
  price: number;        // USD, starting price
  year: number;
  description: string;
  tags: string[];       // e.g. ["variable", "editorial", "branding"]
  googleFontKey: string; // pemetaan ke next/font/google
  featured?: boolean;
};
```

±8–10 dummy typefaces. Struktur sengaja mendekati skema produk agar swap ke
CMS/API di fase 2 hanya mengganti sumber data. Filtering di katalog pakai
`tags`, `category`, dan pencarian `name`/`designer`/`tagline` via URL
(`?q=&cat=&tag=`).

## 6. Teknis

- Next.js 16 App Router + Tailwind CSS 4 + lucide-react.
- Server components default; hanya type tester yang client component.
- Font self-hosted via `next/font/google`, tanpa request eksternal runtime.
- Verifikasi: `npm run lint && npm run build`.
- Catatan: versi Next ini punya breaking changes — selalu cek
  `node_modules/next/dist/docs/` sebelum pakai API tertentu.

## 7. Roadmap Fase 2 (garis besar)

1. Ganti dataset dummy → CMS/DB; mapping Google Font → file font asli (WOFF2).
2. Keranjang + checkout (Stripe/LemonSqueezy) & delivery lisensi otomatis.
3. EULA/licensing engine per tier, akun user & download center.
4. Journal/blog konten nyata, i18n ID/EN.
5. Naikkan motion ke level expert (GSAP/WebGL) bila konsep visual sudah fix.
