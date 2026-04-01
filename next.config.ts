import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* 1. Bypass TypeScript errors during build */
  typescript: {
    // !! WARN !!
    // Dangerously allow production builds to successfully complete even if
    // your project has type errors.
    // !! WARN !!
    ignoreBuildErrors: true,
  },

  /* 2. Bypass ESLint errors during build */
  eslint: {
    // Warning: This allows production builds to successfully complete even if
    // your project has ESLint errors.
    ignoreDuringBuilds: true,
  },

  /* 3. Common fixes for deployment (Optional but recommended) */
  // If you are using images from your own API domain:
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'pokecollectorhub.com',
        pathname: '**',
      },
    ],
  },
};

export default nextConfig;