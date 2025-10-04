import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    unoptimized: false
  },
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
