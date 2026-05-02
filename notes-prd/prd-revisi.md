# Instruksi Pembaruan Fitur dan UI SDIT Fajar

Tolong implementasikan 5 pembaruan fitur dan UI pada proyek website SDIT Fajar berikut ini. Kerjakan secara bertahap dan pastikan tidak ada error pada tampilan maupun koneksi Firestore:

## 1. Batasi Tampilan PWA Install Prompt
- Buka file tempat komponen `@installprompt.tsx` dipanggil (biasanya di `layout.tsx` utama atau `Navbar`).
- Gunakan `usePathname` dari `next/navigation`. 
- Buat logika: **Hanya render/tampilkan** komponen ini jika *pathname* mengandung `/admin` atau `/guru`. Pastikan komponen ini **tidak muncul** di halaman beranda (`/`).
- dan jadikan style pop-up install nya berwarna hijau

## 2. Tambah Fitur Print di Jadwal Mengajar (Admin)
- Buka halaman Jadwal Mengajar di rute Admin.
- Tambahkan tombol "Print Jadwal" (gunakan UI Button yang sudah ada).
- Berikan *event handler* `onClick={() => window.print()}`.
- Wajib tambahkan class tailwind `print:hidden` pada tombol tersebut agar tombolnya tidak ikut tercetak di kertas.

## 3. Navigasi Cepat ke Section Berita
- Buka komponen `@newssection.tsx`, tambahkan atribut `id="berita"` pada *container* atau tag HTML paling luarnya.
- Buka halaman **Manajemen Konten Admin**, tambahkan tombol baru bernama "Lihat Berita" di bagian atas tabel/form.
- Gunakan komponen `<Link href="/#berita">` agar saat admin mengkliknya, web langsung membuka tab baru/halaman beranda dan *scroll* otomatis ke bagian berita.

## 4. Statistik Konten Real-time di Dashboard Admin
- Buka halaman utama Dashboard Admin.
- Tambahkan satu atau beberapa "Card Statistic" baru (seperti yang sudah ada untuk data siswa/guru).
- Buat query (fetch) ke Firestore untuk menghitung total dokumen pada koleksi `news` atau konten, lalu tampilkan angkanya secara dinamis.

## 5. Slicing UI (Penyesuaian Skema Warna Biru & Hijau di Beranda)
Tolong ubah *styling* (Tailwind) pada halaman beranda untuk memberikan aksen **Hijau** (`green-500` / `green-600` / `green-100`) pada bagian spesifik berikut, dan pastikan tetap harmonis dengan warna utama **Biru**:
- **Hero Section:** Ubah elemen "Penerimaan Siswa Baru Dibuka" menjadi tema hijau (misal *background* hijau muda dengan teks hijau tua).
- **News Section:** Ubah teks/badge judul "Update Terbaru" menjadi warna hijau.
- **Program Unggulan:** Berikan aksen hijau pada ikon, *bullet points*, atau *card border* pada list: Morning Activity, Shalat Dhuha, Dzikir Pagi, Muroja'ah Yaumiyah, Jum'at Bersih.
- **Keunggulan Kami:** Sesuaikan elemen visualnya dengan nuansa hijau yang serasi dengan biru.
- **Global:** Lakukan penyesuaian kecerahan/kontras warna agar perpaduan biru dan hijaunya terlihat *fresh*, modern, ramah anak, dan tidak mencolok mata.

- input login kombinasikan warna hijau