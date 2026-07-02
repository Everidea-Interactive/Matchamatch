import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
  reactStrictMode: true,
  transpilePackages: ["@matchamatch/game-core"],
  allowedDevOrigins: ["127.0.0.1"],
};

export default nextConfig;
