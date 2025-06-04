import type { NextConfig } from "next";

// Disable SSL verification for development with self-signed certificates
process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

const nextConfig: NextConfig = {
  serverExternalPackages: []
};

export default nextConfig;
