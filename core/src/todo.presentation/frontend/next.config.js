/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  env: {
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api',
  },
  // Performance optimizations - tree-shake heavy packages
  experimental: {
    optimizePackageImports: ['framer-motion', '@dnd-kit/core', '@dnd-kit/sortable', '@dnd-kit/utilities'],
  },
  // Transpile packages for better compatibility
  transpilePackages: ['framer-motion'],
};

module.exports = nextConfig;
