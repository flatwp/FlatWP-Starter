/**
 * Rendering Strategy Configuration
 * Defines how different content types are rendered and cached
 */

export const RENDERING_STRATEGY = {
  // Static pages - fully static at build time
  staticPages: {
    paths: ['/about', '/contact'],
    revalidate: false, // Never revalidate unless manually triggered
  },

  // Blog posts - ISR with on-demand revalidation
  posts: {
    revalidate: false, // Use on-demand revalidation via webhook
    generateStaticParams: true,
  },

  // Archive pages - ISR with time-based revalidation
  archives: {
    blog: {
      revalidate: 300, // 5 minutes
    },
    categories: {
      revalidate: 300, // 5 minutes
    },
  },

  // Homepage - short ISR
  homepage: {
    revalidate: 60, // 1 minute
  },
} as const;

export type RenderingStrategy = typeof RENDERING_STRATEGY;
