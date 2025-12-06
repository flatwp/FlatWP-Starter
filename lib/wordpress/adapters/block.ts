/**
 * Block Type Definitions
 * These types define the shape of ACF Flexible Content blocks
 * Once WordPress is configured with ACF, GraphQL codegen will generate these automatically
 */

import { Image } from './image';

/**
 * Base block interface - all blocks extend this
 */
export interface BaseBlock {
  fieldGroupName: string;
}

/**
 * Hero Centered Block
 * Full-width centered hero with heading, subheading, and CTA
 */
export interface HeroCenteredBlock extends BaseBlock {
  fieldGroupName: 'hero_centered';
  heading: string;
  subheading: string;
  ctaText: string;
  ctaLink: string;
}

/**
 * Hero Split Block
 * Hero with content on one side and image on the other
 */
export interface HeroSplitBlock extends BaseBlock {
  fieldGroupName: 'hero_split';
  heading: string;
  subheading: string;
  ctaText: string;
  ctaLink: string;
  image?: Image;
  imagePosition: 'left' | 'right';
}

/**
 * Features Grid Block
 * Grid of feature cards with icon, title, and description
 */
export interface FeaturesGridBlock extends BaseBlock {
  fieldGroupName: 'features_grid';
  heading: string;
  subheading?: string;
  features: Array<{
    icon: string;
    title: string;
    description: string;
  }>;
}

/**
 * Pricing Block
 * Pricing table with multiple tiers
 */
export interface PricingBlock extends BaseBlock {
  fieldGroupName: 'pricing';
  heading: string;
  subheading?: string;
  tiers: Array<{
    name: string;
    price: string;
    period: string;
    description?: string;
    features: string[]; // Array of feature strings
    ctaText: string;
    ctaLink: string;
    highlighted: boolean;
  }>;
}

/**
 * CTA Simple Block
 * Simple centered call-to-action
 */
export interface CtaSimpleBlock extends BaseBlock {
  fieldGroupName: 'cta_simple';
  heading: string;
  description: string;
  ctaText: string;
  ctaLink: string;
}

/**
 * CTA Boxed Block
 * Boxed call-to-action with gradient background and secondary CTA
 */
export interface CtaBoxedBlock extends BaseBlock {
  fieldGroupName: 'cta_boxed';
  heading: string;
  description: string;
  ctaText: string;
  ctaLink: string;
  secondaryCtaText?: string;
  secondaryCtaLink?: string;
}

/**
 * Testimonials Block
 * Grid of testimonial cards
 */
export interface TestimonialsBlock extends BaseBlock {
  fieldGroupName: 'testimonials';
  heading: string;
  testimonials: Array<{
    quote: string;
    author: string;
    role?: string;
    company?: string;
    image?: Image;
  }>;
}

/**
 * Content Section Block
 * Text content with optional image
 */
export interface ContentSectionBlock extends BaseBlock {
  fieldGroupName: 'content_section';
  heading: string;
  content: string;
  image?: Image;
  imagePosition: 'left' | 'right' | 'top' | 'bottom';
  ctaText?: string;
  ctaLink?: string;
}

/**
 * Union type of all possible blocks
 */
export type FlexibleBlock =
  | HeroCenteredBlock
  | HeroSplitBlock
  | FeaturesGridBlock
  | PricingBlock
  | CtaSimpleBlock
  | CtaBoxedBlock
  | TestimonialsBlock
  | ContentSectionBlock;

/**
 * Adapt raw ACF block data to typed block interfaces
 * This function normalizes WordPress ACF data to our application types
 *
 * @param wpBlock - Raw block data from WordPress GraphQL
 * @returns Typed block object
 */
export function adaptBlock(wpBlock: unknown): FlexibleBlock | null {
  const block = wpBlock as Record<string, unknown>;
  if (!block || !block.fieldGroupName) {
    return null;
  }

  // Type-safe block adaptation based on fieldGroupName
  const fieldGroupName = block.fieldGroupName as FlexibleBlock['fieldGroupName'];

  switch (fieldGroupName) {
    case 'hero_centered':
      return {
        fieldGroupName: 'hero_centered',
        heading: (block.heading as string) || '',
        subheading: (block.subheading as string) || '',
        ctaText: (block.ctaText as string) || '',
        ctaLink: (block.ctaLink as string) || '',
      } as HeroCenteredBlock;

    case 'hero_split':
      return {
        fieldGroupName: 'hero_split',
        heading: (block.heading as string) || '',
        subheading: (block.subheading as string) || '',
        ctaText: (block.ctaText as string) || '',
        ctaLink: (block.ctaLink as string) || '',
        image: block.image as Image | undefined,
        imagePosition: (block.imagePosition as 'left' | 'right') || 'right',
      } as HeroSplitBlock;

    case 'features_grid':
      return {
        fieldGroupName: 'features_grid',
        heading: (block.heading as string) || '',
        subheading: block.subheading as string | undefined,
        features: (block.features as Array<{icon: string; title: string; description: string}>) || [],
      } as FeaturesGridBlock;

    case 'pricing':
      return {
        fieldGroupName: 'pricing',
        heading: (block.heading as string) || '',
        subheading: block.subheading as string | undefined,
        tiers: ((block.tiers as Record<string, unknown>[]) || []).map((tier: Record<string, unknown>) => ({
          name: (tier.name as string) || '',
          price: (tier.price as string) || '',
          period: (tier.period as string) || 'month',
          description: tier.description as string | undefined,
          features: Array.isArray(tier.features)
            ? (tier.features as string[])
            : ((tier.features as string) || '').split('\n').filter(Boolean),
          ctaText: (tier.ctaText as string) || 'Get Started',
          ctaLink: (tier.ctaLink as string) || '#',
          highlighted: (tier.highlighted as boolean) || false,
        })),
      } as PricingBlock;

    case 'cta_simple':
      return {
        fieldGroupName: 'cta_simple',
        heading: (block.heading as string) || '',
        description: (block.description as string) || '',
        ctaText: (block.ctaText as string) || '',
        ctaLink: (block.ctaLink as string) || '',
      } as CtaSimpleBlock;

    case 'cta_boxed':
      return {
        fieldGroupName: 'cta_boxed',
        heading: (block.heading as string) || '',
        description: (block.description as string) || '',
        ctaText: (block.ctaText as string) || '',
        ctaLink: (block.ctaLink as string) || '',
        secondaryCtaText: block.secondaryCtaText as string | undefined,
        secondaryCtaLink: block.secondaryCtaLink as string | undefined,
      } as CtaBoxedBlock;

    case 'testimonials':
      return {
        fieldGroupName: 'testimonials',
        heading: (block.heading as string) || '',
        testimonials: (block.testimonials as Array<{quote: string; author: string; role?: string; company?: string; image?: Image}>) || [],
      } as TestimonialsBlock;

    case 'content_section':
      return {
        fieldGroupName: 'content_section',
        heading: (block.heading as string) || '',
        content: (block.content as string) || '',
        image: block.image as Image | undefined,
        imagePosition: (block.imagePosition as 'left' | 'right' | 'top' | 'bottom') || 'right',
        ctaText: block.ctaText as string | undefined,
        ctaLink: block.ctaLink as string | undefined,
      } as ContentSectionBlock;

    default:
      console.warn(`Unknown block type: ${fieldGroupName}`);
      return null;
  }
}
