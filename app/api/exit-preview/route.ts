import { draftMode } from 'next/headers';
import { redirect } from 'next/navigation';
import { NextRequest } from 'next/server';

/**
 * Exit Preview API Route
 * Disables preview/draft mode and redirects to a safe page
 */
export async function GET(request: NextRequest) {
  // Disable draft mode
  (await draftMode()).disable();

  // Get redirect URL from query params or default to homepage
  const searchParams = request.nextUrl.searchParams;
  const redirectTo = searchParams.get('redirect') || '/';

  // Redirect to the specified page or homepage
  redirect(redirectTo);
}
