import { Zap, Code2, Shield, Rocket, Database, Gauge } from "lucide-react";

const features = [
  {
    icon: Zap,
    title: "Lightning Fast",
    description:
      "Static generation, ISR, and intelligent caching strategies deliver sub-second page loads.",
  },
  {
    icon: Code2,
    title: "TypeScript First",
    description:
      "Fully typed GraphQL queries with auto-generated types. Catch errors before deployment.",
  },
  {
    icon: Database,
    title: "WordPress GraphQL",
    description:
      "Modern GraphQL API for WordPress. Query exactly what you need, nothing more.",
  },
  {
    icon: Rocket,
    title: "Next.js 14",
    description:
      "App Router, Server Components, and streaming for optimal performance and DX.",
  },
  {
    icon: Shield,
    title: "Production Ready",
    description:
      "Security best practices, image optimization, and SEO built-in from day one.",
  },
  {
    icon: Gauge,
    title: "95+ Lighthouse Score",
    description:
      "Optimized for Core Web Vitals. Ship fast sites that users and Google love.",
  },
];

export function Features() {
  return (
    <section id="features" className="py-20 sm:py-32">
      <div className="container mx-auto max-w-screen-xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Everything you need to build modern WordPress sites
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            Production-ready features that help you ship faster without
            compromising quality.
          </p>
        </div>

        <div className="mx-auto mt-16 max-w-5xl">
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {features.map((feature) => (
              <div
                key={feature.title}
                className="group relative overflow-hidden rounded-lg border border-border/40 bg-card p-6 transition-all hover:border-primary/40 hover:shadow-lg"
              >
                <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <feature.icon className="h-6 w-6" />
                </div>
                <h3 className="mb-2 text-lg font-semibold">{feature.title}</h3>
                <p className="text-sm text-muted-foreground">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
