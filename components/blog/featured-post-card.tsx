import Link from "next/link";
import Image from "next/image";
import { Calendar, User, ArrowRight, Star, Clock } from "lucide-react";
import { Post } from "@/lib/wordpress/adapters/post";
import { Badge } from "@/components/ui/badge";
import { calculateReadingTime, formatDate } from "@/lib/utils/text";

interface FeaturedPostCardProps {
  post: Post;
  priority?: boolean; // For LCP optimization on first featured post
}

/**
 * Featured Post Card Component
 * Hero-style card with prominent image and enhanced visual design
 * Used for featured posts at the top of the blog page
 */
export function FeaturedPostCard({ post, priority = false }: FeaturedPostCardProps) {
  const readTime = calculateReadingTime(post.content);

  return (
    <article className="group relative bg-card rounded-xl overflow-hidden border border-border hover:border-primary/50 transition-all duration-300 hover:shadow-2xl">
      <div className="grid lg:grid-cols-2 gap-0">
        {/* Featured Image Section */}
        <Link
          href={`/blog/${post.slug}`}
          className="relative aspect-video lg:aspect-auto bg-muted overflow-hidden"
        >
          {post.featuredImage ? (
            <>
              <Image
                src={post.featuredImage.url}
                alt={post.featuredImage.alt || post.title}
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-105"
                priority={priority}
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
              {/* Gradient overlay for better text readability on mobile */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent lg:hidden" />
            </>
          ) : (
            <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-primary/10 to-primary/5">
              <Star className="w-16 h-16 text-primary/20" />
            </div>
          )}

          {/* Featured Badge */}
          <div className="absolute top-4 left-4 z-10">
            <div className="flex items-center gap-2 bg-primary text-primary-foreground px-3 py-1.5 rounded-full text-sm font-semibold shadow-lg">
              <Star className="w-4 h-4 fill-current" />
              <span>Featured</span>
            </div>
          </div>
        </Link>

        {/* Content Section */}
        <div className="flex flex-col p-8 lg:p-10">
          {/* Categories */}
          {post.categories && post.categories.length > 0 && (
            <div className="flex gap-2 flex-wrap mb-4">
              {post.categories.slice(0, 2).map((category) => (
                <Badge
                  key={category.id}
                  href={`/blog/category/${category.slug}`}
                  variant="secondary"
                  size="sm"
                  className="hover:bg-primary hover:text-primary-foreground transition-colors"
                >
                  {category.name}
                </Badge>
              ))}
            </div>
          )}

          {/* Title */}
          <h2 className="text-3xl lg:text-4xl font-bold mb-4 leading-tight">
            <Link
              href={`/blog/${post.slug}`}
              className="hover:text-primary transition-colors bg-gradient-to-r from-foreground to-foreground hover:from-primary hover:to-primary bg-clip-text"
            >
              {post.title}
            </Link>
          </h2>

          {/* Excerpt */}
          {post.excerpt && (
            <p className="text-muted-foreground text-lg mb-6 line-clamp-3 flex-grow">
              {post.excerpt}
            </p>
          )}

          {/* Meta Information */}
          <div className="flex items-center gap-4 mb-6 text-sm text-muted-foreground flex-wrap">
            {post.author && (
              <div className="flex items-center gap-2">
                {post.author.avatar?.url ? (
                  <Image
                    src={post.author.avatar.url}
                    alt={post.author.name}
                    width={32}
                    height={32}
                    className="w-8 h-8 rounded-full ring-2 ring-border"
                  />
                ) : (
                  <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                    <User className="w-4 h-4 text-primary" />
                  </div>
                )}
                <span className="font-medium text-foreground">{post.author.name}</span>
              </div>
            )}
            <span className="text-border">•</span>
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              <time dateTime={post.date}>
                {formatDate(post.date, 'full')}
              </time>
            </div>
            <span className="text-border">•</span>
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4" />
              <span>{readTime} min read</span>
            </div>
          </div>

          {/* Read More CTA */}
          <Link
            href={`/blog/${post.slug}`}
            className="inline-flex items-center gap-2 text-primary hover:text-primary/80 font-semibold group/cta transition-colors"
          >
            <span>Read Full Article</span>
            <ArrowRight className="w-4 h-4 transition-transform group-hover/cta:translate-x-1" />
          </Link>

          {/* Tags (optional) */}
          {post.tags && post.tags.length > 0 && (
            <div className="mt-6 pt-6 border-t border-border">
              <div className="flex gap-2 flex-wrap">
                {post.tags.slice(0, 4).map((tag) => (
                  <Badge
                    key={tag.id}
                    href={`/blog/tag/${tag.slug}`}
                    variant="outline"
                    size="sm"
                  >
                    #{tag.name}
                  </Badge>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </article>
  );
}
