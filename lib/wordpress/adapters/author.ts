/**
 * WordPress Author Adapter
 * Transforms WordPress GraphQL User response to application-friendly format
 */

/**
 * Social links for author profiles
 */
export interface AuthorSocialLinks {
  twitter?: string;
  linkedin?: string;
  github?: string;
  website?: string;
  instagram?: string;
  youtube?: string;
}

/**
 * Professional information for authors
 */
export interface AuthorProfessionalInfo {
  jobTitle?: string;
  company?: string;
  location?: string;
  expertise?: string; // comma-separated list
}

/**
 * Contact information for authors
 */
export interface AuthorContactInfo {
  contactEmail?: string;
  phone?: string;
}

/**
 * Author custom fields (ACF or Carbon Fields)
 * These fields are optional and require custom field plugins
 */
export interface AuthorCustomFields {
  // Social Links
  social?: AuthorSocialLinks;

  // Professional Info
  professional?: AuthorProfessionalInfo;

  // Contact
  contact?: AuthorContactInfo;

  // Display Options
  hideEmail?: boolean;
  featuredAuthor?: boolean;
  authorBadge?: string;
}

/**
 * Complete author profile information
 */
export interface Author {
  id: string;
  databaseId: number;
  name: string;
  firstName?: string;
  lastName?: string;
  nickname?: string;
  slug: string;
  email?: string;
  url?: string;
  description?: string;
  avatar?: {
    url: string;
  };
  postCount?: number;

  // Custom fields (optional, requires ACF/Carbon Fields)
  customFields?: AuthorCustomFields;
}

/**
 * Adapt WordPress GraphQL User to application Author type
 * Decouples components from WordPress's GraphQL schema
 *
 * @param wpAuthor - WordPress GraphQL User object
 * @returns Application Author object
 */
export function adaptAuthor(wpAuthor: unknown): Author {
  if (!wpAuthor) {
    return {
      id: '',
      databaseId: 0,
      name: 'Anonymous',
      slug: 'anonymous',
    };
  }

  // Cast to a more usable type
  const author = wpAuthor as Record<string, unknown>;

  // Extract custom fields if they exist
  // These would come from ACF or Carbon Fields plugins
  const authorMeta = author.authorMeta as Record<string, unknown> | undefined;
  const customFields: AuthorCustomFields | undefined = authorMeta ? {
    social: {
      twitter: authorMeta.twitter as string | undefined,
      linkedin: authorMeta.linkedin as string | undefined,
      github: authorMeta.github as string | undefined,
      website: authorMeta.website as string | undefined,
      instagram: authorMeta.instagram as string | undefined,
      youtube: authorMeta.youtube as string | undefined,
    },
    professional: {
      jobTitle: authorMeta.jobTitle as string | undefined,
      company: authorMeta.company as string | undefined,
      location: authorMeta.location as string | undefined,
      expertise: authorMeta.expertise as string | undefined,
    },
    contact: {
      contactEmail: authorMeta.contactEmail as string | undefined,
      phone: authorMeta.phone as string | undefined,
    },
    hideEmail: authorMeta.hideEmail as boolean | undefined,
    featuredAuthor: authorMeta.featuredAuthor as boolean | undefined,
    authorBadge: authorMeta.authorBadge as string | undefined,
  } : undefined;

  const avatar = author.avatar as Record<string, unknown> | undefined;
  const posts = author.posts as Record<string, unknown> | undefined;
  const pageInfo = posts?.pageInfo as Record<string, unknown> | undefined;

  return {
    id: author.id as string,
    databaseId: (author.databaseId as number) || 0,
    name: (author.name as string) || 'Anonymous',
    firstName: author.firstName as string | undefined,
    lastName: author.lastName as string | undefined,
    nickname: author.nickname as string | undefined,
    slug: (author.slug as string) || '',
    email: author.email as string | undefined,
    url: author.url as string | undefined,
    description: author.description as string | undefined,
    avatar: avatar?.url ? { url: avatar.url as string } : undefined,
    postCount: pageInfo?.total as number | undefined,
    customFields,
  };
}
