import { auth } from '@/auth/auth';
import { NextRequest } from 'next/server';

export const GET = async (req: NextRequest) => {
  // Pass the request to the auth handler which will process the OAuth authorization request
  return await auth.handler(req);
};

export const POST = async (req: NextRequest) => {
  // Handle POST requests for authorization (typically for consent submissions)
  return await auth.handler(req);
};

export const dynamic = 'force-dynamic'; 