# PRD Frontend Website SDIT Fajar

## 1. Informasi Umum
Dokumen ini berisi spesifikasi kebutuhan produk (PRD) untuk pengembangan antarmuka (frontend) halaman utama (Beranda) website SDIT Fajar. Website ini dirancang sebagai Landing Page informatif satu halaman yang berfokus pada kecepatan, estetika modern, dan kemudahan akses informasi bagi calon wali murid dan pengunjung.

## 2. Tech Stack
Pengembangan website akan menggunakan teknologi Next.js (App Router) untuk kerangka kerja React yang optimal dan cepat.
Untuk kebutuhan penataan gaya (styling) dan tata letak, digunakan Tailwind CSS agar proses pengembangan lebih efisien dan konsisten.

## 3. Tipografi dan Desain
Tema website adalah Terang (Light Mode) dengan mengadaptasi gaya desain "Linear-style" yang minimalis, bersih, dan modern.
Warna aksen utama yang digunakan adalah Biru terang untuk memberikan kesan profesional namun tetap ramah pendidikan.
Jenis huruf (font) menggunakan Inter atau Geist (Google Fonts) yang sangat cocok dan menyatu dengan gaya desain Linear.
Elemen desain mencakup sudut membulat yang halus, bayangan lembut, serta penyertaan logo dan favicon sekolah yang sesuai.

## 4. Struktur Halaman Beranda

### Hero Section
Bagian paling atas yang memuat teks profil singkat dan menarik tentang SDIT Fajar.
Terdapat animasi latar belakang (background) berupa grid atau kotak-kotak transparan bergaris (Linear style) yang bergerak perlahan, memberikan kesan modern, terstruktur, dan merepresentasikan lingkungan sekolah yang dinamis.
Terdapat tombol panggilan aksi (CTA) utama.

### Berita dan Informasi Terkini
Bagian yang menampilkan daftar informasi, pengumuman, atau berita terbaru dari sekolah.
Ditampilkan dalam bentuk kartu (cards) dengan gaya Linear yang berisi judul berita, tanggal, dan cuplikan teks singkat untuk pengunjung website.

### Profil: Visi, Misi, dan Sejarah
Bagian informatif yang menjabarkan identitas inti sekolah.
Memuat paragraf narasi mengenai sejarah berdirinya SDIT Fajar.
Menampilkan daftar Visi dan Misi sekolah yang disusun rapi dan mudah dibaca dengan ikon-ikon minimalis pendukung.

### Program Akademik
Bagian yang memberikan informasi mengenai kegiatan belajar mengajar di sekolah.
Memuat deskripsi singkat mengenai kurikulum yang digunakan.
Menampilkan daftar kegiatan ekstrakurikuler yang tersedia untuk mengembangkan bakat siswa.

### Kontak dan Lokasi
Bagian interaktif di bagian bawah halaman untuk memudahkan pengunjung menghubungi sekolah.
Menampilkan alamat lengkap sekolah berserta detail kontak (telepon/email).
Menyediakan form pesan (input: Nama, Email/WA, Pesan) yang secara fungsional akan diintegrasikan dengan sistem dashboard admin.
Menyematkan (embed) peta interaktif dari Google Maps agar lokasi sekolah mudah ditemukan.

## 5. Responsivitas dan Kompatibilitas Layar (Responsive Design)
Wajib menggunakan pendekatan tata letak yang memprioritaskan ponsel (Mobile-First Design) agar antarmuka tetap rapi di semua perangkat (HP, Tablet, dan Desktop).
Memaksimalkan kelas utilitas responsif dari Tailwind CSS (`sm:`, `md:`, `lg:`, `xl:`) pada setiap komponen.
Navigasi (Navbar) harus berubah menjadi ikon menu (Hamburger Menu) ketika diakses melalui layar kecil.
Struktur konten berbasis kolom (seperti bagian Berita dan Program) harus secara otomatis menyusut menjadi 1 kolom pada layar HP, 2 kolom pada Tablet, dan berjajar rapi pada layar Desktop.
Ukuran teks (font-size) dan jarak antar elemen (padding/margin) harus dinamis untuk mencegah teks tumpang tindih atau keluar dari batas layar.