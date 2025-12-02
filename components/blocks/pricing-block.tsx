import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Check } from "lucide-react";
import type { PricingBlock } from "@/lib/wordpress/adapters/block";

export function PricingBlock({
  heading,
  subheading,
  tiers,
}: Omit<PricingBlock, "fieldGroupName">) {
  return (
    <section className="py-20 bg-muted/30">
      <div className="container mx-auto px-6">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">{heading}</h2>
          {subheading && (
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              {subheading}
            </p>
          )}
        </div>

        {/* Pricing Tiers */}
        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {tiers.map((tier, index) => (
            <div
              key={index}
              className={`relative p-8 rounded-2xl border ${
                tier.highlighted
                  ? "bg-primary/5 border-primary shadow-xl scale-105"
                  : "bg-card border-border"
              }`}
            >
              {/* Highlighted Badge */}
              {tier.highlighted && (
                <Badge className="absolute -top-3 left-1/2 -translate-x-1/2" variant="default">
                  Popular
                </Badge>
              )}

              {/* Tier Name */}
              <h3 className="text-2xl font-bold mb-2">{tier.name}</h3>

              {/* Price */}
              <div className="mb-6">
                <span className="text-4xl font-bold">{tier.price}</span>
                <span className="text-muted-foreground">/{tier.period}</span>
              </div>

              {/* Description */}
              {tier.description && (
                <p className="text-muted-foreground mb-6">{tier.description}</p>
              )}

              {/* CTA Button */}
              <Button
                asChild
                variant={tier.highlighted ? "default" : "outline"}
                className="w-full mb-6"
                size="lg"
              >
                <Link href={tier.ctaLink}>{tier.ctaText}</Link>
              </Button>

              {/* Features List */}
              <ul className="space-y-3">
                {tier.features.map((feature, featureIndex) => (
                  <li key={featureIndex} className="flex items-start gap-3">
                    <Check className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                    <span className="text-sm">{feature}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
