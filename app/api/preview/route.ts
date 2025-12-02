import { draftMode } from 'next/headers';
import { redirect } from 'next/navigation';
import { NextRequest, NextResponse } from 'next/server';

/**
 * Preview API Route
 * Handles preview mode for draft/scheduled content
 *
 * Flow:
 * 1. WordPress editor clicks "Preview in Next.js" button
 * 2. WordPress generates preview URL with token and post ID
 * 3. This route validates the token with WordPress
 * 4. If valid, enables draft mode and redirects to post URL
 * 5. Post page detects draft mode and fetches draft content
 */
export async function GET(request: NextRequest) {
  // Get URL parameters
  const searchParams = request.nextUrl.searchParams;
  const secret = searchParams.get('secret');
  const token = searchParams.get('token');
  const id = searchParams.get('id');
  const postType = searchParams.get('type') || 'post';

  // Validate required parameters
  if (!secret || !token || !id) {
    return NextResponse.json(
      { error: 'Missing required parameters: secret, token, id' },
      { status: 400 }
    );
  }

  // Verify preview secret
  if (secret !== process.env.PREVIEW_SECRET) {
    return NextResponse.json(
      { error: 'Invalid preview secret' },
      { status: 401 }
    );
  }

  // Validate token with WordPress
  try {
    const wordpressUrl = process.env.NEXT_PUBLIC_WORDPRESS_API_URL?.replace(
      '/graphql',
      ''
    );

    if (!wordpressUrl) {
      return NextResponse.json(
        { error: 'WordPress URL not configured' },
        { status: 500 }
      );
    }

    const validateResponse = await fetch(
      `${wordpressUrl}/wp-json/flatwp/v1/preview/validate`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ token }),
      }
    );

    if (!validateResponse.ok) {
      return NextResponse.json(
        { error: 'Invalid or expired preview token' },
        { status: 401 }
      );
    }

    const validationData = await validateResponse.json();

    // Verify post ID matches
    if (validationData.post_id !== parseInt(id)) {
      return NextResponse.json(
        { error: 'Post ID mismatch' },
        { status: 400 }
      );
    }

    // Get post slug for redirect
    const slug = validationData.slug || searchParams.get('slug');

    if (!slug) {
      return NextResponse.json(
        { error: 'Post slug not provided' },
        { status: 400 }
      );
    }

    // Enable draft mode
    (await draftMode()).enable();

    // Determine redirect path based on post type
    let redirectPath: string;
    switch (postType) {
      case 'page':
        redirectPath = `/${slug}`;
        break;
      case 'post':
      default:
        redirectPath = `/blog/${slug}`;
        break;
    }

    // Redirect to the post with draft mode enabled
    redirect(redirectPath);
  } catch (error) {
    console.error('Preview validation error:', error);
    return NextResponse.json(
      { error: 'Failed to validate preview token' },
      { status: 500 }
    );
  }
}
