// next.config.ts
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  async rewrites() {
    return [
      {
        source: "/api/stock/:path*",
        destination: "https://marketdata.neueda.com/API/:path*",
      },
      // {
      //   source: '/api/trading/:path*',
      //   destination: 'http://localhost:8080/api/:path*',
      // },
    ];
  },
  env: {
    STOCK_API_URL:
      process.env.STOCK_API_URL || "https://marketdata.neueda.com/API",
    TRADING_API_URL: process.env.TRADING_API_URL || "http://localhost:8080/api",
  },
};

export default nextConfig;
