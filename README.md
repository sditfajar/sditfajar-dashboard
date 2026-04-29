# 🏫 Website & LMS SDIT Fajar

Sistem manajemen pembelajaran (LMS) dan website profil sekolah modern yang dirancang untuk performa tinggi, keamanan ketat, dan pengelolaan data terintegrasi.

---

## 🚀 Teknologi Utama (Tech Stack)

Aplikasi ini dibangun menggunakan kombinasi teknologi *bleeding-edge*:

* **Frontend:** [Next.js 14+](https://nextjs.org/) (App Router) & **TypeScript**.
* **Styling:** [Tailwind CSS](https://tailwindcss.com/) (Linear-style Design).
* **Backend/Database:** [Firebase](https://firebase.google.com/) (Firestore, Auth, & Storage).
* **Deployment:** [Vercel](https://vercel.com/) (Optimized for Next.js).
* **Komponen UI:** Shadcn UI & Lucide React.

---

## ✨ Fitur Utama

### 1. Landing Page (Public)
* **Modern UI:** Animasi background transparan bergaya elegan.
* **Informasi Lengkap:** Profil, Visi & Misi, dan Program Akademik.
* **Berita & Kontak:** Update pengumuman dan form pesan langsung ke dashboard admin.

### 2. Dashboard Admin (Secure)
* **Manajemen Siswa:** Fitur CRUD (Create, Read, Update, Delete) lengkap.
* **Sistem Pembayaran:** Pencatatan tagihan SPP dan Semester secara manual.
* **Absensi Digital:** Input kehadiran siswa yang responsif.
* **Content Management:** Kelola seluruh konten website di satu tempat.

### 3. Keamanan & Akses (RBAC)
* **Role-Based Access:** Pembedaan akses antara `Admin`, `Guru`, dan `Murid`.
* **Middleware Protection:** Proteksi rute menggunakan Next.js Middleware dan Firebase Session Cookies.

---

## 🛠️ Instalasi Lokal

1.  **Clone Repository:**
    ```bash
    git clone [https://github.com/username/sdit-fajar.git](https://github.com/username/sdit-fajar.git)
    cd sdit-fajar
    ```

2.  **Install Dependensi:**
    ```bash
    npm install
    ```

3.  **Konfigurasi Environment:**
    Buat file `.env.local` dan masukkan kredensial Firebase:
    ```env
    NEXT_PUBLIC_FIREBASE_API_KEY=your_key
    NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_domain
    # ... dst
    ```

4.  **Jalankan Aplikasi:**
    ```bash
    npm run dev
    ```

---

## 🌐 Deployment

Proyek ini siap di-deploy ke **Vercel**:
1. Hubungkan repositori GitHub ke Vercel.
2. Masukkan *Environment Variables* di settings Vercel.
3. Klik **Deploy**. Selesai.

---
**Managed by SDIT Fajar IT Team.**
