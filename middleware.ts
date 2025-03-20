import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  // Log all API requests (in a real application, you might use a more sophisticated logger)
  if (request.nextUrl.pathname.startsWith('/api/')) {
    console.log(`[API Request] ${request.method} ${request.nextUrl.pathname}`);
  }

  // Example of adding custom headers to API responses
  if (request.nextUrl.pathname.startsWith('/api/')) {
    const response = NextResponse.next();
    response.headers.set('X-DealFinder-Version', '1.0.0');
    return response;
  }

  // Example of protection for admin routes (in a real app, you'd check for authentication)
  // This is simplified as we're using client-side auth with localStorage in this demo
  if (request.nextUrl.pathname.startsWith('/admin')) {
    // In a real application, you'd verify the token or session here
    // For now, we'll let the client-side auth handle this
    const response = NextResponse.next();
    response.headers.set('X-Admin-Route', 'true');
    return response;
  }

  return NextResponse.next();
}

// Configure which paths the middleware should run on
export const config = {
  matcher: [
    '/api/:path*',
    '/admin/:path*'
  ],
};
