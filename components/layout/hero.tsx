import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { ArrowRight, Github } from "lucide-react";

export function Hero() {
  return (
    <section className="relative overflow-hidden py-20 sm:py-32 lg:py-40">
      <div className="absolute inset-0 -z-10 bg-gradient-to-b from-primary/5 via-background to-background" />

      <div className="container mx-auto max-w-screen-xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <div className="mb-8 inline-flex items-center rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-sm text-primary">
            <span className="mr-2">⚡</span>
            Open Source Headless WordPress Starter
          </div>

          <div className="mb-6 flex flex-col items-center gap-6 sm:flex-row sm:justify-center">
            <Image
              src="/logos/orange/light-orange.svg"
              alt="FlatWP"
              width={280}
              height={84}
              priority
              className="h-auto w-56 sm:w-64 lg:w-72"
            />
            <div className="hidden h-20 w-px bg-muted-foreground/30 sm:block" />
            <h1 className="bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-left text-4xl font-bold tracking-tight text-transparent sm:text-5xl lg:text-6xl">
              Build Modern WordPress Sites with Next.js
            </h1>
          </div>

          <p className="mt-6 text-lg leading-8 text-muted-foreground sm:text-xl">
            FlatWP combines WordPress&apos;s powerful CMS with Next.js 14&apos;s
            performance. Get static generation, ISR, TypeScript, and GraphQL
            out of the box.
          </p>

          <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Button asChild size="lg" className="group">
              <Link href="/#newsletter">
                Get Early Access
                <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg">
              <Link
                href="https://github.com/flatwp"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Github className="mr-2 h-4 w-4" />
                View on GitHub
              </Link>
            </Button>
          </div>

          <div className="mt-12 flex items-center justify-center gap-8 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <div className="h-2 w-2 rounded-full bg-green-500" />
              MIT Licensed
            </div>
            <div className="flex items-center gap-2">
              <div className="h-2 w-2 rounded-full bg-primary" />
              TypeScript
            </div>
            <div className="flex items-center gap-2">
              <div className="h-2 w-2 rounded-full bg-blue-500" />
              Production Ready
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
