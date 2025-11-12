import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    unoptimized: true, // allows all external images without restriction
    remotePatterns: [
      {
        protocol: "https",
        hostname: "api.dicebear.com",
        port: "",
        pathname: "/7.x/avataaars/svg",
      },
    ],
  },
  trailingSlash: false,
  async rewrites() {
    return [
      {
        source: "/vaihtokohteet",
        destination: "/destinations",
      },
    ];
  },
};

export default nextConfig;
