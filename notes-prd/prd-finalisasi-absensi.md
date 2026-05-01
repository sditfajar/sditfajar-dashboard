# Product Requirements Document (PRD): Finalisasi & Optimasi Sistem SDIT Fajar

**Proyek:** Sistem Informasi Sekolah & Dashboard Admin SDIT Fajar  
**Dokumen:** PRD Finalisasi Fitur & Optimasi UI  
**Status:** Draft Final (Siap Implementasi)

---

## 1. Pendahuluan
Dokumen ini merinci penambahan fitur, perbaikan responsivitas mobile, dan optimasi manajemen data untuk sistem SDIT Fajar. Fokus utama adalah pada kemudahan akses bagi wali murid (cek absensi), kenyamanan guru saat input data di HP, serta efisiensi admin dalam mengelola data siswa.

---

## 2. Fitur Baru: Cek Kehadiran Wali Murid (Akses Publik)
Wali murid membutuhkan cara cepat untuk memantau kehadiran anak tanpa perlu login ke sistem utama.

### A. Alamat Halaman
- **Halaman Input:** `/absensi-siswa` (Komponen baru di `/components`).
- **Halaman Hasil:** `/absensi-siswa/result` (atau menggunakan state dinamis).

### B. Alur Kerja
1.  Wali murid masuk ke halaman `/absensi-siswa`.
2.  Menampilkan form sederhana berisi satu input field: **Masukkan NISN**.
3.  Setelah klik "Cek Absensi", sistem melakukan query ke Firebase berdasarkan NISN tersebut.
4.  Jika NISN ditemukan, arahkan ke tabel hasil cek absensi.

### C. Spesifikasi Tabel Hasil
- **Judul Atas:** Menampilkan [NISN] dan [Nama Lengkap Siswa].
- **Header Tabel:**
  - No
  - Hari
  - Tanggal (Format: `DD-MM-YYYY`)
  - Keterangan (Hadir, Izin, Sakit, Alpa)
- **Sinkronisasi Data:** Mengambil data dari koleksi `absensi` yang terhubung dengan `studentId` atau `NISN`.
- **UI:** Harus **Responsive Mobile Device** (Tabel dapat di-scroll atau diubah menjadi kartu pada layar kecil).

---

## 3. Optimasi UI: Input Harian Absensi (Mobile First)
Memastikan guru dapat melakukan absen dengan cepat saat berada di dalam kelas hanya menggunakan ponsel.

### A. Tata Letak (Layout) Mobile
- **Tombol Submit:** Pindahkan tombol "Submit Absen" ke posisi paling bawah (di bawah tabel/list) agar tidak menghalangi pandangan saat mengisi.
- **Input Status Absen:**
  - Menggunakan komponen **Dropdown/Select**.
  - **Nilai Default:** "Hadir".
  - Opsi lain: Izin, Sakit, Alpa.
  - **Tujuan:** Agar lebar tabel tidak melebihi lebar layar HP (menghindari scroll horizontal yang berlebihan).

### B. Filter Kelas Dinamis
- Menambahkan dropdown **Filter Kelas** di atas tabel input harian.
- **Logika Default:** 1. Menampilkan "Kelas 1" secara default saat pertama kali dibuka.
  2. Menggunakan *state* atau *LocalStorage* untuk mengingat input kelas terakhir yang dipilih oleh guru tersebut (User Persistence).

---

## 4. Fitur Rekap & Ekspor Data
Mempermudah pelaporan bulanan kepada kepala sekolah atau yayasan.

- **Menu:** `@rekap bulanan`.
- **Fitur Baru:** Tombol **Export Excel**.
- **Output:** Menghasilkan file `.xlsx` yang berisi rekap kehadiran seluruh siswa berdasarkan bulan dan kelas yang dipilih.

---

## 5. Manajemen Data Siswa: Fitur Import
Mempercepat proses input data di awal tahun ajaran baru.

- **Menu:** Halaman Manajemen Siswa.
- **Fitur Baru:** Tombol **Import Data Siswa**.
- **Logika:**
  - Mendukung file format `.csv` atau `.xlsx`.
  - Sistem akan melakukan validasi NISN (menghindari duplikasi) sebelum menyimpan ke Firestore.

---

## 6. Peningkatan Pengalaman Pengguna (UX)
Memberikan kesan sistem yang profesional dan modern.

- **Animasi Loading:**
  - Implementasi animasi **SVG Loading** (Lottie atau CSS SVG Animation).
  - Muncul setiap kali sistem melakukan pengambilan data (fetching), login, atau proses upload data ke Vercel/Firebase.

---

## 7. Ringkasan Teknis (Technical Summary)
- **Framework:** Next.js (App Router).
- **Backend:** Firebase Firestore (Real-time update menggunakan `onSnapshot`).
- **Styling:** Tailwind CSS & Shadcn UI.
- **Hosting:** Vercel.
- **Excel Library:** `xlsx` atau `exceljs`.

---

**Selesai.** Dokumen ini siap diberikan kepada Coding Agent untuk mulai proses pengerjaan kode.