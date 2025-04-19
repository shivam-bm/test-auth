import { auth } from '@/auth/auth';
import { NextRequest, NextResponse } from 'next/server';

export const GET = async (req: NextRequest) => {
  try {
    // Attempt to handle the request with auth.handler
    const response = await auth.handler(
      new Request(`${req.nextUrl.origin}/api/auth/oauth2/clients`, {
        method: 'GET',
        headers: req.headers
      })
    );
    
    if (response.ok) {
      const data = await response.json();
      return NextResponse.json(data);
    }
    
    // Fallback response if the handler doesn't support this
    return NextResponse.json({ 
      clients: [],
      message: 'Client listing not directly supported. Register clients through the UI and they will be stored.'
    });
  } catch (error) {
    console.error('Error fetching OIDC clients:', error);
    return NextResponse.json(
      { error: 'Failed to fetch OIDC clients' },
      { status: 500 }
    );
  }
};

export const dynamic = 'force-dynamic'; 