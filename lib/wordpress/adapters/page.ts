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
export function adaptPage(wpPage: unknown): Page {
  const page = wpPage as Record<string, unknown>;
  const settings = page.flatwpSettings as Record<string, unknown> | undefined;
  const seo = page.seo as Record<string, unknown> | undefined;

  return {
    id: (page.id as string) || '',
    title: (page.title as string) || '',
    slug: (page.slug as string) || '',
    content: (page.content as string) || '',
    date: (page.date as string) || '',
    modified: (page.modified as string) || '',
    featuredImage: adaptImage((page.featuredImage as Record<string, unknown> | undefined)?.node as Parameters<typeof adaptImage>[0]),
    blocks: ((page.flexibleContent as unknown[]) || [])
      .map((block) => adaptBlock(block))
      .filter((block: FlexibleBlock | null): block is FlexibleBlock => block !== null),
    sidebarBlocks: ((page.sidebarBlocks as unknown[]) || [])
      .map((block) => adaptBlock(block))
      .filter((block: FlexibleBlock | null): block is FlexibleBlock => block !== null),
    flatwpSettings: settings
      ? {
          hideTitle: (settings.hideTitle as boolean) || false,
          containerWidth: (settings.containerWidth as 'default' | 'contained' | 'full-width') || 'default',
          hideHeader: (settings.hideHeader as boolean) || false,
          hideFooter: (settings.hideFooter as boolean) || false,
          customCssClass: (settings.customCssClass as string) || '',
          showSidebar: (settings.showSidebar as boolean) || false,
        }
      : undefined,
    revalidateTime: page.revalidateTime as number | undefined,
    seo: seo
      ? {
          title: seo.title as string | undefined,
          metaDesc: seo.metaDesc as string | undefined,
        }
      : undefined,
  };
}
