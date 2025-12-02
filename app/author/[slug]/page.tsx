import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { AuthorCard } from "@/components/blog/author-card";
import { BlogPostCard } from "@/components/blog/blog-post-card";
import { getAuthorBySlug, getAllAuthorSlugs } from "@/lib/wordpress/queries";
import { adaptAuthor, type Author } from "@/lib/wordpress/adapters/author";
import { adaptPost, type Post } from "@/lib/wordpress/adapters/post";

/**
 * Generate static paths for all authors
 */
export async function generateStaticParams() {
  const slugs = await getAllAuthorSlugs();
  return slugs.map((slug) => ({ slug }));
}

/**
 * Generate metadata for author pages
 */
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const wpAuthor = await getAuthorBySlug(slug);

  if (!wpAuthor) {
    return {
      title: "Author Not Found",
    };
  }

  const author = adaptAuthor(wpAuthor);
  const postCount = author.postCount || 0;

  return {
    title: `${author.name} - Author at FlatWP`,
    description:
      author.description ||
      `Read all ${postCount} ${postCount === 1 ? "article" : "articles"} by ${author.name}`,
    openGraph: {
      title: author.name,
      description: author.description,
      images: author.avatar?.url ? [author.avatar.url] : [],
    },
  };
}

interface AuthorPageProps {
  params: Promise<{
    slug: string;
  }>;
}

/**
 * Author Archive Page
 * Displays author profile with all their published posts
 */
export default async function AuthorPage({ params }: AuthorPageProps) {
  const { slug } = await params;

  // Fetch author with all posts
  const wpAuthor = await getAuthorBySlug(slug);

  if (!wpAuthor) {
    notFound();
  }

  // Adapt author data
  const author = adaptAuthor(wpAuthor);

  // Adapt posts
  const posts: Post[] = wpAuthor.posts?.nodes?.map((wpPost: any) =>
    adaptPost({
      ...wpPost,
      author: { node: wpAuthor }, // Include author in post data
    })
  ) || [];

  const postCount = author.postCount || posts.length;

  return (
    <div className="relative min-h-screen">
      <Header />
      <main className="container mx-auto px-6 py-12">
        {/* Author Card - Full Variant */}
        <AuthorCard author={author} variant="full" showPostCount={true} />

        {/* Posts Section */}
        {posts.length > 0 ? (
          <section>
            <h2 className="text-3xl font-bold mb-8">
              Articles by {author.name}{" "}
              <span className="text-muted-foreground text-2xl">
                ({postCount})
              </span>
            </h2>

            {/* Posts Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {posts.map((post) => (
                <BlogPostCard key={post.id} post={post} />
              ))}
            </div>
          </section>
        ) : (
          <div className="text-center py-12">
            <p className="text-muted-foreground text-lg">
              No published articles yet.
            </p>
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
}
