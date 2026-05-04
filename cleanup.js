const fs = require('fs');
const path = require('path');

const oldDir = path.join(__dirname, 'src', 'app', 'dashboard-siswa');

if (fs.existsSync(oldDir)) {
  fs.rmSync(oldDir, { recursive: true, force: true });
  console.log('✅ Berhasil menghapus folder lama: src/app/dashboard-siswa');
} else {
  console.log('Folder src/app/dashboard-siswa sudah tidak ada.');
}
