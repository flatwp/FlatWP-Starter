/**
 * WordPress Image Adapter
 * Transforms WordPress GraphQL MediaItem to application-friendly format
 */

import type { ImageFieldsFragment } from '../__generated__/graphql';

export interface Image {
  url: string;
  alt: string;
  width: number;
  height: number;
  mimeType?: string;
  fileSize?: number;
}

/**
 * Adapt WordPress GraphQL MediaItem to application Image type
 * This decouples components from WordPress's GraphQL schema
 */
export function adaptImage(wpImage: ImageFieldsFragment | null | undefined): Image | undefined {
  if (!wpImage || !wpImage.sourceUrl) {
    return undefined;
  }

  return {
    url: wpImage.sourceUrl,
    alt: wpImage.altText || '',
    width: wpImage.mediaDetails?.width || 0,
    height: wpImage.mediaDetails?.height || 0,
    // Optional fields - uncomment if WordPress plugins are installed
    // mimeType: wpImage.mimeType || undefined,
    // fileSize: wpImage.fileSize || undefined,
  };
}
