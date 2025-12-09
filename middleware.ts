import { NextRequest, NextResponse } from 'next/server';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Block access to sensitive files
  if (pathname.includes('.env') || 
      pathname.includes('config.json') || 
      pathname.includes('/logs/') ||
      pathname.includes('.git/')) {
    return NextResponse.json({ 
      error: 'Access denied' 
    }, { status: 403 });
  }

  // Let client-side authentication handle admin route protection
  // Only protect API routes at middleware level
  if (pathname.startsWith('/api/admin') && !pathname.includes('/api/admin/auth')) {
    try {
      let tokenValue: string | undefined;

      // Try to get token from Authorization header first
      const authHeader = request.headers.get('Authorization');
      if (authHeader && authHeader.startsWith('Bearer ')) {
        tokenValue = authHeader.substring(7);
      } else {
        // Fallback to cookie
        const adminToken = request.cookies.get('admin-token');
        tokenValue = adminToken?.value;
      }

      if (!tokenValue) {
        console.log('No admin token found for API request');
        return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
      }

      // Basic JWT verification for API routes
      try {
        const jwtSecret = process.env.JWT_SECRET || 'fallback-secret-key';
        const payload = JSON.parse(atob(tokenValue.split('.')[1]));
        const currentTime = Math.floor(Date.now() / 1000);
        
        if (payload.exp < currentTime) {
          console.log('Expired token for API request');
          return NextResponse.json({ error: 'Token expired' }, { status: 401 });
        }
        
        if (!payload.isAdmin || !payload.username) {
          console.log('Invalid admin token for API request');
          return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
        }
      } catch (error) {
        console.log('Invalid token format for API request');
        return NextResponse.json({ error: 'Invalid token format' }, { status: 401 });
      }

    } catch (error) {
      console.error('API auth check error:', error);
      return NextResponse.json({ error: 'Authentication failed' }, { status: 401 });
    }
  }

  // For all other routes (including admin pages), proceed normally
  // Let client-side authentication handle the redirects
  return NextResponse.next();
}

export const config = {
  matcher: [
    '/api/:path*',
    '/((?!_next/static|_next/image|favicon.ico).*)'
  ]
};