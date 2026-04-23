import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      // ローカル開発（Active Storage ローカル）
      { protocol: "http", hostname: "localhost" },
      // Render 本番
      { protocol: "https", hostname: "*.onrender.com" },
      // AWS S3
      { protocol: "https", hostname: "*.amazonaws.com" },
      // 本番ドメイン経由
      { protocol: "https", hostname: "www.okaimonote.com" },
      { protocol: "https", hostname: "api.okaimonote.com" },
    ],
  },
};

export default nextConfig;
