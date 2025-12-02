import * as React from "react";
import Link from "next/link";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center rounded-full text-xs font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
  {
    variants: {
      variant: {
        default:
          "bg-primary/10 text-primary hover:bg-primary/20",
        secondary:
          "bg-secondary text-secondary-foreground hover:bg-secondary/80",
        outline:
          "border border-border bg-transparent hover:bg-accent",
        destructive:
          "bg-destructive/10 text-destructive hover:bg-destructive/20",
      },
      size: {
        default: "px-3 py-1",
        sm: "px-2 py-0.5",
        lg: "px-4 py-1.5",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {
  href?: string;
  asChild?: boolean;
}

function Badge({ className, variant, size, href, children, ...props }: BadgeProps) {
  const badgeClasses = cn(badgeVariants({ variant, size }), className);

  // If href is provided, render as Link
  if (href) {
    return (
      <Link
        href={href}
        className={badgeClasses}
      >
        {children}
      </Link>
    );
  }

  // Otherwise render as div
  return (
    <div className={badgeClasses} {...props}>
      {children}
    </div>
  );
}

export { Badge, badgeVariants };
