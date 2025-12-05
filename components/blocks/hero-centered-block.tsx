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
    <section className="relative py-20 md:py-32 bg-gradient-to-b from-background to-muted/30 overflow-hidden">
      <div className="container mx-auto px-6">
        <div className="max-w-4xl mx-auto text-center">
          {/* Heading with fade-in animation */}
          <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight bg-clip-text text-transparent bg-gradient-to-r from-foreground to-foreground/70 animate-in fade-in slide-in-from-bottom-4 duration-700">
            {heading}
          </h1>

          {/* Subheading with staggered animation */}
          {subheading && (
            <p className="text-xl md:text-2xl text-muted-foreground mb-10 max-w-3xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-700 delay-150">
              {subheading}
            </p>
          )}

          {/* CTA Button with staggered animation */}
          {ctaText && ctaLink && (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-700 delay-300">
              <Button asChild size="lg" className="text-lg px-8 py-6 shadow-lg hover:shadow-xl transition-shadow">
                <Link href={ctaLink}>{ctaText}</Link>
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* Decorative gradient orbs with subtle animation */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-primary/10 rounded-full blur-3xl -z-10 animate-pulse" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl -z-10 animate-pulse" style={{ animationDelay: '1s' }} />
    </section>
  );
}
