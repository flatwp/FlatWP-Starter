import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { BlogPostCard } from "@/components/blog/blog-post-card";
import { FeaturedPostCard } from "@/components/blog/featured-post-card";
import { BlogSidebar } from "@/components/blog/blog-sidebar";
import { Pagination } from "@/components/ui/pagination";
import {
  getFeaturedPosts,
  getRegularPosts,
  getTotalPostCount,
  calculateTotalPages,
  POSTS_PER_PAGE,
} from "@/lib/wordpress/queries";

export const revalidate = 300; // Revalidate every 5 minutes

export default async function BlogPage() {
  // Fetch featured (sticky) posts, regular posts, and total count in parallel
  const [featuredPosts, regularPosts, totalPosts] = await Promise.all([
    getFeaturedPosts(3), // Get up to 3 sticky posts
    getRegularPosts(1), // Get first page of non-sticky posts
    getTotalPostCount(),
  ]);

  const totalPages = calculateTotalPages(totalPosts, POSTS_PER_PAGE);

  return (
    <div className="relative min-h-screen">
      <Header />
      <main className="container mx-auto max-w-screen-xl px-4 py-12 sm:px-6 lg:px-8">
        {featuredPosts.length === 0 && regularPosts.length === 0 ? (
          <div className="bg-card rounded-lg p-8 border border-border text-center">
            <p className="text-muted-foreground">No posts available yet. Check back soon!</p>
          </div>
        ) : (
          <>
            {/* Featured (Sticky) Posts Section - Full Width */}
            {featuredPosts.length > 0 && (
              <div className="flex flex-col gap-8 mb-12">
                {featuredPosts.map((post, index) => (
                  <FeaturedPostCard
                    key={post.id}
                    post={post}
                    priority={index === 0} // First featured post gets priority for LCP
                  />
                ))}
              </div>
            )}

            {/* Regular Posts Section with Sidebar - Two Column Layout */}
            {regularPosts.length > 0 && (
              <div className="grid grid-cols-1 lg:grid-cols-[1fr_268px] gap-8">
                {/* Main content */}
                <div className="flex flex-col">
                  {featuredPosts.length > 0 && (
                    <div className="flex items-center gap-3 mb-8">
                      <h2 className="text-2xl font-bold">Latest Posts</h2>
                      <div className="h-px flex-1 bg-border" />
                    </div>
                  )}
                  <div className="flex flex-col gap-8">
                    {regularPosts.map((post) => (
                      <BlogPostCard key={post.id} post={post} />
                    ))}
                  </div>

                  {/* Pagination */}
                  {totalPages > 1 && (
                    <Pagination
                      currentPage={1}
                      totalPages={totalPages}
                      basePath="/blog"
                    />
                  )}
                </div>

                {/* Sidebar */}
                <BlogSidebar />
              </div>
            )}
          </>
        )}
      </main>
      <Footer />
    </div>
  );
}
