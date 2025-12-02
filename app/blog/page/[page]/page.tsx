import { notFound } from "next/navigation";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { BlogPostCard } from "@/components/blog/blog-post-card";
import { BlogSidebar } from "@/components/blog/blog-sidebar";
import { Pagination } from "@/components/ui/pagination";
import {
  getPaginatedPosts,
  getTotalPostCount,
  calculateTotalPages,
  POSTS_PER_PAGE,
} from "@/lib/wordpress/queries";

export const revalidate = 300; // Revalidate every 5 minutes

interface BlogPaginationPageProps {
  params: Promise<{
    page: string;
  }>;
}

/**
 * Generate static params for all pagination pages
 * This pre-renders all blog pagination pages at build time
 */
export async function generateStaticParams() {
  try {
    const totalPosts = await getTotalPostCount();
    const totalPages = calculateTotalPages(totalPosts, POSTS_PER_PAGE);

    // Generate page numbers starting from 2 (page 1 is the main /blog route)
    return Array.from({ length: Math.max(0, totalPages - 1) }, (_, i) => ({
      page: String(i + 2),
    }));
  } catch (error) {
    console.error("Error generating static params for blog pagination:", error);
    return [];
  }
}

export default async function BlogPaginationPage({ params }: BlogPaginationPageProps) {
  const { page: pageParam } = await params;
  const pageNumber = parseInt(pageParam, 10);

  // Validate page number
  if (isNaN(pageNumber) || pageNumber < 1) {
    notFound();
  }

  // Redirect page 1 to main blog route (handled by middleware or this check)
  if (pageNumber === 1) {
    notFound(); // or redirect to /blog
  }

  try {
    // Fetch total posts to validate page number
    const totalPosts = await getTotalPostCount();
    const totalPages = calculateTotalPages(totalPosts, POSTS_PER_PAGE);

    // If page number exceeds total pages, show 404
    if (pageNumber > totalPages) {
      notFound();
    }

    // Fetch posts for this page
    const posts = await getPaginatedPosts(pageNumber, POSTS_PER_PAGE);

    // If no posts found despite valid page number, show 404
    if (posts.length === 0) {
      notFound();
    }

    return (
      <div className="relative min-h-screen">
        <Header />
        <main className="container mx-auto px-6 py-12">
          {/* Page Header */}
          <div className="mb-12">
            <h1 className="text-5xl font-bold mb-4">Blog</h1>
            <p className="text-muted-foreground text-lg">
              Thoughts, ideas, and insights about WordPress, headless CMS, and modern web development
            </p>
          </div>

          {/* Two-column layout */}
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_268px] gap-8">
            {/* Main content */}
            <div className="flex flex-col">
              <div className="flex flex-col gap-8">
                {posts.map((post) => (
                  <BlogPostCard key={post.id} post={post} />
                ))}
              </div>

              {/* Pagination */}
              <Pagination
                currentPage={pageNumber}
                totalPages={totalPages}
                basePath="/blog"
              />
            </div>

            {/* Sidebar */}
            <BlogSidebar />
          </div>
        </main>
        <Footer />
      </div>
    );
  } catch (error) {
    console.error(`Error fetching blog page ${pageNumber}:`, error);
    notFound();
  }
}
