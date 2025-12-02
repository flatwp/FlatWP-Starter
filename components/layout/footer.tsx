import Link from "next/link";
import Image from "next/image";
import { Github, Star } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t border-border/40 bg-background">
      <div className="container mx-auto max-w-screen-xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          <div className="lg:col-span-1">
            <div className="flex items-start gap-3">
              <Link href="/" className="flex-shrink-0">
                <Image
                  src="/logos/orange/orange-ico-light.svg"
                  alt="FlatWP Logo"
                  width={32}
                  height={32}
                  className="h-8 w-8"
                />
              </Link>
              <p className="text-sm text-muted-foreground">
                Modern headless WordPress starter kit. Build blazing-fast sites
                with Next.js 14, TypeScript, and WordPress GraphQL.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-8">
            <div>
              <h3 className="text-sm font-semibold">Project</h3>
              <ul className="mt-4 space-y-3">
                <li>
                  <Link
                    href="#features"
                    className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                  >
                    Features
                  </Link>
                </li>
                <li>
                  <Link
                    href="/blog"
                    className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                  >
                    Blog
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="text-sm font-semibold">Resources</h3>
              <ul className="mt-4 space-y-3">
                <li>
                  <Link
                    href="https://docs.flatwp.com"
                    className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                  >
                    Documentation
                  </Link>
                </li>
                <li>
                  <Link
                    href="https://github.com/flatwp"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                  >
                    GitHub
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </div>

        <div className="mt-12 border-t border-border/40 pt-8">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-sm text-muted-foreground">
              &copy; {new Date().getFullYear()} FlatWP. All rights reserved. MIT License.
            </p>

            <Link
              href="https://github.com/flatwp"
              target="_blank"
              rel="noopener noreferrer"
              className="group flex items-center gap-3 text-sm transition-all hover:scale-105"
            >
              <div className="flex items-center gap-2 text-muted-foreground">
                <span>Love what we're building?</span>
                <span className="hidden sm:inline">Show your support with a star on GitHub</span>
                <span className="sm:hidden">Star us on GitHub</span>
              </div>
              <div className="flex items-center gap-2 rounded-full bg-muted px-3 py-1.5 transition-colors group-hover:bg-muted/80">
                <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                <Github className="h-4 w-4" />
              </div>
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
