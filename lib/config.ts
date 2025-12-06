/**
 * Runtime Configuration Access
 *
 * Provides type-safe access to FlatWP configuration throughout the app.
 * This module exports the validated configuration and utility functions.
 */

import flatwpConfig from '../flatwp.config';
import { getISRConfig } from '@flatwp/config';

/**
 * FlatWP Configuration
 * Pre-validated and type-safe configuration object
 */
export const config = flatwpConfig;

/**
 * WordPress Configuration
 */
export const wordpress = config.wordpress;

/**
 * Features Configuration
 */
export const features = config.features;

/**
 * Site Configuration
 */
export const site = config.site;

/**
 * Get ISR configuration for a specific content type
 *
 * @param contentType - Content type key
 * @returns ISR configuration object with revalidate and generateStaticParams
 *
 * @example
 * ```ts
 * const { revalidate } = getContentISR('posts');
 * export const revalidate = revalidate;
 * ```
 */
export function getContentISR(
  contentType: 'posts' | 'pages' | 'archives' | 'homepage' | string
) {
  return getISRConfig(config, contentType);
}

/**
 * Get Next.js revalidate value for a content type
 *
 * @param contentType - Content type key
 * @returns Revalidate value (number, false, or undefined)
 */
export function getRevalidate(
  contentType: 'posts' | 'pages' | 'archives' | 'homepage' | string
): number | false | undefined {
  const { revalidate } = getContentISR(contentType);
  // Ensure boolean true is converted to number
  if (revalidate === true) return 60;
  return revalidate as number | false | undefined;
}

/**
 * Check if a feature is enabled
 *
 * @param feature - Feature name
 * @returns Whether the feature is enabled
 */
export function isFeatureEnabled(
  feature: 'preview' | 'search' | 'vercel-analytics' | 'google-analytics'
): boolean {
  switch (feature) {
    case 'preview':
      return typeof config.features.preview === 'boolean'
        ? config.features.preview
        : config.features.preview.enabled;
    case 'search':
      return config.features.search.enabled;
    case 'vercel-analytics':
      return config.features.analytics.vercel;
    case 'google-analytics':
      return !!config.features.analytics.google;
    default:
      return false;
  }
}

/**
 * Get preview secret (for API routes)
 */
export function getPreviewSecret(): string | undefined {
  if (typeof config.features.preview === 'boolean') {
    return config.wordpress.previewSecret;
  }
  return config.features.preview.secret || config.wordpress.previewSecret;
}
