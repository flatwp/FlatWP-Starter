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
export function adaptPost(wpPost: any): Post {
  return {
    id: wpPost.id,
    title: stripHtml(wpPost.title || ''),
    slug: wpPost.slug || '',
    excerpt: cleanExcerpt(wpPost.excerpt),
    content: wpPost.content || '',
    date: wpPost.date || '',
    author: adaptAuthor(wpPost.author?.node),
    featuredImage: adaptImage(wpPost.featuredImage?.node),
    categories: wpPost.categories?.nodes?.map((cat: any) => ({
      id: cat.id || cat.databaseId?.toString() || '',
      name: cat.name || '',
      slug: cat.slug || '',
    })) || [],
    tags: wpPost.tags?.nodes?.map((tag: any) => ({
      id: tag.id || tag.databaseId?.toString() || '',
      name: tag.name || '',
      slug: tag.slug || '',
    })) || undefined,
    isSticky: wpPost.isSticky || false,
  };
}
