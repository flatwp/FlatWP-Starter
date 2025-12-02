import Link from "next/link";
import { Button } from "@/components/ui/button";
import type { CtaBoxedBlock } from "@/lib/wordpress/adapters/block";

export function CtaBoxedBlock({
  heading,
  description,
  ctaText,
  ctaLink,
  secondaryCtaText,
  secondaryCtaLink,
}: Omit<CtaBoxedBlock, "fieldGroupName">) {
  return (
    <section className="py-20 bg-muted/30">
      <div className="container mx-auto px-6">
        <div className="max-w-5xl mx-auto">
          <div className="relative rounded-3xl bg-gradient-to-br from-primary to-primary/80 p-12 md:p-16 text-primary-foreground overflow-hidden">
            {/* Decorative elements */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-primary-foreground/10 rounded-full blur-3xl" />
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-primary-foreground/5 rounded-full blur-3xl" />

            {/* Content */}
            <div className="relative text-center">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                {heading}
              </h2>
              <p className="text-xl text-primary-foreground/90 mb-8 max-w-2xl mx-auto">
                {description}
              </p>

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button asChild size="lg" variant="secondary">
                  <Link href={ctaLink}>{ctaText}</Link>
                </Button>

                {secondaryCtaText && secondaryCtaLink && (
                  <Button asChild size="lg" variant="outline" className="bg-transparent border-primary-foreground text-primary-foreground hover:bg-primary-foreground/10">
                    <Link href={secondaryCtaLink}>{secondaryCtaText}</Link>
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
