import type { NextConfig } from "next";

const nextConfig: NextConfig = {
    async rewrites() {
        return ([
            {
                source: "/api/users/webhook", // Ensure no redirects here
                destination: "/src/app/api/users/webhook",
            },
        ]);
    },
};

export default nextConfig;
