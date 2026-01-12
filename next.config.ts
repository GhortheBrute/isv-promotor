import type { NextConfig } from "next";

const nextConfig: NextConfig = {
    output: 'export',
    images: {
        unoptimized: true,
    },
    // BasePath
    basePath: '/isv',
};

export default nextConfig;
