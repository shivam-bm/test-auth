import { NextRequest, NextResponse } from 'next/server';

// Get allowed origins from environment variables
const getAllowedOrigins = (): string[] => {
  // Get from environment or fall back to default
  const origins = (process.env.TRUSTED_ORIGINS || '').split(',').filter(Boolean);
  
  // Add development origin if in development mode
  if (process.env.NODE_ENV !== 'production') {
    origins.push('http://localhost:3001');
  } else {
    // In production, always allow the Vercel deployment URL
    origins.push('https://test-auth-one-beta.vercel.app');
  }
  
  return origins;
};

// This middleware function will run for all requests
export function middleware(request: NextRequest) {
  // Get the pathname of the request
  const path = request.nextUrl.pathname;

  // Only apply CORS headers for OAuth-related API endpoints
  if (path.startsWith('/api/auth/oauth2') || path === '/api/auth/oauth2/register') {
    // Get the origin from the request
    const requestOrigin = request.headers.get('origin');
    const allowedOrigins = getAllowedOrigins();
    
    // Check if the origin is allowed
    const isAllowedOrigin = requestOrigin && allowedOrigins.includes(requestOrigin);
    const origin = isAllowedOrigin ? requestOrigin : (process.env.NODE_ENV === 'production' ? allowedOrigins[0] : '*');
    
    // Handle preflight requests
    if (request.method === 'OPTIONS') {
      return new NextResponse(null, {
        status: 200,
        headers: {
          ...(origin && { 'Access-Control-Allow-Origin': origin }),
          'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Requested-With',
          'Access-Control-Allow-Credentials': 'true',
          'Access-Control-Max-Age': process.env.CORS_MAX_AGE || '86400', // 24 hours
          // Add security headers
          'X-Content-Type-Options': 'nosniff',
          'X-Frame-Options': 'DENY',
          'X-XSS-Protection': '1; mode=block',
        },
      });
    }

    // For actual requests, proceed with the request but modify response in our NextResponse.next()
    const response = NextResponse.next();
    
    // Add CORS headers to the response
    if (origin) {
      response.headers.set('Access-Control-Allow-Origin', origin);
      response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
      response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With');
      response.headers.set('Access-Control-Allow-Credentials', 'true');
    }
    
    // Add security headers
    response.headers.set('X-Content-Type-Options', 'nosniff');
    response.headers.set('X-Frame-Options', 'DENY');
    response.headers.set('X-XSS-Protection', '1; mode=block');
    
    return response;
  }

  // For other routes, continue normally
  return NextResponse.next();
}

// Configure the middleware to only run on API routes
export const config = {
  matcher: ['/api/:path*'],
}; 