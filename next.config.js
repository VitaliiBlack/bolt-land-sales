/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  images: {
    domains: ['images.unsplash.com'],
    formats: ['image/avif', 'image/webp'],
  },
  // This ensures client-side navigation works properly for our dynamic routes
  async redirects() {
    return [];
  },
  // Keep original image URLs
  experimental: {
    scrollRestoration: true,
  }
};

module.exports = nextConfig;
