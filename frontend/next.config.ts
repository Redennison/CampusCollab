import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    domains: [
      "randomuser.me",
      "xpssholimgirhamcnrpq.supabase.co", // Your Supabase storage domain
      // add any other external hosts you use here
    ],
  },
};

export default nextConfig;
