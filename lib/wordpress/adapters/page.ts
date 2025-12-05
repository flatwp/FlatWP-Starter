/**
 * WordPress Page Adapter
 * Transforms WordPress GraphQL page response to application-friendly format
 */

import { adaptImage, type Image } from './image';
import { adaptBlock, type FlexibleBlock } from './block';

export interface PageSettings {
  hideTitle?: boolean;
  containerWidth?: 'default' | 'contained' | 'full-width';
  hideHeader?: boolean;
  hideFooter?: boolean;
  customCssClass?: string;
  showSidebar?: boolean;
}

export interface Page {
  id: string;
  title: string;
  slug: string;
  content: string;
  date: string;
  modified: string;
  featuredImage?: Image;
  blocks: FlexibleBlock[];
  sidebarBlocks?: FlexibleBlock[];
  flatwpSettings?: PageSettings;
  revalidateTime?: number;
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
    sidebarBlocks: (wpPage.sidebarBlocks || [])
      .map((block: any) => adaptBlock(block))
      .filter((block: FlexibleBlock | null): block is FlexibleBlock => block !== null),
    flatwpSettings: wpPage.flatwpSettings
      ? {
          hideTitle: wpPage.flatwpSettings.hideTitle || false,
          containerWidth: wpPage.flatwpSettings.containerWidth || 'default',
          hideHeader: wpPage.flatwpSettings.hideHeader || false,
          hideFooter: wpPage.flatwpSettings.hideFooter || false,
          customCssClass: wpPage.flatwpSettings.customCssClass || '',
          showSidebar: wpPage.flatwpSettings.showSidebar || false,
        }
      : undefined,
    revalidateTime: wpPage.revalidateTime,
    seo: wpPage.seo
      ? {
          title: wpPage.seo.title,
          metaDesc: wpPage.seo.metaDesc,
        }
      : undefined,
  };
}
