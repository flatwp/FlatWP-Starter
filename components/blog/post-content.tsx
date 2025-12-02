"use client";

import parse, { Element, domToReact, HTMLReactParserOptions, DOMNode } from 'html-react-parser';
import { OptimizedImage } from '@/components/ui/OptimizedImage';
import { cn } from '@/lib/utils';

interface PostContentProps {
  content: string;
  className?: string;
}

/**
 * Advanced PostContent Component
 * Intelligently parses WordPress HTML content and replaces elements with Next.js optimized versions
 */
export function PostContent({ content, className }: PostContentProps) {
  if (!content) return null;

  const options: HTMLReactParserOptions = {
    replace: (domNode) => {
      if (!(domNode instanceof Element)) return domNode;

      const node = domNode as Element;

      // Replace standalone <img> tags with Next.js Image component
      if (node.name === 'img') {
        return replaceImage(node);
      }

      // Handle <figure> tags (WordPress wraps images with captions in figures)
      if (node.name === 'figure') {
        return replaceFigure(node);
      }

      // Handle WordPress gallery blocks
      if (node.attribs?.class?.includes('wp-block-gallery')) {
        return replaceGallery(node);
      }

      // Let typography plugin handle everything else (code, blockquotes, lists, etc.)
      return undefined;
    },
  };

  return (
    <div className={cn('prose max-w-none', className)}>
      {parse(content, options)}
    </div>
  );
}

/**
 * Replace <img> tags with OptimizedImage component
 */
function replaceImage(node: Element) {
  const src = node.attribs.src;
  const alt = node.attribs.alt || '';
  const width = parseInt(node.attribs.width || '1200', 10);
  const height = parseInt(node.attribs.height || '800', 10);
  const className = node.attribs.class || '';

  if (!src) return undefined;

  return (
    <span className="block my-8">
      <OptimizedImage
        src={src}
        alt={alt}
        width={width}
        height={height}
        className={cn('rounded-lg shadow-lg w-full h-auto', className)}
        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 1200px"
      />
    </span>
  );
}

/**
 * Replace <figure> tags (images with captions)
 */
function replaceFigure(node: Element) {
  const className = node.attribs.class || '';

  // Check if it's an image figure
  const imgNode = node.children.find(
    (child) => child instanceof Element && (child as Element).name === 'img'
  ) as Element | undefined;

  const figcaptionNode = node.children.find(
    (child) => child instanceof Element && (child as Element).name === 'figcaption'
  ) as Element | undefined;

  if (!imgNode) return undefined;

  const src = imgNode.attribs.src;
  const alt = imgNode.attribs.alt || '';
  const width = parseInt(imgNode.attribs.width || '1200', 10);
  const height = parseInt(imgNode.attribs.height || '800', 10);

  if (!src) return undefined;

  return (
    <figure className={cn('my-8', className)}>
      <OptimizedImage
        src={src}
        alt={alt}
        width={width}
        height={height}
        className="rounded-lg shadow-lg w-full h-auto"
        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 1200px"
      />
      {figcaptionNode && (
        <figcaption className="mt-3 text-sm text-center text-muted-foreground italic">
          {domToReact(figcaptionNode.children as DOMNode[])}
        </figcaption>
      )}
    </figure>
  );
}

/**
 * Replace WordPress gallery blocks
 */
function replaceGallery(node: Element) {
  const className = node.attribs.class || '';

  // Detect column count from WordPress classes (e.g., "columns-3")
  const columnsMatch = className.match(/columns-(\d+)/);
  const columns = columnsMatch ? parseInt(columnsMatch[1], 10) : 3;

  // Get all figure/image elements
  const figureNodes = node.children.filter(
    (child) => child instanceof Element && (child as Element).name === 'figure'
  ) as Element[];

  if (figureNodes.length === 0) return undefined;

  return (
    <div
      className={cn(
        'my-8 grid gap-4',
        columns === 2 && 'grid-cols-2',
        columns === 3 && 'grid-cols-2 md:grid-cols-3',
        columns === 4 && 'grid-cols-2 md:grid-cols-4',
        columns >= 5 && 'grid-cols-2 md:grid-cols-3 lg:grid-cols-5'
      )}
    >
      {figureNodes.map((figure, index) => {
        const imgNode = figure.children.find(
          (child) => child instanceof Element && (child as Element).name === 'img'
        ) as Element | undefined;

        if (!imgNode) return null;

        const src = imgNode.attribs.src;
        const alt = imgNode.attribs.alt || `Gallery image ${index + 1}`;
        const width = parseInt(imgNode.attribs.width || '600', 10);
        const height = parseInt(imgNode.attribs.height || '400', 10);

        if (!src) return null;

        return (
          <div key={index} className="overflow-hidden rounded-lg">
            <OptimizedImage
              src={src}
              alt={alt}
              width={width}
              height={height}
              className="w-full h-auto object-cover"
              sizes="(max-width: 768px) 50vw, 33vw"
            />
          </div>
        );
      })}
    </div>
  );
}

