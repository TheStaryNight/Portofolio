# Steven Changcherta — Portfolio

Portfolio personal mahasiswa Computer Science dengan spesialisasi Artificial Intelligence di BINUS University, menampilkan proyek computer vision, machine learning, pengembangan software, dan UI/UX. Target role: **AI Engineer** atau **Software Engineer**, untuk internship berdurasi **satu tahun**.

Tema **deep sea** membawa pengunjung dari cahaya permukaan menuju laut yang semakin gelap. Struktur awal terinspirasi dari [Adrian Murphy Portfolio Template oleh WebDev For You](https://webflow.com/made-in-webflow/website/webdev-for-you-adrian-murphy-template), dengan implementasi, konten, dan interaksi yang disesuaikan.

## Teknologi

- **Astro 7** untuk menghasilkan website statis.
- **TypeScript** untuk data proyek dan interaksi browser.
- **CSS dan SVG** untuk layout responsif dan animasi.
- **Native HTML dialog** untuk popup proyek dan galeri.
- **DM Sans dan Manrope** dari Google Fonts, dengan font sistem sebagai fallback.

Tidak membutuhkan database, backend, atau environment variable untuk versi saat ini. Versi dependency dikunci melalui `package-lock.json`.

## Fitur

- Hero dengan karakter penyelam pixel interaktif, logo SC bergelombang, partikel, cahaya yang membesar lalu memudar, dan pencahayaan yang mengikuti pointer.
- Warna halaman bertransisi dari teal menuju navy gelap.
- Navigasi kedalaman **Surface → Exploration → Deep dive → The horizon**, indikator bagian aktif, dan progress scroll.
- Selected Work dengan kontur dasar laut, partikel, serta kumpulan cahaya bergerak.
- Gambar proyek masuk bergantian dari kiri dan kanan saat di-scroll.
- Animasi per proyek: pemindaian gambar, tracing landmark tangan, chart, dan bentuk bermain. Semua merupakan dekorasi, bukan inferensi model atau data langsung.
- Popup proyek dengan peran, highlight, teknologi, kontribusi, tantangan, hasil, dan screenshot.
- Galeri dengan tombol sebelumnya/berikutnya, tombol panah keyboard, serta `Escape` untuk menutup.
- Pendidikan, leadership, kontak email, dan unduhan CV.
- Layout desktop/mobile, skip link, focus indicator, **Pause motion**, dan dukungan `prefers-reduced-motion`.
- Pemilihan teks biasa dinonaktifkan untuk mengurangi penyalinan kasual; email tetap selectable. Ini **bukan proteksi penuh**: konten publik masih dapat disalin melalui source, screenshot, dan browser tools.

## Pixel diver

Karakter pada hero menjawab enam pertanyaan preset melalui speech bubble dengan animasi mengetik. Pengunjung dapat melewati animasi, memilih pertanyaan lain, membuka popup proyek, mengakses kontak/CV, atau memulai ulang. Ini bukan chatbot AI: tidak ada API, model, mikrofon, audio, atau riwayat percakapan yang disimpan.

- Edit pertanyaan, jawaban, dan tautan di `src/data/diver.ts`.
- Karakter SVG dan markup chat berada di `src/components/PixelDiver.astro`.
- Logika typing, skip, reset, dan reduced motion berada di `src/scripts/diver.ts`.
- Styling berada di `src/styles/diver.css`.
- Tanpa JavaScript, pengunjung tetap dapat membaca intro dan seluruh portfolio; panel chat menampilkan penjelasan singkat.

## Menjalankan secara lokal

Prasyarat: **Node.js 22.12.0 atau lebih baru** dan **npm 9.6.5 atau lebih baru**.

Jalankan dari root repository, yaitu folder yang berisi `package.json`:

```sh
npm ci
npm run dev
```

Buka alamat yang ditampilkan terminal, biasanya [http://127.0.0.1:4321](http://127.0.0.1:4321). Gunakan `npm install` saat mengubah dependency dan sertakan perubahan lockfile.

| Perintah | Fungsi |
| --- | --- |
| `npm run dev` | Server development |
| `npm run check` | Pemeriksaan tipe dan diagnostik Astro |
| `npm run build` | Menghasilkan website statis ke `dist/` |
| `npm run preview -- --port 4322` | Preview hasil build pada port 4322 |

Untuk memeriksa production build:

```sh
npm run check
npm run build
npm run preview -- --port 4322
```

Buka [http://127.0.0.1:4322](http://127.0.0.1:4322). Preview membaca `dist/`; setelah mengubah source, build ulang dan refresh browser.

Jika Astro menjalankan server di background, hentikan dengan:

```sh
npx astro dev stop
npx astro preview stop
```

## Struktur repository

```text
src/
  components/
    PixelDiver.astro       # Karakter pixel dan panel pertanyaan preset
    ProjectMotion.astro    # Animasi dekoratif per proyek
    WorkBackdrop.astro     # Kontur, partikel, dan cahaya Selected Work
  data/
    diver.ts               # Pertanyaan, jawaban, dan tautan pixel diver
    projects.ts            # Konten, highlight, teknologi, link, dan galeri
  pages/
    index.astro            # Halaman utama, metadata, navigasi, dan popup
  scripts/
    diver.ts               # Animasi mengetik, skip, reset, reduced motion
    interactions.ts        # Motion, scroll reveal, depth navigation, dialog
  styles/
    diver.css              # Layout hero dan styling pixel diver
    global.css             # Layout dasar, responsivitas, interaksi umum
    descent.css            # Kedalaman laut, monogram, dan efek proyek
public/
  images/                  # Screenshot, portrait, dan monogram
  favicon.svg
  Steven-Changcherta-CV.pdf
assets/
  source/                  # Salinan aset sumber awal
astro.config.mjs
package.json
package-lock.json
tsconfig.json
```

`node_modules/`, `dist/`, `.astro/`, `.vercel/`, dan file environment lokal diabaikan oleh Git.

## Mengubah konten

### Proyek

Edit `src/data/projects.ts`:

- Identitas: `id`, `number`, `name`, `title`, `category`, `date`.
- Isi: `description`, `role`, `contribution`, `challenge`, `outcome`.
- Highlight: `metric`, `metricLabel`, `metricNote`.
- Teknologi dan tautan: `tags`, `link`, `linkLabel`.
- Gambar: `image`, `alt`, `gallery`; nama file merujuk ke `public/images/`.

Gunakan `id` unik. Untuk animasi proyek baru, tambahkan variasi di `ProjectMotion.astro` dan styling di `descent.css`.

| Proyek | Periode | Fokus |
| --- | --- | --- |
| Fruit Ripeness Classification | September–Desember 2025 | PyTorch, ResNet18, Streamlit |
| Gesture Controlled Mouse | Februari–Juni 2026 | MediaPipe, klasifikasi gesture, interaksi real-time |
| CatatStock | Februari–Juni 2026 | UI/UX dan frontend React untuk inventory dashboard |
| PlayNest | 2024 | User research dan prototyping Figma |

Angka hasil proyek berasal dari portfolio/CV yang diberikan, bukan benchmark yang diverifikasi independen. Pertahankan konteks evaluasi saat mengubah highlight.

### Profil dan aset

- Bio, pendidikan, leadership, metadata, dan kontak: `src/pages/index.astro`.
- Email website: **steven.changcherta@binus.ac.id**. Link `mailto:` membuka aplikasi email pengunjung; tidak mengirim melalui server.
- Perkiraan kelulusan: **2028**. Tanggal ketersediaan internship belum ditampilkan.
- Foto asli tetap disimpan di `public/images/portrait.png`; hero sekarang menggunakan karakter SVG pixel diver.
- Logo: `public/images/sc-ocean-logo.png`, monogram SC berwarna mint dengan motif arus laut, dibuat menggunakan image generation. Favicon memakai desain yang sama.
- CV: `public/Steven-Changcherta-CV.pdf`. PDF masih dokumen asli; perubahan teks atau email website **tidak otomatis mengubah isi PDF**.
- Aset yang disajikan ke browser berada di `public/images/`. Mengubah `assets/source/` saja tidak mengubah website.

### Desain dan animasi

Edit layout dasar di `global.css`, dan tema kedalaman serta Selected Work di `descent.css`. Pertahankan kontrol Pause motion, preferensi reduced motion, navigasi keyboard, dan layout mobile ketika menambah animasi. Interaksi pointer hanya aktif pada perangkat dengan pointer presisi.

## Pemeriksaan sebelum publish

```sh
npm run check
npm run build
```

Periksa desktop dan mobile: navigasi section, popup, galeri, penutupan dengan `Escape`, Pause motion, email, dan unduhan CV. Pastikan konten tetap terbaca tanpa overflow horizontal.

## Deployment ke Vercel

Website menghasilkan output statis:

1. Import repository GitHub ke Vercel.
2. Pilih preset **Astro**.
3. Root directory harus menunjuk ke folder yang berisi `package.json`.
4. Build command: `npm run build`.
5. Output directory: `dist`.
6. Gunakan versi Node.js yang kompatibel dengan requirement di atas.

Adapter server tidak diperlukan untuk konfigurasi statis ini. Tambahkan domain dan metadata URL produksi setelah alamat deployment ditentukan.

## Kredit

- Referensi struktur: [Adrian Murphy Portfolio Template — WebDev For You](https://webflow.com/made-in-webflow/website/webdev-for-you-adrian-murphy-template).
- Konten proyek, screenshot, portrait, logo personal, dan CV disediakan oleh Steven Changcherta.
- Animasi laut dan elemen dekoratif dibuat dengan CSS/SVG di repository ini.

## Live demos

Tiga proyek memiliki tombol **Try live demo** pada kartu dan popup: Fruit Classification, Gesture Mouse, dan CatatStock. Semua berjalan di browser dan ikut deployment portfolio. PlayNest tidak diubah. CatatStock menggunakan data contoh yang dapat direset; forecasting AI belum terhubung. Detail build, model, dan batasan ada di [demos/README.md](demos/README.md).
