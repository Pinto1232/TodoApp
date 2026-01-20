/** @type {import('next').NextConfig} */
const turboFlag = process.env.TURBOPACK;
const isTurbopack = turboFlag === '1' || turboFlag === 'auto';

const nextConfig = {
  reactStrictMode: true,
  outputFileTracingRoot: __dirname,
  env: {
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api',
  },
};

if (!isTurbopack) {
  nextConfig.experimental = {
    optimizePackageImports: ['framer-motion', '@dnd-kit/core', '@dnd-kit/sortable', '@dnd-kit/utilities'],
  };
  nextConfig.transpilePackages = ['framer-motion'];
}

if (!isTurbopack) {
  nextConfig.webpack = (config, { dev }) => {
    if (dev) {
      config.cache = { type: 'memory' };
    }
    return config;
  };
}

module.exports = nextConfig;
