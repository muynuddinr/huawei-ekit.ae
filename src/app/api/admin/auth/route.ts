import { NextRequest, NextResponse } from 'next/server';
import { rateLimit } from '@/lib/rateLimit';
import { validateInput, commonSchemas } from '@/lib/validation';
import { createJWTToken } from '@/lib/auth';
export async function POST(request: NextRequest) {
  try {
    // Apply rate limiting (5 attempts per 15 minutes)
    const rateLimitResult = rateLimit(request, 5, 15 * 60 * 1000);

    if (!rateLimitResult.allowed) {
      const retryAfterMinutes = Math.ceil(rateLimitResult.retryAfter! / 60);
      return NextResponse.json({ error: `Too many login attempts. Try again in ${retryAfterMinutes} minutes.` }, { status: 429 });
    }

    const body = await request.json();
    
    // Validate input
    const validation = validateInput(body, commonSchemas.login);
    if (!validation.isValid) {
      return NextResponse.json({ error: `Validation failed: ${validation.errors.join(', ')}` }, { status: 400 });
    }

    const { username, password } = validation.sanitizedData;

    // Use environment variables for credentials
    const adminUsername = process.env.ADMIN_USERNAME || 'admin';
    const adminPassword = process.env.ADMIN_PASSWORD || 'admin123';

    if (username === adminUsername && password === adminPassword) {
      // Create JWT token
      const jwtToken = createJWTToken(username);

      // Create secure response with JWT token in body
      const response = NextResponse.json({ 
        success: true, 
        message: 'Login successful',
        token: jwtToken,  // Return token in response body
        user: { username }
      });

      // Also set secure JWT authentication cookie as backup
      const sessionExpireHours = parseInt(process.env.SESSION_EXPIRE_HOURS || '24');
      response.cookies.set('admin-token', jwtToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 60 * 60 * sessionExpireHours,
        path: '/'
      });

      return response;
    }

    return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    // Logout - clear the admin token cookie
    const response = NextResponse.json({ 
      success: true, 
      message: 'Logout successful'
    });

    response.cookies.delete('admin-token');

    return response;
  } catch (error) {
    console.error('Logout error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
