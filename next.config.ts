import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    unoptimized: false,
    domains: [
      'lh3.googleusercontent.com',
      'lh4.googleusercontent.com',
      'lh5.googleusercontent.com',
      'lh6.googleusercontent.com'
    ]
  },
  trailingSlash: false,
  async rewrites() {
    return [
      {
        source: '/vaihtokohteet',
        destination: '/destinations'
      }
    ]
  }
};

export default nextConfig;
