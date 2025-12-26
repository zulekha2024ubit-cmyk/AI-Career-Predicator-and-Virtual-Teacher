/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: []
  },
  experimental: {
    typedRoutes: true
  },
  webpack: (config) => {
    // Provide minimal fallbacks for client builds
    config.resolve = config.resolve || {};
    config.resolve.fallback = {
      ...config.resolve.fallback,
      fs: false,
      path: false,
      crypto: false
    };
    return config;
  }
}

export default nextConfig
