# Fitur: Pendaftaran Siswa & Opsional Registrasi Akun (Berbasis NISN)

Tolong update halaman Manajemen Siswa (/admin/students atau /dashboard) dengan fitur pendaftaran berikut:

1. **Update Form Tambah Siswa (UI):**
   - Field: NISN, Nama Lengkap, Kelas, Nama Wali, WhatsApp Ortu, Status (Dropdown).
   - Field **Password**: Jadikan OPSIONAL. Tambahkan teks pada label: `Password (opsional, hanya untuk membuat akun)`. 
   - Di bawah input password, tambahkan teks bantuan (info text): *"Apabila password diisi, maka sistem otomatis akan membuatkan akun login untuk siswa tersebut."*
   - Admin TIDAK perlu menginput email.

2. **Logika Server Action (Kondisional & Firebase Admin SDK):**
   Saat Admin klik "Simpan", cek apakah input Password diisi:
   - **JIKA PASSWORD DIISI:**
     1. Buat email dummy: `nisn + "@sditfajar.sch.id"`.
     2. Gunakan `adminAuth.createUser()` untuk membuat akun di Firebase Auth.
     3. Simpan data profil siswa ke Firestore (koleksi `students`), dan jadikan `uid` dari Auth tersebut sebagai ID Dokumennya (atau simpan di field `uid`).
   - **JIKA PASSWORD KOSONG:**
     1. JANGAN buat akun di Firebase Auth.
     2. Langsung simpan data profil siswa ke Firestore (koleksi `students`) menggunakan Auto-ID dari Firestore, dan kosongkan field `uid`.

3. **Keamanan & Validasi:**
   - Gunakan Firebase Admin SDK agar Admin tetap dalam kondisi login.
   - Pengecekan Duplikat: Sebelum proses simpan, pastikan NISN belum ada di Firestore. Jika sudah ada, hentikan proses dan tampilkan error: "NISN sudah digunakan".
   - Jika password diisi, pastikan minimal 6 karakter sesuai standar Firebase.

4. **Sinkronisasi Tabel:**
   - Gunakan `revalidatePath` atau `router.refresh()` di Next.js agar setelah data tersimpan, tabel daftar siswa di dashboard langsung memperbarui datanya secara otomatis.

   # Poin 5: Logika Login & Redirection (Pembetulan)

1. **Hidden Domain pada Login:**
   - Di halaman `/login`, ketika siswa menginput NISN (misal: 12345), sistem harus otomatis menggabungkannya menjadi `12345@sditfajar.sch.id` sebelum dikirim ke Firebase Auth.

2. **Redirect Berdasarkan Role:**
   - Setelah sukses login, cek `role` di Firestore:
     - Jika role == "admin" ➡️ Redirect ke `/admin`.
     - Jika role == "murid" ➡️ Redirect ke `/dashboard`.

3. **Akses Dashboard:**
   - Siswa yang dibuatkan akun (password diisi) otomatis bisa mengakses `/dashboard`.
   - Siswa yang TIDAK dibuatkan akun (password kosong) jika mencoba login akan muncul error "User tidak ditemukan".