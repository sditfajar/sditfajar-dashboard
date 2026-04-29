/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [{
      protocol: "https",
      hostname: "images.unsplash.com",
    },
    {
      protocol: "https",
      hostname: "drive.google.com", // Untuk link dari Google Drive
    },
    // 💡 Opsional: Terkadang Google Drive menggunakan domain ini untuk memuat gambar
    {
      protocol: "https",
      hostname: "lh3.googleusercontent.com",
    },
    {
      protocol: 'https',
      hostname: 'firebasestorage.googleapis.com',
      port: '',
      pathname: '/**',
    },
    {
      protocol: 'https',
      hostname: 'storage.googleapis.com',
      port: '',
      pathname: '/**',
    },
    ],
  },
};

export default nextConfig;
