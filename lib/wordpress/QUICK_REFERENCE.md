# WordPress GraphQL Quick Reference

## Import Statements

```typescript
import { getAllPosts, getPostBySlug, getAllPostSlugs, getPostsForSearchIndex } from '@/lib/wordpress/queries';
import { Post } from '@/lib/wordpress/adapters/post';
```

## Query Functions

### getAllPosts()
```typescript
const posts: Post[] = await getAllPosts();
// ISR: 5 minutes
// Returns: Array of Post objects
```

### getPostBySlug()
```typescript
const post: Post | null = await getPostBySlug('my-slug');
// ISR: 1 minute
// Returns: Post object or null
```

### getAllPostSlugs()
```typescript
const slugs: string[] = await getAllPostSlugs();
// ISR: 1 hour
// Returns: Array of post slugs
// Usage: generateStaticParams()
```

### getPostsForSearchIndex()
```typescript
const searchData = await getPostsForSearchIndex();
// ISR: 1 hour
// Returns: Minimal post data for search
```

## Post Type

```typescript
interface Post {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  date: string;
  author: {
    name: string;
    avatar?: string;
  };
  featuredImage?: {
    url: string;
    alt: string;
    width: number;
    height: number;
  };
  categories: string[];
}
```

## Common Patterns

### Blog Index Page
```typescript
export default async function BlogPage() {
  const posts = await getAllPosts();
  return <div>{posts.map(post => <Card key={post.id} post={post} />)}</div>;
}
```

### Single Post Page
```typescript
export async function generateStaticParams() {
  const slugs = await getAllPostSlugs();
  return slugs.map(slug => ({ slug }));
}

export default async function PostPage({ params }: { params: { slug: string } }) {
  const post = await getPostBySlug(params.slug);
  if (!post) notFound();
  return <article>{post.content}</article>;
}
```

### With Images
```typescript
import Image from 'next/image';

{post.featuredImage && (
  <Image
    src={post.featuredImage.url}
    alt={post.featuredImage.alt}
    width={post.featuredImage.width}
    height={post.featuredImage.height}
  />
)}
```

## Commands

```bash
# Generate types from GraphQL schema
npm run graphql:codegen

# Type check
npm run type-check

# Build
npm run build

# Dev server
npm run dev
```

## ISR Configuration

| Function | Revalidation | Use Case |
|----------|--------------|----------|
| getAllPosts | 300s (5min) | Blog listing |
| getPostBySlug | 60s (1min) | Individual posts |
| getAllPostSlugs | 3600s (1hr) | Static generation |
| getPostsForSearchIndex | 3600s (1hr) | Search index |

## Environment Variables

```env
NEXT_PUBLIC_WORDPRESS_API_URL=https://cms.flatwp.com/graphql
REVALIDATION_SECRET=your-secret-here
PREVIEW_SECRET=another-secret
```

## File Locations

```
lib/wordpress/
├── __generated__/      # Auto-generated types
├── adapters/post.ts    # Post type definition
├── client/apollo.ts    # Apollo Client setup
└── queries.ts          # Query functions ← USE THIS

graphql/
├── queries/            # GraphQL queries
│   ├── posts.graphql
│   ├── slugs.graphql
│   └── search.graphql
└── schema.graphql      # Local schema fallback
```

## Error Handling

```typescript
try {
  const posts = await getAllPosts();
} catch (error) {
  console.error('Failed to fetch posts:', error);
  // Handle error appropriately
}
```

## Next Steps

1. Create blog pages: `/app/blog/page.tsx`, `/app/blog/[slug]/page.tsx`
2. Build UI components: BlogPostCard, PostHeader, etc.
3. Implement search functionality
4. Add SEO metadata with generateMetadata()
5. Test with real WordPress data once endpoint is ready

## Help & Documentation

- Full docs: `lib/wordpress/README.md`
- Examples: `lib/wordpress/USAGE_EXAMPLES.md`
- Summary: `INTEGRATION_SUMMARY.md`
