import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  
  // Conditional output based on environment
  output: process.env.DOCKER_BUILD ? 'standalone' : undefined,
  
  // Image optimization
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
  },
  
  // ✅ FIXED: Moved from experimental to root level
  serverExternalPackages: ['mongoose'],
  
  // Performance optimizations for Vercel
  poweredByHeader: false,
  compress: true,
  
  apps: [
    {
      protocol: 'https',
      hostname: 'huawei-uae.com',
    },
  ],
};

export default nextConfig;
