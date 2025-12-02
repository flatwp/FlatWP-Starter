import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-16 max-w-screen-xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center space-x-2">
          <Image
            src="/logos/orange/light-orange.svg"
            alt="FlatWP"
            width={120}
            height={32}
            priority
            className="h-8 w-auto"
          />
        </Link>

        <nav className="hidden md:flex md:items-center md:gap-6">
          <Link
            href="/#features"
            className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
          >
            Features
          </Link>
          <Link
            href="/blog"
            className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
          >
            Blog
          </Link>
          <Link
            href="https://github.com/flatwp"
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
          >
            GitHub
          </Link>
        </nav>

        <div className="flex items-center gap-4">
          <Button asChild variant="outline" size="sm" className="hidden sm:flex">
            <Link href="https://dev.flatwp.com" target="_blank" rel="noopener noreferrer">Live Demo</Link>
          </Button>
          <Button asChild size="sm">
            <Link href="/#newsletter">Get Started</Link>
          </Button>
        </div>
      </div>
    </header>
  );
}
