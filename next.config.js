/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  async header() {
    return [
      {
        source: "/:path*",
        headers: securityHeaders,
      },
    ];
  },
};

module.exports = nextConfig;
