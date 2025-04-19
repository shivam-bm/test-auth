import { auth } from '@/auth/auth';
import { NextRequest } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    // Call the sign-out handler
    const response = await auth.api.signOut({
      headers: req.headers,
      asResponse: true
    });
    
    // Redirect to sign-in page
    return response;
  } catch (error) {
    console.error("Sign-out error:", error);
    // Redirect to sign-in anyway if there's an error
    return Response.redirect(new URL('/sign-in', req.url));
  }
}

export const dynamic = 'force-dynamic'; 