import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  typescript: {
    // Dangerously allow production builds to complete even if your project has type errors
    ignoreBuildErrors: true,
  },
  eslint: {
    // Don't run ESLint during builds
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;
