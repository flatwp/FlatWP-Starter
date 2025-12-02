import Link from "next/link";
import { Button } from "@/components/ui/button";
import { FeaturedImage } from "@/components/ui/OptimizedImage";
import type { HeroSplitBlock } from "@/lib/wordpress/adapters/block";

export function HeroSplitBlock({
  heading,
  subheading,
  ctaText,
  ctaLink,
  image,
  imagePosition = "right",
}: Omit<HeroSplitBlock, "fieldGroupName">) {
  const imageOnLeft = imagePosition === "left";

  return (
    <section className="relative py-20 bg-gradient-to-b from-background to-muted/20">
      <div className="container mx-auto px-6">
        <div className={`grid md:grid-cols-2 gap-12 items-center ${imageOnLeft ? "md:grid-flow-dense" : ""}`}>
          {/* Content */}
          <div className={imageOnLeft ? "md:col-start-2" : ""}>
            <h1 className="text-4xl md:text-5xl font-bold mb-6 leading-tight">
              {heading}
            </h1>
            <p className="text-xl text-muted-foreground mb-8">
              {subheading}
            </p>
            {ctaText && ctaLink && (
              <Button asChild size="lg">
                <Link href={ctaLink}>{ctaText}</Link>
              </Button>
            )}
          </div>

          {/* Image */}
          {image && (
            <div className={imageOnLeft ? "md:col-start-1 md:row-start-1" : ""}>
              <div className="relative rounded-2xl overflow-hidden shadow-2xl">
                <FeaturedImage
                  src={image.url}
                  alt={image.alt || heading}
                  width={image.width}
                  height={image.height}
                  priority
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
