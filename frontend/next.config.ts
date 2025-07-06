import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
      domains: [
        'randomuser.me',
        // add any other external hosts you use here
      ],
    },
};

export default nextConfig;
