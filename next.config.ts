import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // experimental: { serverExternalPackages: ["openai"] }, // Removed: not recognized in this Next.js version
  outputFileTracingRoot: __dirname, // fix root inference warning
};

export default nextConfig;
