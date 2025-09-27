import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    serverComponentsExternalPackages: ["openai"],
  },
  outputFileTracingRoot: __dirname, // fix root inference warning
};

export default nextConfig;
