/** @type {import('next').NextConfig} */
const nextConfig = {
  // Enable standalone output for Docker deployment
  output: 'standalone',
  
  // Optimize for monorepo
  transpilePackages: ['@fawkes/ui', '@fawkes/schemas'],
  
  // Disable telemetry in production
  experimental: {
    // Enable if using server actions
    // serverActions: true,
  },
  
  // Environment variables available at build time
  env: {
    NEXT_PUBLIC_APP_VERSION: process.env.npm_package_version || '0.1.0',
  },
  
  // Image optimization
  images: {
    remotePatterns: [
      // Add your image domains here
      // { protocol: 'https', hostname: 'example.com' },
    ],
  },
  
  // Headers for security
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          { key: 'X-Frame-Options', value: 'DENY' },
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'Referrer-Policy', value: 'origin-when-cross-origin' },
        ],
      },
    ];
  },
};

module.exports = nextConfig;
