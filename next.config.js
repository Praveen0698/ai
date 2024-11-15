/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverComponentsExternalPackages: ["sharp", "onnxruntime-node"],
    missingSuspenseWithCSRBailout: false,
  },
};

module.exports = nextConfig;
