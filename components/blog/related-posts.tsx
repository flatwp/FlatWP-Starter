import { Post } from "@/lib/wordpress/adapters/post";
import { BlogPostCard } from "./blog-post-card";

interface RelatedPostsProps {
  posts: Post[];
  title?: string;
}

/**
 * Related Posts Component
 * Displays a grid of related blog posts based on shared categories/tags
 *
 * @param posts - Array of related posts to display
 * @param title - Optional section title (defaults to "Related Posts")
 */
export function RelatedPosts({ posts, title = "Related Posts" }: RelatedPostsProps) {
  // Don't render if no related posts
  if (!posts || posts.length === 0) {
    return null;
  }

  return (
    <section className="mt-16 pt-12 border-t border-border">
      {/* Section heading */}
      <div className="mb-8">
        <h2 className="text-3xl font-bold mb-2">{title}</h2>
        <p className="text-muted-foreground">
          Continue exploring related topics and articles
        </p>
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
