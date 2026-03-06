import withPWA from 'next-pwa';

/** @type {import('next').NextConfig} */
const nextConfig = withPWA({
  dest: 'public',
  disable: process.env.NODE_ENV === 'development',
  register: true,
  skipWaiting: true,
  buildExcludes: [/middleware-manifest\.json$/],
  runtimeCaching: [
    {
      urlPattern: /^https:\/\/.*\.firebaseio\.com\/.*/i,
      handler: 'NetworkFirst',
      options: {
        cacheName: 'firebase-data',
        expiration: {
          maxEntries: 32,
          maxAgeSeconds: 60 * 5 // 5 minutos
        },
        networkTimeoutSeconds: 10
      }
    }
  ]
})({
  output: 'export',
  images: {
    unoptimized: true
  }
});

export default nextConfig;
