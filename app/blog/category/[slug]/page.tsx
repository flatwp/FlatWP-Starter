import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, FolderOpen } from "lucide-react";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { BlogPostCard } from "@/components/blog/blog-post-card";
import { getPostsByCategory, getAllCategorySlugs, type TaxonomyTerm } from "@/lib/wordpress/queries";

export const revalidate = 300; // Revalidate every 5 minutes

export async function generateStaticParams() {
  const slugs = await getAllCategorySlugs();
  return slugs.map((slug) => ({ slug }));
}

interface CategoryArchivePageProps {
  params: Promise<{
    slug: string;
  }>;
}

export default async function CategoryArchivePage({ params }: CategoryArchivePageProps) {
  const { slug } = await params;
  const archive = await getPostsByCategory(slug);

  if (!archive) {
    notFound();
  }

  const { term, posts } = archive;
  const category = term as TaxonomyTerm;

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

        {/* Archive Header */}
        <div className="mb-12">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 bg-primary/10 rounded-lg">
              <FolderOpen className="w-6 h-6 text-primary" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground uppercase tracking-wide">Category</p>
              <h1 className="text-4xl font-bold">{category.name}</h1>
            </div>
          </div>

          {category.description && (
            <p className="text-lg text-muted-foreground max-w-3xl">{category.description}</p>
          )}

          <div className="mt-4 flex items-center gap-2 text-sm text-muted-foreground">
            <span>{category.count} {category.count === 1 ? 'post' : 'posts'}</span>
          </div>
        </div>

        {/* Posts Grid */}
        <div className="flex flex-col gap-8">
          {posts.length === 0 ? (
            <div className="bg-card rounded-lg p-8 border border-border text-center">
              <p className="text-muted-foreground">No posts found in this category.</p>
            </div>
          ) : (
            posts.map((post) => (
              <BlogPostCard key={post.id} post={post} />
            ))
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}
