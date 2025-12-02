/**
 * WordPress Page Adapter
 * Transforms WordPress GraphQL page response to application-friendly format
 */

import { adaptImage, type Image } from './image';
import { adaptBlock, type FlexibleBlock } from './block';

export interface Page {
  id: string;
  title: string;
  slug: string;
  content: string;
  date: string;
  modified: string;
  featuredImage?: Image;
  blocks: FlexibleBlock[];
  seo?: {
    title?: string;
    metaDesc?: string;
  };
}

/**
 * Adapt WordPress GraphQL Page to application Page type
 *
 * @param wpPage - WordPress GraphQL page data
 * @returns Adapted Page object
 */
export function adaptPage(wpPage: any): Page {
  return {
    id: wpPage.id,
    title: wpPage.title || '',
    slug: wpPage.slug || '',
    content: wpPage.content || '',
    date: wpPage.date || '',
    modified: wpPage.modified || '',
    featuredImage: adaptImage(wpPage.featuredImage?.node),
    blocks: (wpPage.flexibleContent || [])
      .map((block: any) => adaptBlock(block))
      .filter((block: FlexibleBlock | null): block is FlexibleBlock => block !== null),
    seo: wpPage.seo
      ? {
          title: wpPage.seo.title,
          metaDesc: wpPage.seo.metaDesc,
        }
      : undefined,
  };
}
