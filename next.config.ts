import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  turbopack: {
    rules: {
      '*.svg': {
        loaders: ['@svgr/webpack'],
        as: '*.js'
      },
    },
  },
  images: {
    domains: ['picsum.photos', 'res.cloudinary.com'],
    formats: ["image/avif", "image/webp"],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "** piscum.photos",
      }, {
        protocol: "https",
        hostname: "res.cloudinary.com",
      },
    ]
  },
  experimental: {
    optimizePackageImports: ['lucide-react', 'react-icons']
  }
};

export default nextConfig;
