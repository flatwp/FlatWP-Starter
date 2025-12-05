import { notFound } from "next/navigation";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { BlockRenderer } from "@/components/blocks/block-renderer";
import { Sidebar } from "@/components/Sidebar";
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
      revalidate: initialPage.revalidateTime || 3600, // Use page-specific revalidate time
      tags: [`page-${slug}`]
    }
  );

  const page = await getCachedPage();

  if (!page) {
    notFound();
  }

  // Get page settings with defaults
  const settings = page.flatwpSettings || {};
  const hideTitle = settings.hideTitle || false;
  const hideHeader = settings.hideHeader || false;
  const hideFooter = settings.hideFooter || false;
  const showSidebar = settings.showSidebar || false;
  const customCssClass = settings.customCssClass || '';

  // Container width classes
  const containerWidthClasses = {
    'default': 'container mx-auto px-6',
    'contained': 'max-w-7xl mx-auto px-6',
    'full-width': 'w-full px-0',
  };
  const containerClass = containerWidthClasses[settings.containerWidth || 'default'];

  return (
    <div className={`relative min-h-screen ${customCssClass}`}>
      {!hideHeader && <Header />}

      <main>
        {/* Render ACF Flexible Content blocks */}
        {page.blocks.length > 0 ? (
          <div className={showSidebar && page.sidebarBlocks && page.sidebarBlocks.length > 0 ? 'relative' : ''}>
            <div className={containerClass}>
              <div className={showSidebar && page.sidebarBlocks && page.sidebarBlocks.length > 0 ? 'lg:flex lg:gap-8' : ''}>
                {/* Main Content */}
                <div className={showSidebar && page.sidebarBlocks && page.sidebarBlocks.length > 0 ? 'lg:flex-1' : 'w-full'}>
                  <BlockRenderer blocks={page.blocks} />
                </div>

                {/* Sidebar */}
                {showSidebar && page.sidebarBlocks && page.sidebarBlocks.length > 0 && (
                  <Sidebar blocks={page.sidebarBlocks} />
                )}
              </div>
            </div>
          </div>
        ) : (
          /* Fallback: Render standard WordPress content if no blocks */
          page.content && (
            <section className="py-20">
              <div className={containerClass}>
                <div className={showSidebar && page.sidebarBlocks && page.sidebarBlocks.length > 0 ? 'lg:flex lg:gap-8' : ''}>
                  <article className={showSidebar && page.sidebarBlocks && page.sidebarBlocks.length > 0 ? 'lg:flex-1 max-w-4xl' : 'max-w-4xl mx-auto'}>
                    {!hideTitle && (
                      <h1 className="text-4xl md:text-5xl font-bold mb-8">
                        {page.title}
                      </h1>
                    )}
                    <div
                      className="prose prose-lg max-w-none"
                      dangerouslySetInnerHTML={{ __html: page.content }}
                    />
                  </article>

                  {/* Sidebar for fallback content */}
                  {showSidebar && page.sidebarBlocks && page.sidebarBlocks.length > 0 && (
                    <Sidebar blocks={page.sidebarBlocks} />
                  )}
                </div>
              </div>
            </section>
          )
        )}
      </main>

      {!hideFooter && <Footer />}
    </div>
  );
}
