# PRD Frontend & Backend SDIT Fajar (Updated)

## 1. Informasi Umum
Dokumen ini berisi spesifikasi untuk pengembangan website SDIT Fajar, mencakup Landing Page publik dan Dashboard Admin/LMS yang terintegrasi dengan Firebase.

## 2. Tech Stack & Arsitektur
- **Framework:** Next.js (App Router).
- **Styling:** Tailwind CSS & Shadcn UI.
- **Database & Auth:** Firebase (Firestore, Auth, Storage).
- **Deployment:** Vercel.

## 3. Struktur Folder App (Admin & Public)
Untuk menjaga kebersihan kode, folder admin wajib diletakkan di dalam `app/` menggunakan fitur **Route Groups** agar memiliki layout yang berbeda dari halaman publik.

### Pengaturan Folder (admin)
- Buat folder baru bernama `app/(admin)`. Penggunaan tanda kurung `()` memastikan kata "admin" tidak muncul di URL, namun memungkinkan penggunaan layout khusus.
- **Admin Layout:** Di dalam `app/(admin)/layout.tsx`, buatlah layout yang menyertakan **Sidebar** dan **Navbar Admin**. Ini akan membedakan tampilan dashboard dari tampilan landing page publik.
- **Rute Dashboard:** Halaman utama admin diletakkan di `app/(admin)/dashboard/page.tsx`.
- **Rute Fitur:** Setiap fitur memiliki folder sendiri, contoh: `app/(admin)/siswa/`, `app/(admin)/guru/`, dan `app/(admin)/pembayaran/`.

## 4. Keamanan Folder Admin (Middleware)
- Seluruh rute di dalam folder `(admin)` harus dilindungi menggunakan **Next.js Middleware**.
- Sistem akan mengecek status login dari **Firebase Auth**. Jika pengguna belum login atau bukan admin, maka otomatis diarahkan kembali ke halaman `/login`.

## 5. Struktur Halaman Beranda (Publik)
- **Hero Section:** Animasi grid kotak-kotak transparan (Linear style).
- **Berita:** Card grid 3 kolom responsif.
- **Profil:** Visi, Misi, dan Sejarah.
- **Program:** Info Kurikulum & Ekskul.
- **Kontak:** Integrasi Google Maps dan Form Pesan ke Firebase.

## 6. Fitur Dashboard Admin
- **Manajemen Siswa:** CRUD data, status (Aktif/Alumni), dan search engine.
- **Manajemen Guru:** CRUD data dan status pengajar.
- **Manajemen Pembayaran:** Input otomatis siswa aktif, nominal default (SPP 300rb, Semester 1jt), dan fitur edit status bayar.
- **Manajemen Konten:** Editor untuk berita dan pengumuman di web publik.

## 7. Responsivitas
- **Mobile First:** Layout harus menyesuaikan otomatis dari HP hingga Desktop.
- **Sidebar:** Pada perangkat mobile, sidebar admin harus berubah menjadi Drawer/Hamburger menu.