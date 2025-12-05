import { defineConfig, validateEnv } from '@flatwp/config';

/**
 * FlatWP Configuration
 *
 * This file centralizes all FlatWP settings including:
 * - WordPress connection
 * - Rendering strategies per content type
 * - Feature flags (preview, search, SEO, analytics)
 * - Site metadata
 *
 * @see https://flatwp.com/docs/configuration
 */
export default defineConfig({
  /**
   * WordPress Connection Settings
   */
  wordpress: {
    graphqlUrl: validateEnv(
      'NEXT_PUBLIC_WORDPRESS_API_URL',
      process.env.NEXT_PUBLIC_WORDPRESS_API_URL
    ),
    domain: process.env.NEXT_PUBLIC_WORDPRESS_DOMAIN, // Auto-detected if not set
    revalidateSecret: validateEnv(
      'REVALIDATION_SECRET',
      process.env.REVALIDATION_SECRET
    ),
    previewSecret: process.env.PREVIEW_SECRET,
  },

  /**
   * Rendering Strategies
   * Configure how different content types are rendered and cached
   */
  rendering: {
    // Blog Posts - ISR with on-demand revalidation
    posts: {
      strategy: 'isr',
      revalidate: false, // On-demand only via WordPress webhook
      generateStaticParams: true, // Generate all posts at build time
    },

    // Static Pages - Fully static at build time
    pages: {
      strategy: 'static',
      revalidate: false, // Never auto-revalidate
      generateStaticParams: true,
    },

    // Archive Pages - ISR with time-based revalidation
    archives: {
      strategy: 'isr',
      revalidate: 300, // 5 minutes - balance freshness vs performance
      generateStaticParams: true,
    },

    // Homepage - ISR with short revalidation
    homepage: {
      strategy: 'isr',
      revalidate: 60, // 1 minute - keep homepage fresh
      generateStaticParams: false, // Only one homepage
    },

    // Custom content types (example - uncomment to use)
    // custom: {
    //   'product': {
    //     strategy: 'isr',
    //     revalidate: 300,
    //     generateStaticParams: true,
    //   },
    // },
  },

  /**
   * Feature Flags and Configuration
   */
  features: {
    // Preview Mode - Enable draft content preview
    preview: {
      enabled: !!process.env.PREVIEW_SECRET,
      // Secret is read from environment automatically
    },

    // Search Configuration
    search: {
      enabled: true,
      provider: 'fuse', // Client-side search with Fuse.js
      // For Pro: Use Algolia for faster, server-side search
      // provider: 'algolia',
      // algolia: {
      //   appId: process.env.NEXT_PUBLIC_ALGOLIA_APP_ID!,
      //   apiKey: process.env.NEXT_PUBLIC_ALGOLIA_API_KEY!,
      //   indexName: 'posts',
      // },
    },

    // SEO Configuration
    seo: {
      provider: 'auto', // Auto-detect Yoast or RankMath from GraphQL
    },

    // Analytics Configuration
    analytics: {
      vercel: process.env.NEXT_PUBLIC_VERCEL_ANALYTICS === 'true',
      google: process.env.NEXT_PUBLIC_GA_ID,
      sentry: process.env.NEXT_PUBLIC_SENTRY_DSN,
    },
  },

  /**
   * Site Metadata
   */
  site: {
    url: process.env.NEXT_PUBLIC_SITE_URL,
    name: process.env.NEXT_PUBLIC_SITE_NAME || 'FlatWP',
    description:
      process.env.NEXT_PUBLIC_SITE_DESCRIPTION ||
      'A modern headless WordPress site built with Next.js',
  },
});
