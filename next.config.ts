import type { NextConfig } from 'next';
import path from 'path';

const nextConfig: NextConfig = {
  // Set the monorepo root for file tracing
  outputFileTracingRoot: path.join(__dirname, '../../'),

  // Image optimization configuration
  images: {
    // Allow loading images from WordPress hosts
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**.wordpress.com',
      },
      {
        protocol: 'https',
        hostname: 'your-wp-site.com',
      },
      // Gravatar for author avatars
      {
        protocol: 'https',
        hostname: 'secure.gravatar.com',
      },
      {
        protocol: 'https',
        hostname: 'gravatar.com',
      },
      {
        protocol: 'https',
        hostname: '*.gravatar.com',
      },
      // Common external image hosts
      {
        protocol: 'https',
        hostname: 'i0.wp.com',
      },
      {
        protocol: 'https',
        hostname: 'i1.wp.com',
      },
      {
        protocol: 'https',
        hostname: 'i2.wp.com',
      },
      {
        protocol: 'https',
        hostname: 'i3.wp.com',
      },
      // WordPress.com CDN
      {
        protocol: 'https',
        hostname: 'wp.com',
      },
      {
        protocol: 'https',
        hostname: '**.wp.com',
      },
      // Add your WordPress domain here or use environment variable
      ...(process.env.NEXT_PUBLIC_WORDPRESS_DOMAIN
        ? [
            {
              protocol: 'https' as const,
              hostname: process.env.NEXT_PUBLIC_WORDPRESS_DOMAIN,
            },
          ]
        : []),
      // Auto-detect WordPress domain from API URL
      ...(process.env.NEXT_PUBLIC_WORDPRESS_API_URL
        ? (() => {
            try {
              const url = new URL(process.env.NEXT_PUBLIC_WORDPRESS_API_URL);
              return [
                {
                  protocol: url.protocol.replace(':', '') as 'http' | 'https',
                  hostname: url.hostname,
                },
              ];
            } catch {
              return [];
            }
          })()
        : []),
    ],
    // Modern image formats for better performance
    formats: ['image/avif', 'image/webp'],
    // Responsive breakpoints matching Tailwind defaults
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    // Sizes for smaller images (thumbnails, avatars, icons)
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    // Cache optimized images for 30 days
    minimumCacheTTL: 60 * 60 * 24 * 30,
  },

  // Performance optimizations
  compiler: {
    // Remove console.log in production
    removeConsole: process.env.NODE_ENV === 'production',
  },

  // Enable gzip compression
  compress: true,

  // Performance experimental features
  experimental: {
    scrollRestoration: true,
  },

  // Server external packages
  serverExternalPackages: ['sharp'],

  // Headers for better caching and security
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin',
          },
        ],
      },
      {
        source: '/blog/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=300, stale-while-revalidate=60', // 5 min cache
          },
        ],
      },
      {
        source: '/_next/image',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=2592000, immutable', // 30 days
          },
        ],
      },
    ];
  },

  // Disable trailing slash
  trailingSlash: false,
};

export default nextConfig;
