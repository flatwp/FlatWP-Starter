/**
 * WordPress Post Adapter
 * Transforms WordPress GraphQL response to application-friendly format
 */

import { stripHtml, cleanExcerpt } from '@/lib/utils/text';
import { adaptImage, type Image } from './image';
import { adaptAuthor, type Author } from './author';

export interface Post {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  date: string;
  author: Author;
  featuredImage?: Image;
  categories: Array<{
    id: string;
    name: string;
    slug: string;
  }>;
  tags?: Array<{
    id: string;
    name: string;
    slug: string;
  }>;
  isSticky?: boolean;
}

/**
 * Adapt WordPress GraphQL Post to application Post type
 * This decouples components from WordPress's GraphQL schema
 */
export function adaptPost(wpPost: unknown): Post {
  const post = wpPost as Record<string, unknown>;
  const categories = (post.categories as Record<string, unknown> | undefined);
  const tags = (post.tags as Record<string, unknown> | undefined);

  return {
    id: (post.id as string) || '',
    title: stripHtml((post.title as string) || ''),
    slug: (post.slug as string) || '',
    excerpt: cleanExcerpt((post.excerpt as string | null | undefined) || ''),
    content: (post.content as string) || '',
    date: (post.date as string) || '',
    author: adaptAuthor((post.author as Record<string, unknown> | undefined)?.node),
    featuredImage: adaptImage((post.featuredImage as Record<string, unknown> | undefined)?.node as Parameters<typeof adaptImage>[0]),
    categories: ((categories?.nodes as unknown[]) || []).map((cat: unknown) => {
      const category = cat as Record<string, unknown>;
      return {
        id: (category.id as string) || (category.databaseId as number | undefined)?.toString() || '',
        name: (category.name as string) || '',
        slug: (category.slug as string) || '',
      };
    }),
    tags: tags?.nodes ? ((tags.nodes as unknown[]) || []).map((tag: unknown) => {
      const tagItem = tag as Record<string, unknown>;
      return {
        id: (tagItem.id as string) || (tagItem.databaseId as number | undefined)?.toString() || '',
        name: (tagItem.name as string) || '',
        slug: (tagItem.slug as string) || '',
      };
    }) : undefined,
    isSticky: (post.isSticky as boolean) || false,
  };
}
