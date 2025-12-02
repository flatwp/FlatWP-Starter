# FlatWP ACF Blocks Setup Guide

This guide explains how to set up ACF Flexible Content blocks in WordPress to work with the Next.js block system.

## Prerequisites

1. **WordPress** 6.4+ installed
2. **WPGraphQL** plugin installed and activated
3. **WPGraphQL for Advanced Custom Fields** plugin installed
4. **Advanced Custom Fields Pro** plugin installed (required for Flexible Content)

## Installation Steps

### Step 1: Install Required WordPress Plugins

```bash
# Via WordPress Admin
1. Go to Plugins → Add New
2. Search and install: "WPGraphQL"
3. Search and install: "WPGraphQL for Advanced Custom Fields"
4. Purchase and install: ACF Pro (https://www.advancedcustomfields.com/pro/)
```

### Step 2: Import ACF Field Group

1. Go to **Custom Fields → Tools** in WordPress admin
2. Click **Import Field Groups**
3. Upload `acf-flexible-content-blocks.json` from this directory
4. Click **Import File**

The field group will create a "Flexible Content" field with 8 block layouts:
- Hero Centered
- Hero Split
- Features Grid
- Pricing
- CTA Simple
- CTA Boxed
- Testimonials
- Content Section

### Step 3: Import Demo Content (Optional)

1. Go to **Tools → Import** in WordPress admin
2. Install **WordPress Importer** if not already installed
3. Upload `flatwp-demo-pages.xml` from this directory
4. Click **Upload file and import**
5. Assign content to an existing user or create new user
6. Click **Submit**

This will create 4 demo pages:
- Homepage (Hero + Features + CTA)
- About Us (Hero + Content + Testimonials)
- Pricing (Hero + Pricing + CTA)
- Services (Hero + Features + Content + CTA)

### Step 4: Configure WPGraphQL

1. Go to **GraphQL → Settings**
2. Enable "Enable GraphQL Debug Mode" (for development)
3. Save settings

### Step 5: Test GraphQL Query

Go to **GraphQL → GraphiQL IDE** and run:

```graphql
query TestBlocks {
  pages(first: 1) {
    nodes {
      title
      slug
      flexibleContent {
        ... on Page_Flexiblecontent_FlexibleContent_HeroCentered {
          fieldGroupName
          heading
          subheading
        }
      }
    }
  }
}
```

If this returns data, your setup is correct!

### Step 6: Rebuild Next.js App

```bash
# In your Next.js project directory
npm run graphql:codegen  # Regenerate GraphQL types
npm run build            # Rebuild application
npm run dev              # Start development server
```

### Step 7: Test Pages

Visit your Next.js site:
- `http://localhost:3000/homepage` - Should show demo homepage with blocks
- `http://localhost:3000/about-us` - Should show about page with blocks
- `http://localhost:3000/pricing` - Should show pricing page with blocks

## Creating New Pages with Blocks

1. In WordPress admin, go to **Pages → Add New**
2. Enter page title and slug
3. Scroll to **Flexible Content** meta box
4. Click **Add Row** and select a block layout
5. Fill in block fields
6. Add more blocks as needed
7. Click **Publish**
8. Page will be available at `your-site.com/[slug]` after ISR revalidation (1 hour)

## Block Field Reference

### Hero Centered
- **Heading** (text): Main hero heading
- **Subheading** (text): Supporting text
- **CTA Text** (text): Button text
- **CTA Link** (text): Button URL

### Hero Split
- **Heading** (text): Main hero heading
- **Subheading** (text): Supporting text
- **CTA Text** (text): Button text
- **CTA Link** (text): Button URL
- **Image** (image): Hero image
- **Image Position** (select): left | right

### Features Grid
- **Heading** (text): Section heading
- **Subheading** (text, optional): Section subheading
- **Features** (repeater):
  - Icon (text): Emoji or icon
  - Title (text): Feature title
  - Description (textarea): Feature description

### Pricing
- **Heading** (text): Section heading
- **Subheading** (text, optional): Section subheading
- **Tiers** (repeater):
  - Name (text): Tier name (e.g., "Starter")
  - Price (text): Price (e.g., "$9")
  - Period (text): Period (e.g., "month")
  - Description (textarea, optional): Tier description
  - Features (textarea): One feature per line
  - CTA Text (text): Button text
  - CTA Link (text): Button URL
  - Highlighted (true/false): Mark as popular

### CTA Simple
- **Heading** (text): CTA heading
- **Description** (textarea): CTA description
- **CTA Text** (text): Button text
- **CTA Link** (text): Button URL

### CTA Boxed
- **Heading** (text): CTA heading
- **Description** (textarea): CTA description
- **CTA Text** (text): Primary button text
- **CTA Link** (text): Primary button URL
- **Secondary CTA Text** (text, optional): Secondary button text
- **Secondary CTA Link** (text, optional): Secondary button URL

### Testimonials
- **Heading** (text): Section heading
- **Testimonials** (repeater):
  - Quote (textarea): Testimonial quote
  - Author (text): Author name
  - Role (text, optional): Job title
  - Company (text, optional): Company name
  - Image (image, optional): Author photo

### Content Section
- **Heading** (text): Section heading
- **Content** (WYSIWYG): Main content
- **Image** (image, optional): Section image
- **Image Position** (select): left | right | top | bottom
- **CTA Text** (text, optional): Button text
- **CTA Link** (text, optional): Button URL

## Troubleshooting

### GraphQL Types Not Generating
**Issue**: `npm run graphql:codegen` fails with "Unknown type" errors

**Solution**:
1. Ensure ACF field group is imported and published
2. Create at least one page with flexible content blocks
3. Run `npm run graphql:codegen` again

### Blocks Not Rendering
**Issue**: Page shows but blocks don't appear

**Solution**:
1. Check browser console for errors
2. Verify `flexibleContent` field exists in GraphQL query
3. Check WordPress page has blocks added
4. Clear Next.js cache: `rm -rf .next && npm run dev`

### Images Not Loading
**Issue**: Block images show broken

**Solution**:
1. Verify `NEXT_PUBLIC_WORDPRESS_API_URL` in `.env.local`
2. Check WordPress media URLs are accessible
3. Verify image optimization is configured

## Next Steps

- **Add Custom Blocks**: Create new block components in `components/blocks/`
- **Extend Field Group**: Add new layouts to ACF Flexible Content
- **Customize Styling**: Modify Tailwind classes in block components
- **Add Animations**: Use Framer Motion for block animations
- **Pro Features**: Build premium block library for FlatWP Pro

## Support

For issues with:
- **ACF Setup**: https://www.advancedcustomfields.com/resources/
- **WPGraphQL**: https://www.wpgraphql.com/docs/
- **FlatWP**: Create an issue on GitHub
