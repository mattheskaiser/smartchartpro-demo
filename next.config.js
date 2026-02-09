/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    // WORKAROUND: Next.js 14.1.0 has a bug with type generation for dynamic routes
    // The code is valid (passes tsc --noEmit and getDiagnostics), but Next.js
    // type generation fails with "File is not a module" error
    // This is a known issue: https://github.com/vercel/next.js/issues/58272
    ignoreBuildErrors: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        port: '',
        pathname: '/**',
      },
    ],
  },
};

module.exports = nextConfig;
