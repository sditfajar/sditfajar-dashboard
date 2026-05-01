# PRD: Manajemen Data Guru & Staff (LMS SDIT Fajar)

## 1. Ringkasan Proyek
Fitur ini bertujuan untuk mengelola data pendidik dan tenaga kependidikan di SDIT Fajar. Selain penyimpanan data, sistem harus mengotomatisasi pembuatan akun akses (Firebase Auth) dengan role "teacher" agar mereka bisa login ke dashboard guru.

## 2. Struktur Data (Firestore - Collection: `teachers`)

| Field | Tipe Data | Keterangan |
| :--- | :--- | :--- |
| `name` | String | Nama Lengkap & Gelar |
| `nip` | String | NIP / NUPTK |
| `photoURL` | String | URL Foto Profil (Firebase Storage) |
| `gender` | String | L / P |
| `position` | String | Guru, Staff, Karyawan, Security |
| `classTeacher`| String | Wali Kelas (misal: 1A, 2B, atau "-") |
| `subject` | String | Mata Pelajaran (khusus guru bidang studi) |
| `phone` | String | Nomor WhatsApp |
| `email` | String | Username login |
| `status` | String | Aktif / Cuti / Pensiun |
| `role` | String | Hardcoded "teacher" |

## 3. Antarmuka Pengguna (UI)

### A. Halaman Utama (DataTable)
* **Pencarian:** Input text untuk filter berdasarkan Nama.
* **Filter Posisi:** Dropdown (Semua, Guru, Staff, Karyawan, Security). Default: Semua.
* **Tabel:**
  * Kolom 1: No (Index)
  * Kolom 2: Nama
  * Kolom 3: L/P
  * Kolom 4: Posisi
  * Kolom 5: Status Guru: Aktif / Cuti / Pensiun. (Penting agar admin bisa mencabut akses login jika guru sudah tidak aktif).
  * Kolom 6: Aksi (Icon Mata untuk Detail, Titik 3 untuk Edit/Hapus)

### B. Popup Detail (Modal)
Muncul saat icon mata diklik. Menampilkan seluruh data guru termasuk foto profil, NIP, kontak, dan **Password** (menggunakan fitur toggle icon mata untuk melihat).

### C. Form Tambah/Edit
Input field sesuai struktur data. Khusus saat "Tambah Guru", sistem harus meminta input **Password** (untuk pembuatan akun Auth).

## 4. Logika Sistem & Keamanan
1. **Automated Auth:** Saat admin klik "Simpan" pada data guru baru, sistem menjalankan fungsi Firebase `createUserWithEmailAndPassword`.
2. **Role Mapping:** Secara otomatis menambahkan field `role: "teacher"` pada dokumen Firestore pengguna tersebut.
3. **Soft Delete / Akses:** Menghapus data guru juga harus menonaktifkan akses login mereka di Firebase Auth.

## 5. Panduan Teknis Role Teacher
Untuk implementasi role, pastikan middleware mengecek field `role` di Firestore setelah user login. Jika `role === "teacher"`, arahkan ke `/dashboard-guru`.

---

## 6. Pembuatan Halaman Dashboard Guru (Task Tambahan)
Tolong buatkan halaman rute dasar untuk guru yang baru login:
* **URL/Link:** `/dashboard-guru` (Sesuaikan dengan struktur App Router, misalnya `app/(guru)/dashboard-guru/page.tsx`).
* **Konten:** Halaman kosong (placeholder) dengan judul "Dashboard Guru" dan ucapan selamat datang.
* **Styling (Wajib):** Desain interface harus konsisten dengan halaman admin sebelumnya. Gunakan **Tailwind CSS** untuk layouting dan **Shadcn UI** (seperti `Card`, `Sidebar` jika ada, atau komponen Typography) agar tampilan tetap rapi, modern, dan profesional.

