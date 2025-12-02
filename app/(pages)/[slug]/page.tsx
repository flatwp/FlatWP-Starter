import { notFound } from "next/navigation";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { BlockRenderer } from "@/components/blocks/block-renderer";
import { getPageBySlug, getAllPageSlugs } from "@/lib/wordpress/queries";
import { unstable_cache } from 'next/cache';

// Dynamic revalidate is now controlled by WordPress settings per page
// Each page can have its own revalidate time set in WordPress admin

// Generate static params for all pages at build time
export async function generateStaticParams() {
  const slugs = await getAllPageSlugs();
  return slugs.map((slug) => ({ slug }));
}

interface PageProps {
  params: Promise<{
    slug: string;
  }>;
}

export default async function WordPressPage({ params }: PageProps) {
  const { slug } = await params;

  // First fetch to get revalidate time
  const initialPage = await getPageBySlug(slug);

  if (!initialPage) {
    notFound();
  }

  // Create cached version with ISR revalidation
  const getCachedPage = unstable_cache(
    async () => getPageBySlug(slug),
    [`page-${slug}`],
    {
      revalidate: 3600, // 1 hour default for pages
      tags: [`page-${slug}`]
    }
  );

  const page = await getCachedPage();

  if (!page) {
    notFound();
  }

  return (
    <div className="relative min-h-screen">
      <Header />
      <main>
        {/* Render ACF Flexible Content blocks */}
        <BlockRenderer blocks={page.blocks} />

        {/* Fallback: Render standard WordPress content if no blocks */}
        {page.blocks.length === 0 && page.content && (
          <section className="py-20">
            <div className="container mx-auto px-6">
              <article className="max-w-4xl mx-auto">
                <h1 className="text-4xl md:text-5xl font-bold mb-8">
                  {page.title}
                </h1>
                <div
                  className="prose prose-lg max-w-none"
                  dangerouslySetInnerHTML={{ __html: page.content }}
                />
              </article>
            </div>
          </section>
        )}
      </main>
      <Footer />
    </div>
  );
}
