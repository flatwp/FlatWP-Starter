import type { FeaturesGridBlock } from "@/lib/wordpress/adapters/block";

export function FeaturesGridBlock({
  heading,
  subheading,
  features,
}: Omit<FeaturesGridBlock, "fieldGroupName">) {
  return (
    <section className="py-20 bg-background">
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

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className="p-8 rounded-xl bg-card border border-border hover:shadow-lg transition-shadow"
            >
              {/* Icon */}
              <div className="text-5xl mb-4">{feature.icon}</div>

              {/* Title */}
              <h3 className="text-xl font-bold mb-3">{feature.title}</h3>

              {/* Description */}
              <p className="text-muted-foreground leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
