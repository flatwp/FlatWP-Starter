"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import type { SearchIndexPost } from "@/lib/wordpress/queries";
import { stripHtml } from "@/lib/utils/text";

interface BlogSearchProps {
  searchIndex: SearchIndexPost[];
}

export function BlogSearch({ searchIndex }: BlogSearchProps) {
  const [searchQuery, setSearchQuery] = useState("");

  // Filter posts based on search query
  const filteredPosts = useMemo(() => {
    if (!searchQuery.trim()) return [];

    const query = searchQuery.toLowerCase();

    return searchIndex
      .filter((post) => {
        // Search in title
        if (post.title.toLowerCase().includes(query)) return true;

        // Search in excerpt
        const cleanExcerpt = stripHtml(post.excerpt || '').toLowerCase();
        if (cleanExcerpt.includes(query)) return true;

        // Search in category names
        if (post.categories.some((cat) => cat.name.toLowerCase().includes(query))) return true;

        // Search in tag names
        if (post.tags.some((tag) => tag.name.toLowerCase().includes(query))) return true;

        return false;
      })
      .slice(0, 10); // Limit to 10 results
  }, [searchIndex, searchQuery]);

  return (
    <div className="bg-card rounded-lg p-6 border border-border">
      <h3 className="text-lg font-semibold mb-4">Search Posts</h3>
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input
          placeholder="Search all posts..."
          className="pl-10"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      {/* Search Results */}
      {searchQuery && (
        <div className="mt-4 space-y-2">
          {filteredPosts.length > 0 ? (
            <>
              <p className="text-sm text-muted-foreground mb-2">
                Found {filteredPosts.length} {filteredPosts.length === 1 ? 'post' : 'posts'}
              </p>
              {filteredPosts.map((post) => (
                <Link
                  key={post.id}
                  href={`/blog/${post.slug}`}
                  className="block text-sm hover:text-primary transition-colors py-1"
                  onClick={() => setSearchQuery("")}
                >
                  {post.title}
                </Link>
              ))}
            </>
          ) : (
            <p className="text-sm text-muted-foreground">No posts found</p>
          )}
        </div>
      )}
    </div>
  );
}
