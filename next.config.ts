import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
        port: "",
      },
      {
        protocol: "https",
        hostname: "quick-chameleon-170.convex.cloud",
        port: "",
      },
    ],
  },
};

export default nextConfig;
