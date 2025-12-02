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
export function adaptAuthor(wpAuthor: any): Author {
  if (!wpAuthor) {
    return {
      id: '',
      databaseId: 0,
      name: 'Anonymous',
      slug: 'anonymous',
    };
  }

  // Extract custom fields if they exist
  // These would come from ACF or Carbon Fields plugins
  const customFields: AuthorCustomFields | undefined = wpAuthor.authorMeta ? {
    social: {
      twitter: wpAuthor.authorMeta.twitter,
      linkedin: wpAuthor.authorMeta.linkedin,
      github: wpAuthor.authorMeta.github,
      website: wpAuthor.authorMeta.website,
      instagram: wpAuthor.authorMeta.instagram,
      youtube: wpAuthor.authorMeta.youtube,
    },
    professional: {
      jobTitle: wpAuthor.authorMeta.jobTitle,
      company: wpAuthor.authorMeta.company,
      location: wpAuthor.authorMeta.location,
      expertise: wpAuthor.authorMeta.expertise,
    },
    contact: {
      contactEmail: wpAuthor.authorMeta.contactEmail,
      phone: wpAuthor.authorMeta.phone,
    },
    hideEmail: wpAuthor.authorMeta.hideEmail,
    featuredAuthor: wpAuthor.authorMeta.featuredAuthor,
    authorBadge: wpAuthor.authorMeta.authorBadge,
  } : undefined;

  return {
    id: wpAuthor.id,
    databaseId: wpAuthor.databaseId || 0,
    name: wpAuthor.name || 'Anonymous',
    firstName: wpAuthor.firstName,
    lastName: wpAuthor.lastName,
    nickname: wpAuthor.nickname,
    slug: wpAuthor.slug || '',
    email: wpAuthor.email,
    url: wpAuthor.url,
    description: wpAuthor.description,
    avatar: wpAuthor.avatar?.url ? { url: wpAuthor.avatar.url } : undefined,
    postCount: wpAuthor.posts?.pageInfo?.total,
    customFields,
  };
}
