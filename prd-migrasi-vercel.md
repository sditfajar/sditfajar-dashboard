# Product Requirements Document (PRD): Migrasi Hosting ke Vercel
**Proyek:** Sistem Informasi & Dashboard Admin SDIT Fajar
**Dokumen:** PRD Migrasi Infrastruktur
**Status:** Siap Dieksekusi

---

## 1. Ringkasan Eksekutif
Dokumen ini menguraikan persyaratan dan langkah-langkah untuk melakukan migrasi *hosting* (frontend) dari infrastruktur sebelumnya (Firebase Hosting / Cloudflare) ke **Vercel**. Mengingat sistem dibangun menggunakan framework **Next.js**, Vercel adalah platform *deployment* yang paling optimal. Sistem akan menggunakan pendekatan *Hybrid*, di mana **Vercel** menangani antarmuka pengguna (UI) dan *hosting*, sementara **Firebase** tetap dipertahankan sebagai layanan *Backend* (Database, Authentication, dan Storage).

## 2. Tujuan Migrasi
1. **Performa Next.js Optimal:** Memanfaatkan fitur *Server-Side Rendering* (SSR), *Image Optimization*, dan *API Routes* secara optimal tanpa konfigurasi manual.
2. **Otomatisasi Deployment:** Membangun alur CI/CD (*Continuous Integration / Continuous Deployment*) otomatis melalui GitHub.
3. **Kemudahan Manajemen:** Mengurangi kompleksitas konfigurasi DNS dan *SSL certificate* (Vercel menyediakan HTTPS gratis dan otomatis).

## 3. Arsitektur Sistem Baru
* **Frontend & Hosting:** Vercel (Terkoneksi langsung dengan GitHub).
* **Database:** Firebase Firestore (Tetap, tidak ada migrasi data).
* **Manajemen File (Gambar/Dokumen):** Firebase Storage (Tetap).
* **Keamanan Akun:** Firebase Authentication (Tetap).
* **Domain Management:** Vercel DNS Configuration.

## 4. Persyaratan Pra-Migrasi (Pre-requisites)
* Kode sumber aplikasi Next.js sudah di-*push* ke repository **GitHub** secara utuh.
* Tidak ada *error* fatal yang menyebabkan proses `npm run build` gagal (seperti *Type Error* pada TypeScript atau *ESLint Error*).
* Memiliki akses ke panel manajemen domain sekolah (misal: Rumahweb, Niagahoster, dll).
* Memiliki daftar lengkap konfigurasi API Key Firebase (biasanya berada di file `.env.local`).

## 5. Langkah-Langkah Eksekusi (Action Plan)

### Fase 1: Persiapan Kode (Melalui Antigravity Agent)
Berikan perintah (prompt) berikut kepada Agent:
> "Tolong siapkan project Next.js ini agar siap di-deploy (hosting) ke **Vercel**. Kita **tetap menggunakan Firebase** (Firestore, Storage, dan Authentication) sebagai database dan backend. Pastikan tidak ada error saat `npm run build`. Pastikan Environment Variables untuk kredensial Firebase menggunakan awalan `NEXT_PUBLIC_`. Tambahkan konfigurasi `next.config.js` untuk optimasi gambar domain Firebase jika diperlukan."

### Fase 2: Deployment ke Vercel
1.  Login ke [Vercel](https://vercel.com/) menggunakan akun GitHub.
2.  Klik **Add New Project** dan pilih repository GitHub SDIT Fajar.
3.  Di bagian **Environment Variables**, masukkan semua kunci rahasia Firebase:
    * `NEXT_PUBLIC_FIREBASE_API_KEY`
    * `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN`
    * `NEXT_PUBLIC_FIREBASE_PROJECT_ID`
    * `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET`
    * `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID`
    * `NEXT_PUBLIC_FIREBASE_APP_ID`
4.  Klik **Deploy** dan tunggu proses *build* selesai.

### Fase 3: Pengaturan Domain Resmi
1.  Masuk ke menu **Settings > Domains** di dashboard Vercel project Anda.
2.  Tambahkan nama domain sekolah (contoh: `sditfajar.sch.id`) dan versi `www`.
3.  Buka panel **DNS Management** di penyedia domain Anda dan tambahkan *record* berikut:
    * **A Record**: Host `@` (atau kosong) arahkan ke IP `76.76.21.21`
    * **CNAME Record**: Host `www` arahkan ke `cname.vercel-dns.com`

### Fase 4: Konfigurasi Keamanan Firebase (SANGAT PENTING)
Agar fitur *login* admin tetap bisa digunakan di domain baru:
1.  Buka **Firebase Console** > **Authentication** > **Settings** > **Authorized domains**.
2.  Klik **Add domain**.
3.  Masukkan nama domain resmi yang baru saja disambungkan ke Vercel (contoh: `sditfajar.sch.id`).
4.  Simpan konfigurasi.

## 6. Skenario Rollback (Mitigasi Risiko)
Jika terjadi kegagalan atau website *down* selama proses propagasi DNS (yang bisa memakan waktu hingga 24 jam), ubah kembali DNS Record di penyedia domain Anda ke pengaturan IP lama (Firebase Hosting/Cloudflare) sampai masalah di Vercel terselesaikan.