import { NextRequest, NextResponse } from 'next/server';

export function middleware(request: NextRequest) {
  const origin = request.headers.get('origin');
  const reqHeaders = request.headers.get('access-control-request-headers');

  // When request has an origin, echo back the origin to support credentials (cookies/auth)
  const allowedOrigin = origin || '*';

  // Handle CORS Preflight OPTIONS requests immediately at the edge
  if (request.method === 'OPTIONS') {
    const preflightHeaders = new Headers({
      'Access-Control-Allow-Origin': allowedOrigin,
      'Access-Control-Allow-Credentials': 'true',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, PATCH, DELETE, OPTIONS, HEAD',
      'Access-Control-Allow-Headers':
        reqHeaders ||
        'Content-Type, Authorization, X-Playground-Identity, X-Simulate-Delay, X-Simulate-Status, X-Simulate-Chaos, X-Simulate-RateLimit, X-Simulate-JWT-Expiry, X-Requested-With, Accept, Origin, Cache-Control, Pragma',
      'Access-Control-Expose-Headers':
        'X-Playground-Identity, X-Total-Count, X-Page, X-Limit, X-Total-Pages, Content-Range, Location',
      'Access-Control-Max-Age': '86400',
    });

    return new NextResponse(null, {
      status: 204,
      headers: preflightHeaders,
    });
  }

  // Process standard requests (GET, POST, PUT, PATCH, DELETE)
  const response = NextResponse.next();

  if (origin) {
    response.headers.set('Access-Control-Allow-Origin', origin);
    response.headers.set('Access-Control-Allow-Credentials', 'true');
    response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE, OPTIONS, HEAD');
    response.headers.set(
      'Access-Control-Expose-Headers',
      'X-Playground-Identity, X-Total-Count, X-Page, X-Limit, X-Total-Pages, Content-Range, Location'
    );
  }

  return response;
}

export const config = {
  matcher: ['/api/:path*'],
};
