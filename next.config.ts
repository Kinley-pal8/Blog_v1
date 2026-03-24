import type { NextConfig } from "next";

const config: NextConfig = {
  reactStrictMode: true,
  images: {
    qualities: [75, 95],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**.supabase.co",
      },
      {
        protocol: "https",
        hostname: "**.unsplash.com",
      },
      {
        protocol: "https",
        hostname: "blog.purestorage.com",
      },
      {
        protocol: "https",
        hostname: "media.licdn.com",
      },
      {
        protocol: "https",
        hostname: "cdn.educba.com",
      },
    ],
  },
};

export default config;
