# PRD: Sistem Absensi Siswa Terintegrasi - SDIT Fajar

## 1. Ringkasan Fitur
Sistem absensi otomatis yang menarik data dari koleksi `siswa` berstatus "Aktif". Guru menginput absen harian, dan sistem menyediakan rekapitulasi data untuk laporan bulanan Kepala Sekolah.

## 2. Kebutuhan Fungsional (User Stories)
* **Guru:** Dapat melihat daftar siswa aktif per kelas secara otomatis.
* **Guru:** Dapat menandai status kehadiran (Hadir, Sakit, Izin, Alpa) per tanggal tertentu.
* **Kepala Sekolah:** Dapat memfilter data berdasarkan rentang tanggal untuk melihat rekapitulasi kehadiran bulanan seluruh siswa.

## 3. Spesifikasi UI/UX (Linear Style)
* **Layout:** Konsisten dengan antarmuka data siswa (Shadcn UI DataTable).
* **Top Bar Filter:**
    - **DatePicker:** Untuk memilih tanggal absensi.
    - **Default:** Hari ini (Today).
    - **Logika Weekend:** Jika hari Sabtu atau Minggu dipilih, tabel menampilkan pesan: "Hari Libur - Tidak ada jadwal absensi".
* **Struktur Tabel:**
    - **Grouping:** Baris tabel dikelompokkan berdasarkan **Kelas**.
    - **Header Grup:** Menampilkan judul "Kelas 1", "Kelas 2", dst.
* **Kolom Tabel:**
    1. **NISN:** ID Unik siswa.
    2. **Nama Siswa:** Nama lengkap sesuai database.
    3. **Kelas:** Sesuai kelas pada daftar siswa.
    4. **Status Kehadiran:** Opsi Radio Group (Hadir, Sakit, Izin, Alpa).

## 4. Logika Database & Backend (Firebase)
* **Sumber Data:** Query koleksi `siswa` di mana `status == "Aktif"`.
* **Penyimpanan:** Koleksi `absensi`.
* **Skema Dokumen Absensi:**
    - `attendanceId`: `{nisn}_{YYYY-MM-DD}` (Pencegahan duplikasi absen di hari yang sama).
    - `studentId`: Reference ke NISN.
    - `nama`: String.
    - `kelas`: String.
    - `status`: String (H / S / I / A).
    - `date`: Timestamp.
    - `monthYear`: `MM-YYYY` (Field pendukung untuk rekapitulasi bulanan).

## 5. Fitur Rekapitulasi (Laporan)
* **Tab Laporan:** Tab khusus untuk Kepala Sekolah.
* **Fitur:** Menghitung total akumulasi Hadir, Sakit, Izin, dan Alpa per siswa dalam satu bulan.
* **Output:** Ringkasan visual yang mudah dibaca.

---

# Instruksi Khusus untuk Antigravity Agent Manager

Silakan gunakan prompt di bawah ini untuk memulai proses coding:

**Prompt:**
"Tolong implementasikan fitur Absensi berdasarkan **prd-absensi.md**. 

**Detail Teknis:**
1. Gunakan komponen **Shadcn UI Table** dan **DatePicker**.
2. Filter data dari Firestore hanya untuk siswa yang memiliki `status: "Aktif"`.
3. Gunakan fitur grouping pada tabel berdasarkan field `kelas` dengan Header 'Kelas {nama_kelas}'.
4. Gunakan **RadioGroup** untuk kolom kehadiran: Hadir (H), Sakit (S), Izin (I), Alpa (A).
5. Simpan data ke koleksi `absensi` menggunakan ID Dokumen: `{nisn}_{tanggal}`.
6. Buat halaman atau tab 'Laporan' untuk rekap bulanan yang menghitung total H/S/I/A per siswa berdasarkan filter bulan/tahun."