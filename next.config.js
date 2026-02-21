/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,

  // Compress JS/CSS bundles
  compress: true,

  // Reduce build output noise; keep source maps only in dev
  productionBrowserSourceMaps: false,

  // Serve static /public assets with long-lived cache headers
  async headers() {
    return [
      {
        source: '/sequence-master/(.*)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
      {
        source: '/fonts/(.*)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
    ]
  },

}

module.exports = nextConfig
