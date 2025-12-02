import { NextResponse } from 'next/server';

/**
 * Health Check API Route
 * Used by WordPress plugin to verify Next.js connectivity
 */
export async function GET() {
  return NextResponse.json({
    status: 'ok',
    service: 'flatwp-nextjs',
    timestamp: new Date().toISOString(),
    version: process.env.npm_package_version || '1.0.0',
  });
}

// Allow both GET and HEAD requests for health checks
export async function HEAD() {
  return new NextResponse(null, { status: 200 });
}
