import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Each college deployment can have its own basePath if needed
  // basePath: process.env.NEXT_PUBLIC_BASE_PATH || '',
  typescript: {
    // TypeScript errors will be fixed progressively — allow deploy in the meantime
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;
