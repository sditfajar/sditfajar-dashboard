# PRD: Modul Manajemen Siswa & Otomatisasi - SDIT Fajar

## 1. Ringkasan Proyek
- **Nama Fitur:** Manajemen Data Siswa & Otomatisasi Pembayaran
- **Teknologi:** Next.js 14, Tailwind CSS, Firebase Firestore
- **Tujuan:** Mengelola database siswa secara real-time dan mengotomatiskan pembuatan tagihan keuangan.

## 2. Spesifikasi Data (Firestore Schema)
Data disimpan dalam koleksi `siswa`. Skema field wajib:

| Field | Tipe Data | Deskripsi |
| :--- | :--- | :--- |
| **`nisn`** | String | ID Unik Siswa (Primary Key). |
| **`namaLengkap`** | String | Nama lengkap siswa. |
| **`kelas`** | String | Rombongan belajar (1-6). |
| **`namaWali`** | String | Nama orang tua / wali. |
| **`whatsappOrtu`** | String | Nomor WA aktif untuk koordinasi. |
| **`status`** | String | Enum: "Aktif", "Tidak Aktif", "Alumni". |
| **`createdAt`** | Timestamp | Waktu input data. |

## 3. Fitur Utama & Logika CRUD

### A. Antarmuka Tabel (DataTable)
- Menggunakan **Shadcn UI DataTable** dengan fitur pencarian (Search) berdasarkan Nama atau NISN.
- Indikator Status: Badge Hijau (Aktif), Badge Kuning (Alumni), Badge Merah (Tidak Aktif).
- Tombol Aksi: Edit data dan Hapus data dengan konfirmasi Dialog.

### B. Otomatisasi Sistem (Penting)
Sistem harus menjalankan logika otomatis berikut untuk menghindari input ganda:

1. **Otomatisasi Pembayaran (Trigger Create):**
   Saat Admin menambah siswa baru dengan status **"Aktif"**, sistem harus otomatis membuat satu dokumen baru di koleksi tabel `pembayaran` dengan data:
   - `studentId`: (NISN siswa)
   - `studentName`: (Nama siswa)
   - `sppNominal`: 300000 (Default)
   - `semesterNominal`: 1000000 (Default)
   - `statusBayar`: "Belum Lunas"

2. **Otomatisasi Alumni (Trigger Update):**
   Jika Admin mengubah status siswa menjadi **"Alumni"**, data tersebut harus secara otomatis muncul di halaman `/alumni` (karena halaman tersebut memfilter koleksi `students` berdasarkan status).

3. **tidak aktif (tidak muncul di tabel pembayaran)**
   Jika Admin mengubah status siswa menjadi **"Tidak Aktif"**, data siswa tersebut tidak boleh muncul di halaman `/pembayaran` (karena halaman tersebut memfilter koleksi `students` berdasarkan status).

## 4. Alur Kerja Integrasi Firebase
1. **Create:** Gunakan `setDoc` dengan ID dokumen = `nisn`.
2. **Read:** Gunakan `onSnapshot` untuk tampilan tabel real-time tanpa refresh.
3. **Update:** Gunakan `updateDoc` untuk perubahan data atau status.
4. **Delete:** Gunakan `deleteDoc` untuk menghapus data siswa (opsional: hapus juga data pembayaran terkait).

## 5. Aturan UI/UX
- Menampilkan **Loading Skeleton** saat data sedang diambil dari Firestore.
- Modal Form yang bersih dengan validasi input (NISN tidak boleh kosong).
- Desain responsif (Mobile friendly) khas gaya **Linear**.