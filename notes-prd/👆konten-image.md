Tolong buatkan fitur upload gambar menggunakan Firebase Storage untuk halaman penambahan/edit Berita di Dashboard Admin, dengan instruksi berikut:

1. Setup Firebase Storage:
Buka file konfigurasi Firebase (misalnya @firebase.ts atau @src/lib/firebase.ts). Tambahkan inisialisasi getStorage dari firebase/storage dan export instance storage tersebut agar bisa digunakan.

2. Integrasi ke Form Berita (Admin):
Pada file komponen/halaman form penambahan berita (tolong temukan atau buatkan file yang relevan di dalam folder (admin)), tambahkan elemen <input type="file" accept="image/*" />.

3. Alur Upload & Simpan Database:
Buat logika handling submit dengan urutan berikut:

Validasi ukuran file (maksimal 2MB).

Tampilkan UI loading state (misal: tombol disable dengan teks "Mengunggah...") agar user tahu proses sedang berjalan.

Upload file gambar tersebut ke Firebase Storage di dalam folder referensi news-images/.

Ambil downloadURL dari gambar yang berhasil di-upload.

Simpan downloadURL tersebut bersama field teks berita lainnya (judul, konten, dll) ke dalam dokumen Firestore.

4. UI Tambahan:
Tambahkan fitur Image Preview. Jadi ketika admin selesai memilih gambar dari perangkatnya, tampilkan thumbnail/preview gambar tersebut di atas atau di bawah tombol input sebelum form di-submit.