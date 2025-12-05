import { BlockRenderer } from './blocks/block-renderer';
import type { FlexibleBlock } from '@/lib/wordpress/adapters/block';

interface SidebarProps {
  blocks: FlexibleBlock[];
  className?: string;
}

/**
 * Sidebar Component
 * Renders sidebar content using ACF Flexible Content blocks
 *
 * @param blocks - Array of block data from WordPress ACF sidebar_blocks field
 * @param className - Optional additional CSS classes
 */
export function Sidebar({ blocks, className = '' }: SidebarProps) {
  if (!blocks || blocks.length === 0) {
    return null;
  }

  return (
    <aside
      className={`
        w-full lg:w-80
        space-y-6
        ${className}
      `}
      aria-label="Sidebar"
    >
      <BlockRenderer blocks={blocks} />
    </aside>
  );
}
