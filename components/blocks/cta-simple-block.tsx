import Link from "next/link";
import { Button } from "@/components/ui/button";
import type { CtaSimpleBlock } from "@/lib/wordpress/adapters/block";

export function CtaSimpleBlock({
  heading,
  description,
  ctaText,
  ctaLink,
}: Omit<CtaSimpleBlock, "fieldGroupName">) {
  return (
    <section className="py-20 bg-background">
      <div className="container mx-auto px-6">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">{heading}</h2>
          <p className="text-xl text-muted-foreground mb-8">{description}</p>
          <Button asChild size="lg">
            <Link href={ctaLink}>{ctaText}</Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
