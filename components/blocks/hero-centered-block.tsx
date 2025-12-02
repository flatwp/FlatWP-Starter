import Link from "next/link";
import { Button } from "@/components/ui/button";
import type { HeroCenteredBlock } from "@/lib/wordpress/adapters/block";

export function HeroCenteredBlock({
  heading,
  subheading,
  ctaText,
  ctaLink,
}: Omit<HeroCenteredBlock, "fieldGroupName">) {
  return (
    <section className="relative py-20 md:py-32 bg-gradient-to-b from-background to-muted/30">
      <div className="container mx-auto px-6">
        <div className="max-w-4xl mx-auto text-center">
          {/* Heading */}
          <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight bg-clip-text text-transparent bg-gradient-to-r from-foreground to-foreground/70">
            {heading}
          </h1>

          {/* Subheading */}
          <p className="text-xl md:text-2xl text-muted-foreground mb-10 max-w-3xl mx-auto">
            {subheading}
          </p>

          {/* CTA Button */}
          {ctaText && ctaLink && (
            <Button asChild size="lg" className="text-lg px-8 py-6">
              <Link href={ctaLink}>{ctaText}</Link>
            </Button>
          )}
        </div>
      </div>

      {/* Decorative gradient orbs */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-primary/10 rounded-full blur-3xl -z-10" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl -z-10" />
    </section>
  );
}
