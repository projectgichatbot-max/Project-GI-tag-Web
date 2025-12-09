import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // experimental: { serverExternalPackages: ["openai"] }, // Removed: not recognized in this Next.js version
  outputFileTracingRoot: __dirname, // fix root inference warning
  reactStrictMode: false, // Disable strict mode to prevent double-mounting in development
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        pathname: '/**',
      },
    ],
  },
};

export default nextConfig;
