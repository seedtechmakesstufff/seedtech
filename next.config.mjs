/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  experimental: {
    serverComponentsExternalPackages: ["playwright-core", "playwright"],
  },
  async redirects() {
    return [
      {
        source: "/it-services",
        destination: "/services/managed-it",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
