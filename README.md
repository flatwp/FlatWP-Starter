# FlatWP Starter

**Modern headless WordPress starter kit** built with Next.js 15, TypeScript, and TailwindCSS. Combines WordPress's powerful content management with Next.js's advanced rendering strategies (ISR, static generation, server components) for exceptional performance.

## Features

- ⚡ **Next.js 15** with App Router and Server Components
- 🎨 **TailwindCSS v4** for modern, utility-first styling
- 📝 **TypeScript** strict mode for type safety
- 🔄 **ISR with on-demand revalidation** for fresh content without rebuilds
- 🔍 **Client-side search** with Fuse.js
- 🎯 **GraphQL** with full type generation via GraphQL Code Generator
- 🖼️ **Optimized images** with automatic WebP/AVIF conversion
- 📱 **Responsive design** mobile-first approach
- 🔒 **Preview mode** for draft content
- 🎨 **Shadcn/ui components** with Radix UI primitives
- 📊 **SEO optimized** with automatic sitemaps and meta tags
- 🔧 **ACF block support** for flexible content layouts

## Prerequisites

- **Node.js** 18+ and npm 9+
- **WordPress** 6.4+ with the following plugins:
  - [WPGraphQL](https://www.wpgraphql.com/) (required)
  - [WPGraphQL CORS](https://github.com/funkhaus/wp-graphql-cors) (recommended)
  - [FlatWP Companion](https://github.com/flatwp/FlatWP-Plugin) (recommended for webhooks)
  - [Advanced Custom Fields PRO](https://www.advancedcustomfields.com/pro/) (optional, for ACF blocks)

## Quick Start

### 1. Clone or Use This Template

```bash
# Clone the repository
git clone https://github.com/flatwp/FlatWP-Starter.git my-project
cd my-project

# Or use as GitHub template
# Click "Use this template" on GitHub
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Configure Environment Variables

Copy the example environment file and update with your WordPress site details:

```bash
cp .env.example .env.local
```

Edit `.env.local`:

```env
# WordPress GraphQL endpoint (required)
NEXT_PUBLIC_WORDPRESS_API_URL=https://your-wordpress-site.com/graphql

# Site URL (required for absolute URLs)
NEXT_PUBLIC_SITE_URL=http://localhost:3010

# Revalidation secret (required for on-demand ISR)
REVALIDATION_SECRET=your-random-secret-here

# Preview mode secret (required for draft previews)
PREVIEW_SECRET=another-random-secret-here

# Optional: Resend API for newsletter functionality
RESEND_API_KEY=your-resend-api-key
RESEND_FROM_EMAIL=noreply@yourdomain.com
RESEND_AUDIENCE_EMAIL=your-audience-id

# Optional: Enable debug logging
DEBUG=false
```

### 4. Generate GraphQL Types

Run GraphQL Code Generator to create TypeScript types from your WordPress schema:

```bash
npm run graphql:codegen
```

This will:
- Introspect your WordPress GraphQL schema
- Generate TypeScript types in `lib/wordpress/__generated__/`
- Enable full type safety for all queries

### 5. Start Development Server

```bash
npm run dev
```

Visit [http://localhost:3010](http://localhost:3010) to see your site.

## WordPress Setup

### Install Required Plugins

1. **WPGraphQL** (required)
   - Install from WordPress.org or download from [wpgraphql.com](https://www.wpgraphql.com/)
   - Activate and configure GraphQL endpoint

2. **FlatWP Companion** (recommended)
   - Download from [FlatWP Plugin releases](https://github.com/flatwp/FlatWP-Plugin/releases)
   - Configure webhook settings for automatic revalidation

3. **Advanced Custom Fields PRO** (optional)
   - Required if using ACF Flexible Content blocks
   - Import block definitions from `wordpress-setup/acf-flexible-content-blocks.json`

### Import Demo Content (Optional)

To get started quickly with example pages and posts:

```bash
# In WordPress admin
# Tools → Import → WordPress
# Upload: wordpress-setup/flatwp-demo-pages.xml
```

### Configure FlatWP Companion

In WordPress admin (Settings → FlatWP):

1. **Next.js Site URL**: `http://localhost:3010` (or your production URL)
2. **Revalidation Secret**: Same value as `REVALIDATION_SECRET` in `.env.local`
3. **Enable Webhooks**: Check this box to enable automatic revalidation

## Project Structure

```
flatwp-starter/
├── app/                          # Next.js App Router pages
│   ├── (pages)/[slug]/          # Static pages
│   ├── blog/                    # Blog routes
│   │   ├── [slug]/             # Single post
│   │   ├── author/[slug]/      # Author archive
│   │   ├── category/[slug]/    # Category archive
│   │   ├── tag/[slug]/         # Tag archive
│   │   └── page/[page]/        # Pagination
│   └── api/                     # API routes
│       ├── preview/            # Preview mode
│       ├── revalidate/         # ISR webhook
│       └── search-index/       # Search index generation
├── components/
│   ├── blocks/                 # ACF block components
│   ├── blog/                   # Blog-specific components
│   ├── layout/                 # Layout components (header, footer)
│   └── ui/                     # Shadcn UI components
├── lib/
│   ├── wordpress/              # WordPress GraphQL client
│   │   ├── adapters/          # Data adapters
│   │   ├── client/            # Apollo client setup
│   │   └── __generated__/     # Generated GraphQL types
│   ├── search/                # Client-side search
│   ├── utils/                 # Utility functions
│   └── validations/           # Zod schemas
├── graphql/
│   ├── queries/               # GraphQL queries
│   ├── fragments/             # Reusable fragments
│   └── schema.graphql         # GraphQL schema
├── config/
│   └── rendering-strategy.ts  # ISR and rendering configuration
├── public/                    # Static assets
└── wordpress-setup/           # WordPress configuration files
    ├── ACF_BLOCKS_SETUP.md   # ACF setup guide
    ├── acf-flexible-content-blocks.json
    └── flatwp-demo-pages.xml
```

## Development Workflow

### Creating New Content Types

1. **Add GraphQL query** in `graphql/queries/your-type.graphql`
2. **Generate types**: `npm run graphql:codegen`
3. **Create adapter** in `lib/wordpress/adapters/your-type.ts`
4. **Add page component** in `app/your-type/[slug]/page.tsx`
5. **Configure rendering strategy** in `config/rendering-strategy.ts`

### Adding ACF Blocks

1. **Define block in WordPress ACF**
2. **Create component** in `components/blocks/YourBlock.tsx`
3. **Register in block renderer** in `components/blocks/block-renderer.tsx`
4. **Import ACF JSON** (if exporting from another site)

### Customizing Styling

This project uses **TailwindCSS v4** and **Shadcn/ui**:

- **Modify theme**: Edit `tailwind.config.ts`
- **Update colors**: Edit CSS variables in `app/globals.css`
- **Add components**: Use `npx shadcn@latest add <component-name>`

## Deployment

### Deploy to Vercel (Recommended)

1. **Push to GitHub**:
   ```bash
   git remote add origin https://github.com/your-username/your-repo.git
   git push -u origin main
   ```

2. **Import to Vercel**:
   - Go to [vercel.com/new](https://vercel.com/new)
   - Import your GitHub repository
   - Vercel will auto-detect Next.js settings

3. **Configure Environment Variables**:
   - Add all variables from `.env.local`
   - **Important**: Use production WordPress URL for `NEXT_PUBLIC_WORDPRESS_API_URL`
   - Generate new secrets for production

4. **Update WordPress Webhook**:
   - In FlatWP Companion settings
   - Set Next.js URL to your Vercel URL (e.g., `https://your-site.vercel.app`)
   - Update revalidation secret

5. **Deploy**:
   - Vercel will automatically deploy
   - Subsequent pushes to `main` branch auto-deploy

### Deploy to Netlify

1. **Add `netlify.toml`**:
   ```toml
   [build]
     command = "npm run build"
     publish = ".next"

   [[plugins]]
     package = "@netlify/plugin-nextjs"
   ```

2. **Import to Netlify**:
   - Connect your Git repository
   - Set build command: `npm run build`
   - Set publish directory: `.next`

3. **Configure environment variables** in Netlify dashboard

### Other Hosting Providers

FlatWP Starter can be deployed to any platform supporting Next.js:

- **AWS Amplify**
- **Cloudflare Pages**
- **Digital Ocean App Platform**
- **Custom Node.js server** (use `npm run build && npm run start`)

See [Next.js Deployment docs](https://nextjs.org/docs/app/building-your-application/deploying) for more options.

## Performance Optimization

### Rendering Strategies

FlatWP uses **intelligent rendering strategies** per content type:

```typescript
// config/rendering-strategy.ts
export const RENDERING_STRATEGY = {
  pages: {
    revalidate: false, // Fully static
  },
  posts: {
    revalidate: 'on-demand', // Revalidate via webhook
  },
  archives: {
    revalidate: 300, // 5 minutes
  },
};
```

### Image Optimization

- All WordPress images are automatically optimized via `next/image`
- WebP/AVIF conversion
- Responsive srcsets
- Lazy loading

### Performance Targets

- **Lighthouse Score**: 95+ across all metrics
- **LCP**: <2.5s on 3G
- **CLS**: <0.1
- **FID**: <100ms
- **Initial JS**: <200KB pre-gzip

## Troubleshooting

### GraphQL Types Not Generating

**Problem**: `npm run graphql:codegen` fails

**Solution**:
1. Verify WordPress GraphQL endpoint is accessible
2. Check `.env.local` has correct `NEXT_PUBLIC_WORDPRESS_API_URL`
3. Ensure WPGraphQL plugin is activated
4. Try: `export NEXT_PUBLIC_WORDPRESS_API_URL=https://your-site.com/graphql && npm run graphql:codegen`

### Revalidation Not Working

**Problem**: Content updates in WordPress don't reflect on site

**Solution**:
1. Verify FlatWP Companion plugin is installed and activated
2. Check webhook settings match your site URL
3. Ensure `REVALIDATION_SECRET` matches in both WordPress and `.env.local`
4. Check Vercel logs for webhook calls

### Preview Mode Not Working

**Problem**: Preview button in WordPress shows stale content

**Solution**:
1. Verify `PREVIEW_SECRET` is set in `.env.local`
2. Check FlatWP Companion preview settings
3. Ensure draft posts are accessible via GraphQL (check WPGraphQL settings)

### Images Not Loading

**Problem**: WordPress images show broken

**Solution**:
1. Check WordPress media library URLs are accessible
2. Verify Next.js image domains in `next.config.ts`:
   ```typescript
   images: {
     remotePatterns: [
       {
         protocol: 'https',
         hostname: 'your-wordpress-site.com',
       },
     ],
   }
   ```

## Scripts Reference

```bash
# Development
npm run dev          # Start dev server on port 3010
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
npm run type-check   # Run TypeScript checking

# GraphQL
npm run graphql:codegen  # Generate GraphQL types

# Maintenance
npm run clean        # Remove build artifacts and dependencies
```

## Contributing

Contributions are welcome! Please see [CONTRIBUTING.md](https://github.com/flatwp/FlatWP-Starter/blob/main/CONTRIBUTING.md) for guidelines.

## License

MIT License - see [LICENSE](LICENSE) for details.

## Support

- **Documentation**: [flatwp.com/docs](https://flatwp.com/docs)
- **Issues**: [GitHub Issues](https://github.com/flatwp/FlatWP-Starter/issues)
- **Community**: [Discord](https://discord.gg/flatwp) (coming soon)

## Credits

Built with:
- [Next.js](https://nextjs.org/)
- [WordPress](https://wordpress.org/)
- [WPGraphQL](https://www.wpgraphql.com/)
- [TailwindCSS](https://tailwindcss.com/)
- [Shadcn/ui](https://ui.shadcn.com/)
- [TypeScript](https://www.typescriptlang.org/)

---

**Made with ❤️ by the FlatWP team**
