import Link from "next/link";
import { BlogSearch } from "./blog-search";
import { getPostsForSearchIndex, getAllCategories } from "@/lib/wordpress/queries";
import { formatDate } from "@/lib/utils/text";

/**
 * BlogSidebar - Server Component
 * Fetches ALL posts data for search and categories (not just current page)
 */
export async function BlogSidebar() {
  // Fetch all posts for search index and all categories in parallel
  const [searchIndex, categories] = await Promise.all([
    getPostsForSearchIndex(),
    getAllCategories(),
  ]);

  // Get recent posts (latest 5 from search index)
  const recentPosts = searchIndex
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 5);

  return (
    <aside className="space-y-6">
      {/* Search - Client Component */}
      <BlogSearch searchIndex={searchIndex} />

      {/* Categories */}
      {categories.length > 0 && (
        <div className="bg-card rounded-lg p-6 border border-border">
          <h3 className="text-lg font-semibold mb-4">Categories</h3>
          <div className="flex flex-col gap-2">
            {categories.map((category) => (
              <Link
                key={category.id}
                href={`/blog/category/${category.slug}`}
                className="flex items-center justify-between px-3 py-2 rounded-lg hover:bg-accent transition-colors text-left"
              >
                <span className="text-sm">{category.name}</span>
                <span className="text-xs text-muted-foreground">{category.count}</span>
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Recent Posts */}
      {recentPosts.length > 0 && (
        <div className="bg-card rounded-lg p-6 border border-border">
          <h3 className="text-lg font-semibold mb-4">Recent Posts</h3>
          <div className="flex flex-col gap-4">
            {recentPosts.map((post) => (
              <Link key={post.id} href={`/blog/${post.slug}`} className="group">
                <h4 className="text-sm font-medium group-hover:text-primary transition-colors mb-1 line-clamp-2">
                  {post.title}
                </h4>
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <time dateTime={post.date}>{formatDate(post.date, "short")}</time>
                </div>
              </Link>
            ))}
          </div>
          <Link
            href="/blog"
            className="block mt-4 text-sm text-primary hover:underline"
          >
            View All Posts ({searchIndex.length})
          </Link>
        </div>
      )}
    </aside>
  );
}
