# 🏫 Website & LMS SDIT Fajar

Website profil sekolah modern dan sistem manajemen pembelajaran (LMS) yang dibangun dengan performa tinggi, desain responsif, dan sistem manajemen data terintegrasi.

## 🚀 Teknologi Utama (Tech Stack)

Aplikasi ini menggunakan kombinasi teknologi modern untuk memastikan kecepatan dan kemudahan pengelolaan:

- **Frontend:** [Next.js 14+](https://nextjs.org/) (App Router) dengan **TypeScript**.
- **Styling:** [Tailwind CSS](https://tailwindcss.com/) untuk desain modern ala "Linear-style".
- **Backend/Database:** [Firebase](https://firebase.google.com/) (Firestore, Auth, & Storage).
- **Deployment:** [Vercel](https://vercel.com/) (Optimized for Next.js) untuk skalabilitas dan kemudahan setup.
- **Komponen UI:** Shadcn UI & Lucide React.

## ✨ Fitur Utama

### 1. Halaman Publik (Landing Page)
- **Desain Modern:** Animasi background kotak transparan dengan gaya Linear yang elegan.
- **Informasi Sekolah:** Profil, Visi & Misi, Sejarah, dan Program Akademik.
- **Berita & Pengumuman:** Update terbaru langsung dari dashboard admin.
- **Kontak Terintegrasi:** Form pesan yang terhubung langsung ke database admin.

### 2. Dashboard Admin (Secure Access)
- **Manajemen Siswa:** Fitur CRUD (Create, Read, Update, Delete) data siswa lengkap dengan status aktif/alumni.
- **Manajemen Pembayaran:** Pencatatan tagihan SPP dan Semester secara manual sesuai kebutuhan administrasi sekolah.
- **Input Absensi:** Pencatatan kehadiran siswa yang responsif dan mudah digunakan.
- **Manajemen Konten:** Kelola berita, pengumuman, dan pesan masuk dari wali murid di satu tempat.

### 3. Keamanan & Role-Based Access Control (RBAC)
- **Role System:** Pembedaan akses antara `Admin`, `Guru`, dan `Murid` via Firestore.
- **Middleware Security:** Proteksi rute halaman menggunakan Next.js Middleware dan Firebase Session Cookies.

## 📱 Responsivitas
Website telah dioptimalkan untuk berbagai perangkat:
- **Mobile & Tablet:** Tabel menggunakan `horizontal scroll` dan popup modal bersifat dinamis agar tampilan tetap rapi di layar kecil.
- **Desktop:** Layout sidebar yang efisien untuk produktivitas admin.

## 🛠️ Cara Instalasi Lokal

1. **Clone Repository:**
   ```bash
   git clone [https://github.com/username/sdit-fajar.git](https://github.com/username/sdit-fajar.git)
   cd sdit-fajar

2. **Install Dependensi:**

Bash
npm install


3. **Konfigurasi Environment Variable:**
Buat file .env.local di root folder dan masukkan kredensial Firebase Anda:

Cuplikan kode
NEXT_PUBLIC_FIREBASE_API_KEY=your_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_domain
... tambahkan key lainnya


4. **Jalankan Aplikasi:**

Bash
npm run dev
Buka http://localhost:3000 di browser Anda.

## 🌐 Deployment di Vercel
Proyek ini dirancang untuk berjalan optimal di platform Vercel:
Hubungkan GitHub: Sambungkan repositori GitHub Anda ke dashboard Vercel.
Setup Environment: Masukkan semua Environment Variables (API Key Firebase, dll) di menu settings Vercel.
Deploy: Klik tombol Deploy. Vercel akan secara otomatis mendeteksi konfigurasi Next.js, melakukan build, dan memberikan URL publik untuk website Anda.

Managed by SDIT Fajar IT Team.
