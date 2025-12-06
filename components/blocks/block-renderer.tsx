import dynamic from 'next/dynamic';
import type { FlexibleBlock } from '@/lib/wordpress/adapters/block';

// Dynamic imports for code splitting and better performance
const HeroCenteredBlock = dynamic(() =>
  import('./hero-centered-block').then((m) => m.HeroCenteredBlock)
);
const HeroSplitBlock = dynamic(() =>
  import('./hero-split-block').then((m) => m.HeroSplitBlock)
);
const FeaturesGridBlock = dynamic(() =>
  import('./features-grid-block').then((m) => m.FeaturesGridBlock)
);
const PricingBlock = dynamic(() =>
  import('./pricing-block').then((m) => m.PricingBlock)
);
const CtaSimpleBlock = dynamic(() =>
  import('./cta-simple-block').then((m) => m.CtaSimpleBlock)
);
const CtaBoxedBlock = dynamic(() =>
  import('./cta-boxed-block').then((m) => m.CtaBoxedBlock)
);
const TestimonialsBlock = dynamic(() =>
  import('./testimonials-block').then((m) => m.TestimonialsBlock)
);
const ContentSectionBlock = dynamic(() =>
  import('./content-section-block').then((m) => m.ContentSectionBlock)
);

interface BlockRendererProps {
  blocks: FlexibleBlock[];
}

/**
 * Block Renderer Component
 * Dynamically renders ACF Flexible Content blocks based on fieldGroupName
 *
 * @param blocks - Array of block data from WordPress ACF
 */
export function BlockRenderer({ blocks }: BlockRendererProps) {
  if (!blocks || blocks.length === 0) {
    return null;
  }

  return (
    <>
      {blocks.map((block, index) => {
        // Generate unique key for each block
        const key = `${block.fieldGroupName}-${index}`;

        // Render appropriate component based on fieldGroupName
        switch (block.fieldGroupName) {
          case 'hero_centered':
            return <HeroCenteredBlock key={key} {...block} />;

          case 'hero_split':
            return <HeroSplitBlock key={key} {...block} />;

          case 'features_grid':
            return <FeaturesGridBlock key={key} {...block} />;

          case 'pricing':
            return <PricingBlock key={key} {...block} />;

          case 'cta_simple':
            return <CtaSimpleBlock key={key} {...block} />;

          case 'cta_boxed':
            return <CtaBoxedBlock key={key} {...block} />;

          case 'testimonials':
            return <TestimonialsBlock key={key} {...block} />;

          case 'content_section':
            return <ContentSectionBlock key={key} {...block} />;

          default:
            // Log unknown block types for debugging
            console.warn(`Unknown block type: ${block && typeof block === 'object' && 'fieldGroupName' in block ? (block as { fieldGroupName: string }).fieldGroupName : 'unknown'}`);
            return null;
        }
      })}
    </>
  );
}
