import Link from 'next/link';
import type { Tag } from '@/lib/wordpress/queries';
import { cn } from '@/lib/utils';

interface TagCloudProps {
  tags: Tag[];
  maxTags?: number;
}

/**
 * TagCloud Component
 * Displays tags with varying sizes based on post count
 * Larger tags = more posts
 */
export function TagCloud({ tags, maxTags = 20 }: TagCloudProps) {
  if (!tags || tags.length === 0) {
    return null;
  }

  // Sort by count descending and limit to maxTags
  const topTags = tags
    .sort((a, b) => (b.count || 0) - (a.count || 0))
    .slice(0, maxTags);

  // Calculate min and max counts for scaling
  const counts = topTags.map((tag) => tag.count || 0);
  const minCount = Math.min(...counts);
  const maxCount = Math.max(...counts);

  // Calculate font size for each tag (scale from 1-5)
  const getTagSize = (count: number): number => {
    if (maxCount === minCount) return 3; // All same count

    const scale = 5; // Size range 1-5
    const normalized = ((count - minCount) / (maxCount - minCount)) * (scale - 1) + 1;
    return Math.round(normalized);
  };

  // Map size to Tailwind classes
  const getSizeClasses = (size: number): string => {
    const sizeMap: Record<number, string> = {
      1: 'text-xs',
      2: 'text-sm',
      3: 'text-base font-medium',
      4: 'text-lg font-semibold',
      5: 'text-xl font-bold',
    };
    return sizeMap[size] || sizeMap[3];
  };

  return (
    <div className="bg-card rounded-lg p-6 border border-border">
      <h3 className="text-lg font-semibold mb-4">Popular Tags</h3>
      <div className="flex flex-wrap gap-2">
        {topTags.map((tag) => {
          const size = getTagSize(tag.count || 0);
          const sizeClasses = getSizeClasses(size);

          return (
            <Link
              key={tag.id}
              href={`/blog/tag/${tag.slug}`}
              className={cn(
                'inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full',
                'bg-primary/10 hover:bg-primary/20',
                'text-primary transition-all duration-200',
                'hover:scale-105',
                sizeClasses
              )}
              title={`${tag.count} ${tag.count === 1 ? 'post' : 'posts'}`}
            >
              <span className="leading-none">{tag.name}</span>
              <span className="text-xs opacity-70 leading-none">
                {tag.count}
              </span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
