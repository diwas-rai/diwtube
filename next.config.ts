import type { NextConfig } from "next";

const nextConfig: NextConfig = {
    images: {
        remotePatterns: [
            {
                protocol: "https",
                hostname: "p9ijfiswv0.ufs.sh",
            },
        ],
    },
};

export default nextConfig;
