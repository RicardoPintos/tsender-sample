import type { NextConfig } from "next";

const isProd = process.env.NODE_ENV === "production";

const nextConfig: NextConfig = {
  output: "export",
  distDir: "out",
  images: {
    unoptimized: true,
  },
  basePath: isProd ? "/tsender-sample" : "",
  assetPrefix: isProd ? "/tsender-sample/" : "",
  trailingSlash: true,
};

export default nextConfig;
