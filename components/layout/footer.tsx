import Link from "next/link";
import Image from "next/image";
import { Github, Twitter } from "lucide-react";

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
            <div className="mt-6 flex gap-4">
              <Link
                href="https://github.com/flatwp"
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground transition-colors hover:text-foreground"
                aria-label="GitHub"
              >
                <Github className="h-5 w-5" />
              </Link>
              <Link
                href="https://twitter.com/flatwp"
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground transition-colors hover:text-foreground"
                aria-label="Twitter"
              >
                <Twitter className="h-5 w-5" />
              </Link>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-8">
            <div>
              <h3 className="text-sm font-semibold">Product</h3>
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
                    href="#pricing"
                    className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                  >
                    Pricing
                  </Link>
                </li>
                <li>
                  <Link
                    href="https://docs.flatwp.com"
                    className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                  >
                    Documentation
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="text-sm font-semibold">Resources</h3>
              <ul className="mt-4 space-y-3">
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
                <li>
                  <Link
                    href="/blog"
                    className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                  >
                    Blog
                  </Link>
                </li>
                <li>
                  <Link
                    href="/support"
                    className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                  >
                    Support
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </div>

        <div className="mt-12 border-t border-border/40 pt-8">
          <p className="text-center text-sm text-muted-foreground">
            &copy; {new Date().getFullYear()} FlatWP. All rights reserved. MIT
            License.
          </p>
        </div>
      </div>
    </footer>
  );
}
