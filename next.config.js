/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  async headers() {
    return [
      {
        source: "/_next/:path*",
        headers: [
          {
            key: "Access-Control-Allow-Origin",
            value: "https://furniture-website-pi.vercel.app",
          },
        ],
      },
    ];
  },
};

module.exports = nextConfig;
