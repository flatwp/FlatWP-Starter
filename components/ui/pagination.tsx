import * as React from "react";
import Link from "next/link";
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/24/outline";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";

export interface PaginationProps {
  currentPage: number;
  totalPages: number;
  basePath: string;
}

/**
 * Pagination Component
 *
 * Provides accessible pagination navigation with smart ellipsis for large page counts.
 * Shows max 7 page numbers with intelligent ellipsis positioning.
 *
 * @param currentPage - The active page number (1-indexed)
 * @param totalPages - Total number of pages
 * @param basePath - Base URL path (e.g., "/blog", "/category/engineering")
 */
export function Pagination({ currentPage, totalPages, basePath }: PaginationProps) {
  // Don't render if only one page
  if (totalPages <= 1) return null;

  const getPageNumbers = (): (number | "ellipsis")[] => {
    const pages: (number | "ellipsis")[] = [];
    const maxVisible = 7;

    // If we have fewer pages than max visible, show all
    if (totalPages <= maxVisible) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }

    // Always show first page
    pages.push(1);

    // Logic for ellipsis placement
    if (currentPage <= 3) {
      // Near start: [1] 2 3 4 5 ... last
      for (let i = 2; i <= Math.min(5, totalPages - 1); i++) {
        pages.push(i);
      }
      pages.push("ellipsis");
      pages.push(totalPages);
    } else if (currentPage >= totalPages - 2) {
      // Near end: 1 ... last-4 last-3 last-2 last-1 [last]
      pages.push("ellipsis");
      for (let i = Math.max(2, totalPages - 4); i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      // In middle: 1 ... current-1 [current] current+1 ... last
      pages.push("ellipsis");
      pages.push(currentPage - 1);
      pages.push(currentPage);
      pages.push(currentPage + 1);
      pages.push("ellipsis");
      pages.push(totalPages);
    }

    return pages;
  };

  const pageNumbers = getPageNumbers();
  const hasPrevious = currentPage > 1;
  const hasNext = currentPage < totalPages;

  // Helper to build page URL
  const getPageUrl = (page: number): string => {
    if (page === 1) {
      return basePath;
    }
    return `${basePath}/page/${page}`;
  };

  return (
    <nav
      role="navigation"
      aria-label="Pagination"
      className="flex items-center justify-center gap-1 mt-12"
    >
      {/* Previous Button */}
      {hasPrevious ? (
        <Link
          href={getPageUrl(currentPage - 1)}
          className={cn(
            buttonVariants({ variant: "outline", size: "icon" }),
            "w-10 h-10"
          )}
          aria-label="Go to previous page"
        >
          <ChevronLeftIcon className="h-4 w-4" />
        </Link>
      ) : (
        <button
          disabled
          aria-disabled="true"
          className={cn(
            buttonVariants({ variant: "outline", size: "icon" }),
            "w-10 h-10 opacity-50 cursor-not-allowed"
          )}
          aria-label="Previous page (disabled)"
        >
          <ChevronLeftIcon className="h-4 w-4" />
        </button>
      )}

      {/* Page Numbers */}
      <div className="flex items-center gap-1">
        {pageNumbers.map((pageNum, index) => {
          if (pageNum === "ellipsis") {
            return (
              <span
                key={`ellipsis-${index}`}
                className="px-2 text-muted-foreground"
                aria-hidden="true"
              >
                ...
              </span>
            );
          }

          const isCurrentPage = pageNum === currentPage;

          return isCurrentPage ? (
            <button
              key={pageNum}
              aria-current="page"
              aria-label={`Page ${pageNum} (current)`}
              className={cn(
                buttonVariants({ variant: "default", size: "icon" }),
                "w-10 h-10"
              )}
            >
              {pageNum}
            </button>
          ) : (
            <Link
              key={pageNum}
              href={getPageUrl(pageNum)}
              className={cn(
                buttonVariants({ variant: "outline", size: "icon" }),
                "w-10 h-10 hover:bg-accent"
              )}
              aria-label={`Go to page ${pageNum}`}
            >
              {pageNum}
            </Link>
          );
        })}
      </div>

      {/* Next Button */}
      {hasNext ? (
        <Link
          href={getPageUrl(currentPage + 1)}
          className={cn(
            buttonVariants({ variant: "outline", size: "icon" }),
            "w-10 h-10"
          )}
          aria-label="Go to next page"
        >
          <ChevronRightIcon className="h-4 w-4" />
        </Link>
      ) : (
        <button
          disabled
          aria-disabled="true"
          className={cn(
            buttonVariants({ variant: "outline", size: "icon" }),
            "w-10 h-10 opacity-50 cursor-not-allowed"
          )}
          aria-label="Next page (disabled)"
        >
          <ChevronRightIcon className="h-4 w-4" />
        </button>
      )}
    </nav>
  );
}
