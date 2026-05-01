# PRD: Modul Manajemen Konten & Integrasi News Section

**Tujuan:**
Membuat fitur manajemen konten/berita dinamis pada dashboard admin yang terintegrasi dengan database Firebase, dan datanya ditampilkan secara *real-time* di komponen frontend publik.

## 1. Database (Firebase Firestore)
Buat collection baru di Firestore bernama `konten_berita` dengan skema data berikut:
- `tanggal` (Date / String format tanggal)
- `judul` (String)
- `deskripsiSingkat` (String)
- `kontenLengkap` (Text / Textarea)
- `createdAt` (Timestamp)

## 2. Halaman Admin (`/dashboard/konten`)
- Buat halaman utama berisi tabel (Shadcn UI DataTable) untuk menampilkan daftar konten berita.
- Tambahkan tombol **"Tambah Konten"** dan animasi svg di dalam grid yang akan membuka form (menggunakan Shadcn UI Form & Zod).
- Form harus memiliki inputan:
  1. Tanggal Berita
  2. Judul Berita (Contoh placeholder: "Pendaftaran Gelombang 1 Dibuka")
  3. Deskripsi Singkat (Contoh placeholder: "Segera daftarkan putra-putri Anda...")
  4. Isi Berita Lengkap
- Ketika form di-submit, simpan data tersebut ke koleksi `konten_berita` di Firebase.

## 3. Komponen Frontend Publik (`components/Newssection.tsx`)
- Modifikasi komponen `Newssection.tsx` agar melakukan *fetch* data dari Firestore koleksi `konten_berita`.
- Tampilkan data tersebut dalam bentuk daftar atau grid (Card). Setiap Card harus menampilkan: `tanggal`, `judul`, dan `deskripsiSingkat`.
- Tambahkan tombol/link **"Baca selengkapnya"** di bagian bawah setiap Card.

## 4. UI/UX "Baca Selengkapnya" (Full-page Pop-up)
- Saat user mengklik tombol "Baca selengkapnya", tampilkan isi `kontenLengkap` menggunakan **Full-page Pop-up**.
- Gunakan komponen Shadcn UI **Dialog** (atur class width dan height agar memenuhi layar / `max-w-[100vw] h-screen`) atau gunakan komponen **Sheet** (posisi `bottom` atau `right` ukuran penuh) sebagai pop-up pembaca beritanya.
- Berikan tombol "Tutup (X)" yang jelas pada pop-up tersebut.