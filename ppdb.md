Implementasi Modul PPDB SDIT Fajar

**Tugas Utama:**
Tolong lakukan pembaruan pada sistem dashboard admin SDIT Fajar dengan mengganti menu yang ada yaitu menu manajemen alumni gar dihapus dan di gantikan Menu PPDB (Penerimaan Peserta Didik Baru), dan membuat alur pendaftaran PPDB (Penerimaan Peserta Didik Baru) yang terintegrasi mulai dari form klien (frontend) hingga masuk ke tabel admin (menu PPDB).

## 1. Pembaruan Menu Navigasi (Sidebar Admin)
- **Hapus** menu "Manajemen Alumni" dari daftar navigasi sidebar dashboard admin.
- **Tambahkan** menu baru bernama "PPDB" di sidebar admin.
- Arahkan rute (path) menu baru ini ke `/dashboard/ppdb` (atau sesuai standar routing halaman admin).

## 2. Pembuatan Komponen Form (`components/FormPendaftaran.tsx`)
Buatkan komponen `FormPendaftaran.tsx` di dalam folder `components`. Gunakan kombinasi Shadcn UI (Form, Input, Textarea, Radio Group, Select, Popover Calendar/Date Picker, Button) dan Tailwind CSS. Desain wajib responsif (mobile-friendly). Implementasikan validasi form menggunakan `react-hook-form` dan `zod`.

**Struktur Form & Validasi:**
Nama Lengkap Siswa: Wajib (Harus persis sesuai dengan yang tertera di Akta Kelahiran / KK).
Tempat Lahir: Wajib.
Tanggal Lahir: Wajib (Sangat penting untuk memvalidasi syarat usia masuk SD, biasanya minimal 6 tahun pada bulan Juli tahun ajaran berjalan).
Jenis Kelamin: Wajib (Kebutuhan pelaporan Dapodik).
Alamat Lengkap: Wajib.
Nama Orang Tua: Wajib (Sebaiknya dipisah antara Nama Ayah Kandung dan Nama Ibu Kandung sesuai KK).
No WA Orangtua Aktif: Wajib (Untuk komunikasi, grup kelas, dan informasi kelulusan PPDB).

Dokument (maksimal 2mb, format: .pdf, .jpg, .jpeg, .png):
Dokumen Kartu Keluarga (KK): Wajib diunggah/diinput.
Dokumen Akta Kelahiran: Wajib diunggah/diinput.

**Tombol Submit:**
- Teks tombol: "Kirim Pendaftaran"
- Wajib memiliki *loading state* (disable tombol & ganti teks menjadi "Mengirim..." atau ikon spinner) saat data sedang diproses ke database.
- buat desain popup (tanda selesai dikumpulkan) sesuai tema

## 3. Integrasi Database & Halaman Admin PPDB
- **Logika Penyimpanan:** Saat tombol "Kirim Pendaftaran" diklik dan validasi lolos, simpan data tersebut ke Firebase Firestore di dalam collection `ppdb_siswa`. Tambahkan secara otomatis *timestamp* pendaftaran (`createdAt`) dan default status (misalnya `status: "Baru"`).
- **Halaman Tampil Admin:** Buatkan atau sesuaikan halaman `/dashboard/ppdb` (Halaman Admin PPDB).
- **Tabel Data (DataTable):** Di halaman admin PPDB tersebut, tampilkan data pendaftar yang diambil dari Firebase Firestore menggunakan tabel responsif (Shadcn UI Table). Kolom yang ditampilkan di tabel minimal: Nama Lengkap, Jenis Kelamin, No WA Ortu, Tanggal Daftar, dan Aksi (Lihat Detail).

## 4. Aturan UI/UX
- **Grid Layout:** Untuk form, gunakan layout 1 kolom penuh di layar HP (Mobile), dan 2 kolom (Grid) berdampingan di layar yang lebih besar (Desktop/Tablet) agar terlihat rapi dan tidak terlalu panjang ke bawah.
- Berikan notifikasi sukses/gagal (*Toast Notification*) setelah proses "Kirim Pendaftaran" selesai.