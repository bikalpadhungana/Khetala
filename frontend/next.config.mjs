/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone', // <-- Add this line right here
  turbopack: {},
  devIndicators: {
    appIsrStatus: false,
    buildActivity: false,
  },
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: 'https://api.ttfreelancinghub.com/api/:path*',
      },
    ];
  },
};

export default nextConfig;