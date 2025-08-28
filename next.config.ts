import type { NextConfig } from "next";

const isStaticExport = process.env.STATIC_EXPORT === "true";

const nextConfig: NextConfig = {
  // Only enable static export when explicitly requested
  ...(isStaticExport ? { output: "export" as const } : { output: undefined as unknown as never }),
  trailingSlash: true,
  skipTrailingSlashRedirect: true,
  reactStrictMode: true,
  images: {
    // Keep unoptimized images for static export compatibility
    unoptimized: true,
  },
};

export default nextConfig;
