/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**', // Allow images from any source
      },
    ],
  },
};

module.exports = nextConfig;