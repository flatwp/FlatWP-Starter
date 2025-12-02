import Link from "next/link";
import { Button } from "@/components/ui/button";
import { FeaturedImage } from "@/components/ui/OptimizedImage";
import type { ContentSectionBlock } from "@/lib/wordpress/adapters/block";

export function ContentSectionBlock({
  heading,
  content,
  image,
  imagePosition = "right",
  ctaText,
  ctaLink,
}: Omit<ContentSectionBlock, "fieldGroupName">) {
  const imageOnLeft = imagePosition === "left";
  const isVertical = imagePosition === "top" || imagePosition === "bottom";

  return (
    <section className="py-20 bg-background">
      <div className="container mx-auto px-6">
        <div
          className={`max-w-6xl mx-auto ${
            isVertical
              ? "space-y-12"
              : `grid md:grid-cols-2 gap-12 items-center ${imageOnLeft ? "md:grid-flow-dense" : ""}`
          }`}
        >
          {/* Content */}
          <div className={imageOnLeft && !isVertical ? "md:col-start-2" : imagePosition === "bottom" ? "order-1" : ""}>
            <h2 className="text-3xl md:text-4xl font-bold mb-6">{heading}</h2>
            <div
              className="prose prose-lg max-w-none mb-8 text-muted-foreground"
              dangerouslySetInnerHTML={{ __html: content }}
            />
            {ctaText && ctaLink && (
              <Button asChild size="lg">
                <Link href={ctaLink}>{ctaText}</Link>
              </Button>
            )}
          </div>

          {/* Image */}
          {image && (
            <div className={imageOnLeft && !isVertical ? "md:col-start-1 md:row-start-1" : imagePosition === "bottom" ? "order-2" : ""}>
              <div className="relative rounded-2xl overflow-hidden shadow-lg">
                <FeaturedImage
                  src={image.url}
                  alt={image.alt || heading}
                  width={image.width}
                  height={image.height}
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
