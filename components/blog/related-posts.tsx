import Link from "next/link";
import { Post } from "@/lib/wordpress/adapters/post";
import { BlogPostCard } from "./blog-post-card";

interface RelatedPostsProps {
  posts: Post[];
  tags?: Array<{
    id: string;
    name: string;
    slug: string;
  }>;
  title?: string;
}

/**
 * Related Posts Component
 * Displays inline tags followed by a grid of related blog posts
 *
 * @param posts - Array of related posts to display
 * @param tags - Optional array of tags to display inline
 * @param title - Optional section title (defaults to "Related Posts")
 */
export function RelatedPosts({ posts, tags, title = "Related Posts" }: RelatedPostsProps) {
  // Don't render if no related posts
  if (!posts || posts.length === 0) {
    return null;
  }

  return (
    <section className="mt-16 pt-12 border-t border-border">
      {/* Section heading */}
      <div className="mb-8">
        <h2 className="text-3xl font-bold mb-2">{title}</h2>

        {/* Inline tags */}
        {tags && tags.length > 0 && (
          <div className="text-muted-foreground flex items-center gap-2 flex-wrap">
            <span>Tags:</span>
            {tags.map((tag, index) => (
              <span key={tag.id}>
                <Link
                  href={`/blog/tag/${tag.slug}`}
                  className="hover:text-primary transition-colors"
                >
                  #{tag.name}
                </Link>
                {index < tags.length - 1 && ' '}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Related posts grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {posts.map((post) => (
          <BlogPostCard key={post.id} post={post} />
        ))}
      </div>
    </section>
  );
}
