# Sidebar bercabang ke bawah dengan component shadcn:



pendaftaran->
    pendaftaran (PPDB)
    pembayaran

konten->
    berita
    



setting->
    user
    aplikasi

===================
# Buat Sidebar bercabang ke bawah dengan component shadcn:

dengan daftar menu:
Dashboard Admin
manajemen siswa->
    data siswa (isi dengan tabel data siswa)
    absensi siswa (isi dengan absensi)
    Pembayaran siswa (dari file pembayaran yang sudah ada)
    data siswa lainnya
manajemen Guru->
    data guru (isi dengan tabel data guru)
    absensi guru (isi dengan absensi)

Manajemen Konten->
    Konten (dengan halaman konten yang ada)
Manajemen PPDB->
    dengan tabel PPDB
Pesan Kontak ->
setting->
    

    catatan: yang belum ada halamannya ditransparan kan dulu font menunya agar tidak bisa di klik


   ## Responsive:
Tolong perbaiki responsivitas (responsive design) untuk tampilan Mobile (HP) dan Tablet portrait pada halaman berikut: 
AbsensiInput.tsx
, 
page.tsx
 (halaman konten dan Popup Tambah Konten baru),  halaman pesan 
page.tsx
 
SiswaFormDialog.tsx
popup dihp tidak lebar,  popup pada 
NewsSection.tsx
, Tabel 
ppdb
ppdb
, navbar pada halaman dashboard admin 
Navbar.tsx
 
Sidebar.tsx
 .

Aturan Wajib Tailwind yang harus diterapkan:

Mencegah Layar Melebar: Pastikan container utama menggunakan w-full overflow-x-hidden px-4 md:px-8. Jangan ada elemen dengan fixed width (seperti w-[500px]) yang merusak layout mobile.

Tabel yang Responsif: Bungkus semua tabel (di Absensi dan Pesan) dengan <div className="w-full overflow-x-auto">. Biarkan tabelnya yang bisa di-scroll ke samping, bukan layarnya.

Popup / Modal (Tambah Konten & Baca Pesan): Ubah lebar modal menjadi dinamis. Gunakan class w-[95%] max-w-lg md:max-w-2xl mx-auto p-4 md:p-6. Tambahkan max-h-[85vh] overflow-y-auto agar isi popup bisa di-scroll jika isinya terlalu panjang di layar HP.

Grid/Flexbox: Ubah elemen yang berjejer ke samping di desktop menjadi bertumpuk di mobile (gunakan flex-col md:flex-row atau grid-cols-1 md:grid-cols-2)."