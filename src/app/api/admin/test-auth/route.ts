import { NextRequest, NextResponse } from 'next/server';
import { checkAdminAuth } from '@/lib/auth';

export async function GET(request: NextRequest) {
  try {
    console.log('Test auth endpoint called');
    
    // Debug: Log authentication headers
    const authHeader = request.headers.get('Authorization');
    const cookieHeader = request.cookies.get('admin-token');
    console.log('Auth header:', authHeader ? 'Bearer token present' : 'No Bearer token');
    console.log('Cookie token:', cookieHeader ? 'Cookie present' : 'No cookie');
    
    // Check admin authentication using JWT
    const isAdmin = await checkAdminAuth(request);
    
    return NextResponse.json({ 
      success: true,
      isAuthenticated: isAdmin,
      authMethod: authHeader ? 'bearer' : (cookieHeader ? 'cookie' : 'none'),
      message: isAdmin ? 'Authentication successful' : 'Authentication failed'
    });

  } catch (error) {
    console.error('Test auth error:', error);
    return NextResponse.json(
      { success: false, error: 'Test auth failed' },
      { status: 500 }
    );
  }
}
