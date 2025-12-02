import { revalidatePath } from 'next/cache';
import { NextRequest, NextResponse } from 'next/server';

/**
 * Revalidation API Route
 * Handles webhook calls from WordPress to trigger on-demand ISR revalidation
 *
 * Supports two modes:
 * 1. Full rebuild: action="rebuild" - Clears entire site cache
 * 2. Path revalidation: paths=[] - Revalidates specific paths only
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { secret, paths, action } = body;

    // Verify secret matches environment variable
    if (secret !== process.env.REVALIDATION_SECRET) {
      return NextResponse.json({ error: 'Invalid secret' }, { status: 401 });
    }

    // Handle full site rebuild action
    if (action === 'rebuild') {
      try {
        console.log('[Revalidation] Full site rebuild requested');

        // Revalidate the entire site by clearing the root layout cache
        // This recursively clears all child pages and routes
        await revalidatePath('/', 'layout');

        console.log('[Revalidation] Full site cache cleared successfully');

        return NextResponse.json({
          rebuilt: true,
          timestamp: new Date().toISOString(),
          message: 'Full site cache cleared successfully',
        });
      } catch (error) {
        console.error('[Revalidation] Rebuild error:', error);
        return NextResponse.json(
          { error: 'Failed to rebuild site', details: String(error) },
          { status: 500 }
        );
      }
    }

    // Handle path-specific revalidation
    if (!paths || !Array.isArray(paths) || paths.length === 0) {
      return NextResponse.json(
        { error: 'Either action="rebuild" or paths array is required' },
        { status: 400 }
      );
    }

    console.log(`[Revalidation] Revalidating ${paths.length} paths:`, paths);

    // Revalidate requested paths
    const revalidated: string[] = [];
    const failed: { path: string; error: string }[] = [];

    for (const path of paths) {
      try {
        await revalidatePath(path);
        revalidated.push(path);
        console.log(`[Revalidation] ✓ ${path}`);
      } catch (error) {
        const errorMsg = String(error);
        console.error(`[Revalidation] ✗ ${path}:`, errorMsg);
        failed.push({ path, error: errorMsg });
      }
    }

    return NextResponse.json({
      revalidated: true,
      paths: revalidated,
      failed: failed.length > 0 ? failed : undefined,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error('[Revalidation] Unexpected error:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: String(error) },
      { status: 500 }
    );
  }
}
