import { NextRequest } from 'next/server';

interface RateLimitEntry {
  count: number;
  resetTime: number;
}

// In-memory store (use Redis in production)
const rateLimitStore = new Map<string, RateLimitEntry>();

export function rateLimit(request: NextRequest, maxRequests: number = 10, windowMs: number = 900000) {
  const clientIP = request.headers.get('x-forwarded-for')?.split(',')[0] || 
                  request.headers.get('x-real-ip') || 
                  request.headers.get('cf-connecting-ip') ||
                  'unknown';
  
  const now = Date.now();
  const key = `rate_limit_${clientIP}`;
  
  const entry = rateLimitStore.get(key);
  
  if (!entry || now > entry.resetTime) {
    // First request or window expired
    rateLimitStore.set(key, {
      count: 1,
      resetTime: now + windowMs
    });
    return { allowed: true, remaining: maxRequests - 1, resetTime: now + windowMs };
  }
  
  if (entry.count >= maxRequests) {
    // Rate limit exceeded
    return { 
      allowed: false, 
      remaining: 0, 
      resetTime: entry.resetTime,
      retryAfter: Math.ceil((entry.resetTime - now) / 1000)
    };
  }
  
  // Increment counter
  entry.count++;
  rateLimitStore.set(key, entry);
  
  return { 
    allowed: true, 
    remaining: maxRequests - entry.count, 
    resetTime: entry.resetTime 
  };
}

export function createRateLimitResponse(retryAfter: number) {
  return new Response(JSON.stringify({ 
    error: 'Too many requests', 
    message: `Please try again in ${retryAfter} seconds`,
    retryAfter 
  }), {
    status: 429,
    headers: { 
      'Content-Type': 'application/json',
      'Retry-After': retryAfter.toString()
    },
  });
}
