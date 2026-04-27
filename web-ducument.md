# Blue Print Pengembangan Web SDIT Fajar

## 🌐 1. HALAMAN BERANDA (PUBLIC VIEW)
Desain menggunakan **Linear Style** dengan tema terang dan aksen biru profesional.

### Hero Section
- **Konten:** Memuat teks profil sekolah yang persuasif.
- **Visual:** Background kotak-kotak transparan dengan animasi keren gaya Linear yang menggambarkan sekolah modern.
- **Tipografi:** Menggunakan font modern (Geist/Inter) yang cocok dengan gaya minimalis.

### Berita
- Info terbaru dari sekolah untuk pengunjung. Terintegrasi dengan Manajemen Konten di Dashboard.

### Profil Sekolah
- **Visi & Misi:** Penjabaran nilai-nilai sekolah.
- **Sejarah:** Latar belakang berdirinya sekolah.

### Program Akademik
- Informasi kurikulum pendidikan.
- Daftar dan deskripsi kegiatan ekstrakurikuler.

### Kontak & Lokasi
- Alamat lengkap sekolah.
- **Google Maps:** Integrasi peta lokasi.
- **Form Pesan:** Input pesan dari pengunjung yang otomatis masuk ke Dashboard Admin.

---

## 🖥️ 2. DASHBOARD ADMIN (SISTEM MANAJEMEN)
Sistem internal untuk mengelola seluruh data operasional sekolah.

### Dashboard (Ringkasan)
- Statistik jumlah siswa dan guru.
- Rekapitulasi pembayaran (SPP/Semester).

### Manajemen Siswa
- **Fitur:** Tambah, Lihat, Hapus, dan Edit data.
- **Status:** Fitur pemindahan status ke "Aktif", "Tidak Aktif", atau "Alumni".
- **Search Engine:** Pencarian data siswa berdasarkan Nama atau NISN.

### Manajemen Guru
- **Fitur:** Tambah, Lihat, dan Edit data.
- **Status:** Pemindahan status ke "Aktif", "Tidak Aktif", atau "Mantan Pengajar".
- **Search Engine:** Pencarian data guru yang efisien.

### Manajemen Alumni
- Input data alumni yang dirujuk dari data siswa.
- Tersedia search engine khusus halaman alumni.

### Manajemen Pembayaran
- **SPP & Semester:** Kelola pembayaran bulanan dan semester.
- **Otomasi:** Siswa baru otomatis masuk ke daftar tagihan dengan status "Belum Bayar".
- **Update Manual:** Admin dapat mengubah status menjadi "Lunas" secara manual.

### Manajemen Konten (CMS)
- Fitur CRUD (Create, Read, Update, Delete) untuk berita di halaman profil depan.

### Manajemen Akun
- Pengaturan profil admin, ganti password, dan fitur lupa password.

---

## 📚 3. FITUR LMS (E-LEARNING)
Sistem pembelajaran digital terintegrasi.

### Manajemen Kelas
- Pengaturan daftar kelas dan mata pelajaran.

### Sistem Absensi
- Terintegrasi dengan daftar "Siswa Aktif".
- Guru dapat menginput absen per mata pelajaran.
- Administrator dapat melihat dan mengunduh rekap absen secara keseluruhan.

---

## ⚙️ 4. INFRASTRUKTUR TEKNIS
Spesifikasi teknologi wajib yang digunakan.

### Tech Stack
- **Framework:** Next.js (Modern & Cepat).
- **Styling:** Tailwind CSS (Desain Modern & Responsif).
- **Database:** Cloud Firestore (Firebase).
- **Authentication:** Firebase Auth (Secure Login).
- **Storage:** Firebase Storage (Upload foto & galeri).
- **Hosting:** Vercel (Terintegrasi GitHub).

### Domain & Legalitas
- **Domain:** .sch.id (Contoh: www.sditfajar.sch.id).
- **Syarat:** KTP Kepala Sekolah dan SK Pendirian Sekolah.

---

## 👥 5. HAK AKSES (ROLE-BASED ACCESS CONTROL)
1. **Super Admin:** Akses 100% ke sistem, database, dan manajemen user.
2. **Admin (Kepala Sekolah/Operator):** Kelola data siswa, guru, keuangan, LMS, dan berita.
3. **Admin 2 (Guru):** Login khusus untuk mengelola absensi mata pelajaran di kelasnya masing-masing.