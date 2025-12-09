import { NextRequest } from 'next/server';
import jwt from 'jsonwebtoken';

interface JWTPayload {
  username: string;
  isAdmin: boolean;
  iat: number;
  exp: number;
}

export async function checkAdminAuth(request: NextRequest) {
  try {
    let tokenValue: string | undefined;

    // Try to get token from Authorization header first
    const authHeader = request.headers.get('Authorization');
    if (authHeader && authHeader.startsWith('Bearer ')) {
      tokenValue = authHeader.substring(7); // Remove 'Bearer ' prefix
    } else {
      // Fallback to cookie
      const adminToken = request.cookies.get('admin-token');
      tokenValue = adminToken?.value;
    }

    if (!tokenValue) {
      console.log('No JWT token found in header or cookie');
      return false;
    }

    // JWT token validation with expiration
    const jwtSecret = process.env.JWT_SECRET || 'fallback-secret-key';
    
    try {
      const decoded = jwt.verify(tokenValue, jwtSecret) as JWTPayload;
      
      // Verify it's an admin token
      return decoded.isAdmin === true && decoded.username;
    } catch (jwtError) {
      console.error('JWT verification failed:', jwtError);
      return false;
    }
  } catch (error) {
    console.error('Auth check error:', error);
    return false;
  }
}

export function createJWTToken(username: string): string {
  const jwtSecret = process.env.JWT_SECRET || 'fallback-secret-key';
  const expiresIn = parseInt(process.env.SESSION_EXPIRE_HOURS || '24');
  
  return jwt.sign(
    { 
      username, 
      isAdmin: true 
    },
    jwtSecret,
    { 
      expiresIn: `${expiresIn}h`,
      issuer: 'huawei-ekit-admin',
      audience: 'admin-panel'
    }
  );
}

export function createAuthResponse(message: string = 'Unauthorized', status: number = 401) {
  return new Response(JSON.stringify({ error: message }), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });
}
