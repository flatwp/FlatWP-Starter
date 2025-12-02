import { FeaturedImage } from "@/components/ui/OptimizedImage";
import { User } from "lucide-react";
import type { TestimonialsBlock } from "@/lib/wordpress/adapters/block";

export function TestimonialsBlock({
  heading,
  testimonials,
}: Omit<TestimonialsBlock, "fieldGroupName">) {
  return (
    <section className="py-20 bg-muted/20">
      <div className="container mx-auto px-6">
        {/* Section Header */}
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-16">
          {heading}
        </h2>

        {/* Testimonials Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <div
              key={index}
              className="p-8 rounded-xl bg-card border border-border"
            >
              {/* Quote */}
              <p className="text-lg mb-6 leading-relaxed">
                &ldquo;{testimonial.quote}&rdquo;
              </p>

              {/* Author Info */}
              <div className="flex items-center gap-4">
                {/* Author Image */}
                {testimonial.image ? (
                  <div className="w-12 h-12 rounded-full overflow-hidden flex-shrink-0">
                    <FeaturedImage
                      src={testimonial.image.url}
                      alt={testimonial.author}
                      width={48}
                      height={48}
                    />
                  </div>
                ) : (
                  <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center flex-shrink-0">
                    <User className="w-6 h-6 text-muted-foreground" />
                  </div>
                )}

                {/* Author Details */}
                <div>
                  <div className="font-semibold">{testimonial.author}</div>
                  {testimonial.role && (
                    <div className="text-sm text-muted-foreground">
                      {testimonial.role}
                      {testimonial.company && `, ${testimonial.company}`}
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
