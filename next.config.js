/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.resolve.fallback.fs = false;
    }
    return config;
  },
  fastRefresh: true,
  swcMinify: true,
  concurrentFeatures: true,
};

module.exports = nextConfig;
