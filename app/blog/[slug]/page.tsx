import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Calendar, Clock, User } from "lucide-react";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { PostContent } from "@/components/blog/post-content";
import { Badge } from "@/components/ui/badge";
import { FeaturedImage } from "@/components/ui/OptimizedImage";
import { RelatedPosts } from "@/components/blog/related-posts";
import { AuthorCard } from "@/components/blog/author-card";
import { getPostBySlug, getAllPostSlugs, getRelatedPosts } from "@/lib/wordpress/queries";
import { calculateReadingTime, formatDate } from "@/lib/utils/text";
import { unstable_cache } from 'next/cache';

// Dynamic revalidate is now controlled by WordPress settings per post
// Each post can have its own revalidate time set in WordPress admin

export async function generateStaticParams() {
  const slugs = await getAllPostSlugs();
  return slugs.map((slug) => ({ slug }));
}

interface BlogPostPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { slug } = await params;

  // First fetch to get revalidate time
  const initialPost = await getPostBySlug(slug);

  if (!initialPost) {
    notFound();
  }

  // Create cached version with ISR revalidation
  const getCachedPost = unstable_cache(
    async () => getPostBySlug(slug),
    [`post-${slug}`],
    {
      revalidate: 300, // 5 minutes default for blog posts
      tags: [`post-${slug}`]
    }
  );

  const post = await getCachedPost();

  if (!post) {
    notFound();
  }

  // Calculate read time using utility function
  const readTime = calculateReadingTime(post.content);

  // Fetch related posts based on categories/tags
  const relatedPosts = await getRelatedPosts(post, 2);

  return (
    <div className="relative min-h-screen">
      <Header />
      <main className="container mx-auto px-6 py-12">
        {/* Back link */}
        <Link
          href="/blog"
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors mb-8"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Blog
        </Link>

        {/* Article */}
        <article className="max-w-4xl mx-auto">
          {/* Header */}
          <header className="mb-8">
            {/* Categories at top */}
            {post.categories && post.categories.length > 0 && (
              <div className="flex gap-2 mb-6 flex-wrap">
                {post.categories.map((category) => (
                  <Badge
                    key={category.id}
                    href={`/blog/category/${category.slug}`}
                    variant="default"
                  >
                    {category.name}
                  </Badge>
                ))}
              </div>
            )}

            {/* Title */}
            <h1 className="text-5xl font-bold mb-6 leading-tight">{post.title}</h1>

            {/* Author & Metadata */}
            <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
              {post.author && (
                <div className="flex items-center gap-2">
                  {post.author.avatar?.url ? (
                    <img
                      src={post.author.avatar.url}
                      alt={post.author.name}
                      className="w-10 h-10 rounded-full"
                    />
                  ) : (
                    <User className="w-6 h-6" />
                  )}
                  <span className="font-medium">{post.author.name}</span>
                </div>
              )}
              <span>•</span>
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                <time dateTime={post.date}>
                  {formatDate(post.date, 'full')}
                </time>
              </div>
              <span>•</span>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4" />
                <span>{readTime} min read</span>
              </div>
            </div>
          </header>

          {/* Featured Image */}
          {post.featuredImage && (
            <div className="mb-8 rounded-lg overflow-hidden">
              <FeaturedImage
                src={post.featuredImage.url}
                alt={post.featuredImage.alt || post.title}
                width={post.featuredImage.width}
                height={post.featuredImage.height}
                priority
              />
            </div>
          )}

          {/* Content with intelligent HTML parsing */}
          <PostContent content={post.content} />

          {/* Author Card */}
          <AuthorCard author={post.author} variant="compact" />

          {/* Related Posts with inline tags */}
          <RelatedPosts posts={relatedPosts} tags={post.tags} />
        </article>
      </main>
      <Footer />
    </div>
  );
}
