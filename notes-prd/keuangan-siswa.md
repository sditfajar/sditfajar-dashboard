praktik UX (User Experience) yang sangat baik dan rapi:

/admin/keuangan/spp-bulanan: Fokus pada grafik dan checklist SPP (Rp 350.000).

/admin/keuangan/semester: Fokus pada grafik dan checklist Uang Semesteran (Rp 1.200.000).

/admin/keuangan/riwayat: Fokus pada log/history pembayaran.

3. Alur Logika Sistem (User Flow)
Pendaftaran Siswa: Admin menambahkan siswa baru di menu Manajemen Siswa.

Otomatisasi Tagihan: Saat data siswa berhasil disimpan ke koleksi siswa, sistem secara otomatis membuat dokumen di koleksi keuangan. Dokumen ini langsung berisi format tagihan bulanan (12 bulan x Rp 350.000) dan tagihan semesteran (2 semester x Rp 1.200.000) dengan status default Belum Lunas.

Proses Pembayaran: Orang tua melakukan transfer/tunai dan mengirim bukti ke admin.

Verifikasi Manual: Admin membuka sub-menu SPP Bulanan atau Tagihan Semester, mencari nama siswa, lalu melakukan checklist pada bulan/semester yang dibayar. Sistem mengupdate status menjadi Lunas beserta timestamp (waktu pembayaran).

Update Grafik & Riwayat: Begitu status berubah, grafik otomatis terupdate, dan data masuk ke halaman Riwayat.

4. Struktur Database (Firebase Firestore)
Koleksi: keuangan
Document ID: [UID_Siswa / NISN]

studentId: string

namaLengkap: string

kelas: string

tagihanBulanan: Array of Objects (12 item)

[{ bulan: "Juli", nominal: 350000, status: "Belum Lunas", tanggalBayar: null }, ...]

tagihanSemesteran: Array of Objects (2 item)

[{ semester: "Ganjil", nominal: 1200000, status: "Belum Lunas", tanggalBayar: null }, ...]

5. Kebutuhan UI & Tampilan per Sub-Menu
A. Halaman SPP Bulanan (/admin/keuangan/spp-bulanan)
Atas: Bar Chart (Recharts) menampilkan perbandingan pemasukan SPP dari bulan ke bulan. Serta Card Ringkasan: "Total Pemasukan SPP Bulan Ini".

Bawah: DataTable (Shadcn UI) dengan kolom Nama, Kelas, Status Bulan Berjalan, dan Aksi.

Aksi: Tombol "Kelola SPP" yang membuka Modal/Dialog berisi checklist 12 bulan.

B. Halaman Tagihan Semester (/admin/keuangan/semester)
Atas: Pie Chart (Recharts) menampilkan persentase siswa yang Lunas vs Belum Lunas untuk semester berjalan.

Bawah: DataTable siswa.

Aksi: Tombol "Kelola Semester" yang membuka Modal/Dialog berisi checklist Semester Ganjil & Genap.

C. Halaman Riwayat (/admin/keuangan/riwayat)
Hanya berisi DataTable yang menampilkan histori/log waktu saat admin melakukan checklist. Ini sangat penting untuk audit jika ada kesalahan.

Kolom Tabel: Tanggal Bayar, Nama Siswa, Jenis Tagihan (contoh: "SPP Agustus" / "Semester Ganjil"), Nominal, dan Kasir (Admin).

Berikut adalah perubahan dan penyesuaian yang telah saya masukkan ke dalam PRD di atas:
1. **Nominal Update**: Nilai SPP Bulanan sudah diubah menjadi **Rp 350.000**.
2. **Struktur Menu Sidebar**: Saya telah memasukkan **rekomendasi kuat untuk MENGGUNAKAN sub-menu yang sudah Anda buat** (`SPP Bulanan`, `Tagihan Semester`, `Riwayat`) daripada membuat menu baru. 
3. **Pemisahan UI**: Karena Anda menggunakan struktur 3 sub-menu tersebut, saya memecah fungsionalitasnya di dalam PRD agar lebih rapi:
   * Halaman SPP Bulanan khusus untuk Bar Chart SPP dan checklist bulanan.
   * Halaman Tagihan Semester khusus untuk Pie Chart dan checklist semesteran.
   * Halaman Riwayat khusus untuk tabel history/jejak pembayaran.