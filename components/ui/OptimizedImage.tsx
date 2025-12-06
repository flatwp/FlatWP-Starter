/**
 * OptimizedImage Component
 * Wrapper around next/image with FlatWP-specific defaults
 */

import Image, { type ImageProps } from 'next/image';
import { cn } from '@/lib/utils';

interface OptimizedImageProps extends Omit<ImageProps, 'placeholder'> {
  /**
   * Additional CSS classes
   */
  className?: string;
}

/**
 * Optimized image component for WordPress media
 *
 * Features:
 * - Consistent loading strategy
 * - Optimized for WordPress media
 * - Proper error handling
 *
 * @example
 * ```tsx
 * <OptimizedImage
 *   src={post.featuredImage.url}
 *   alt={post.featuredImage.alt}
 *   width={post.featuredImage.width}
 *   height={post.featuredImage.height}
 *   priority={isAboveFold}
 * />
 * ```
 */
export function OptimizedImage({ className, ...props }: OptimizedImageProps) {
  return (
    // eslint-disable-next-line jsx-a11y/alt-text
    <Image
      {...props}
      className={cn('object-cover', className)}
      placeholder="empty"
    />
  );
}

/**
 * Optimized image for featured images with aspect ratio
 */
interface FeaturedImageProps extends Omit<OptimizedImageProps, 'width' | 'height' | 'sizes'> {
  /**
   * Image dimensions
   */
  width: number;
  height: number;
  /**
   * Whether this image is above the fold (should use priority loading)
   * @default false
   */
  priority?: boolean;
}

export function FeaturedImage({
  width,
  height,
  priority = false,
  className,
  ...props
}: FeaturedImageProps) {
  return (
    <OptimizedImage
      {...props}
      width={width}
      height={height}
      priority={priority}
      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 1200px"
      className={cn('aspect-video w-full', className)}
    />
  );
}

/**
 * Optimized thumbnail image with fixed size
 */
interface ThumbnailImageProps extends Omit<OptimizedImageProps, 'width' | 'height' | 'sizes'> {
  /**
   * Thumbnail size in pixels
   * @default 400
   */
  size?: number;
}

export function ThumbnailImage({ size = 400, className, ...props }: ThumbnailImageProps) {
  return (
    <OptimizedImage
      {...props}
      width={size}
      height={size}
      sizes={`${size}px`}
      className={cn('aspect-square', className)}
    />
  );
}

/**
 * Optimized avatar image with circular crop
 */
interface AvatarImageProps extends Omit<OptimizedImageProps, 'width' | 'height' | 'sizes'> {
  /**
   * Avatar size in pixels
   * @default 48
   */
  size?: number;
}

export function AvatarImage({ size = 48, className, ...props }: AvatarImageProps) {
  return (
    <OptimizedImage
      {...props}
      width={size}
      height={size}
      sizes={`${size}px`}
      className={cn('rounded-full', className)}
    />
  );
}
