import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, User as UserIcon } from "lucide-react";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { BlogPostCard } from "@/components/blog/blog-post-card";
import { getPostsByAuthor, getAllAuthorSlugs, type Author } from "@/lib/wordpress/queries";

export const revalidate = 300; // Revalidate every 5 minutes

export async function generateStaticParams() {
  const slugs = await getAllAuthorSlugs();
  return slugs.map((slug) => ({ slug }));
}

interface AuthorArchivePageProps {
  params: Promise<{
    slug: string;
  }>;
}

export default async function AuthorArchivePage({ params }: AuthorArchivePageProps) {
  const { slug } = await params;
  const archive = await getPostsByAuthor(slug);

  if (!archive) {
    notFound();
  }

  const { term, posts } = archive;
  const author = term as Author;

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

        {/* Author Header */}
        <div className="mb-12">
          <div className="flex items-start gap-6 mb-6">
            {/* Author Avatar */}
            <div className="flex-shrink-0">
              {author.avatar ? (
                <div className="relative w-24 h-24 rounded-full overflow-hidden border-4 border-primary/20">
                  <Image
                    src={author.avatar}
                    alt={author.name}
                    fill
                    className="object-cover"
                  />
                </div>
              ) : (
                <div className="w-24 h-24 rounded-full bg-primary/10 flex items-center justify-center border-4 border-primary/20">
                  <UserIcon className="w-12 h-12 text-primary" />
                </div>
              )}
            </div>

            {/* Author Info */}
            <div className="flex-1">
              <p className="text-sm text-muted-foreground uppercase tracking-wide mb-2">Author</p>
              <h1 className="text-4xl font-bold mb-3">{author.name}</h1>

              {author.description && (
                <p className="text-lg text-muted-foreground max-w-3xl mb-4">{author.description}</p>
              )}

              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <span>{posts.length} {posts.length === 1 ? 'post' : 'posts'}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Posts Grid */}
        <div>
          <h2 className="text-2xl font-bold mb-6">Posts by {author.name}</h2>
          <div className="flex flex-col gap-8">
            {posts.length === 0 ? (
              <div className="bg-card rounded-lg p-8 border border-border text-center">
                <p className="text-muted-foreground">No posts found by this author.</p>
              </div>
            ) : (
              posts.map((post) => (
                <BlogPostCard key={post.id} post={post} />
              ))
            )}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
