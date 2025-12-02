import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Calendar, User } from "lucide-react";
import { Post } from "@/lib/wordpress/adapters/post";
import { Badge } from "@/components/ui/badge";
import { calculateReadingTime, formatDate } from "@/lib/utils/text";

interface BlogPostCardProps {
  post: Post;
}

export function BlogPostCard({ post }: BlogPostCardProps) {
  const readTime = calculateReadingTime(post.content);

  return (
    <article className="bg-card rounded-lg p-8 border border-border transition-shadow hover:shadow-lg">
      {/* Categories at top */}
      {post.categories && post.categories.length > 0 && (
        <div className="flex gap-2 flex-wrap mb-4">
          {post.categories.slice(0, 3).map((category) => (
            <Badge
              key={category.id}
              href={`/blog/category/${category.slug}`}
              variant="secondary"
              size="sm"
            >
              {category.name}
            </Badge>
          ))}
          {post.categories.length > 3 && (
            <Badge variant="secondary" size="sm">
              +{post.categories.length - 3} more
            </Badge>
          )}
        </div>
      )}

      {/* Title */}
      <h2 className="text-2xl font-bold mb-3 leading-snug">
        <Link
          href={`/blog/${post.slug}`}
          className="hover:text-primary transition-colors"
        >
          {post.title}
        </Link>
      </h2>

      {/* Excerpt */}
      {post.excerpt && (
        <p className="text-muted-foreground mb-6 line-clamp-3">{post.excerpt}</p>
      )}

      {/* Author & Date Meta */}
      <div className="flex items-center gap-4 mb-6 text-sm text-muted-foreground">
        {post.author && (
          <div className="flex items-center gap-2">
            {post.author.avatar ? (
              <Image
                src={post.author.avatar}
                alt={post.author.name}
                width={24}
                height={24}
                className="rounded-full"
                unoptimized={!post.author.avatar.includes('gravatar.com')}
              />
            ) : (
              <User className="w-4 h-4" />
            )}
            <span>{post.author.name}</span>
          </div>
        )}
        <span>•</span>
        <div className="flex items-center gap-2">
          <Calendar className="w-4 h-4" />
          <time dateTime={post.date}>
            {formatDate(post.date, 'short')}
          </time>
        </div>
        <span>•</span>
        <span>{readTime} min read</span>
      </div>

      {/* Tags section (optional, at bottom) */}
      {post.tags && post.tags.length > 0 && (
        <div className="pt-6 border-t border-border">
          <div className="flex gap-2 flex-wrap">
            {post.tags.slice(0, 5).map((tag) => (
              <Badge
                key={tag.id}
                href={`/blog/tag/${tag.slug}`}
                variant="outline"
                size="sm"
              >
                #{tag.name}
              </Badge>
            ))}
            {post.tags.length > 5 && (
              <Badge variant="outline" size="sm">
                +{post.tags.length - 5} more
              </Badge>
            )}
          </div>
        </div>
      )}
    </article>
  );
}
