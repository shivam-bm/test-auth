import { auth } from '@/auth/auth';
import { NextRequest } from 'next/server';

export const POST = async (req: NextRequest) => {
  // Handle token exchange requests
  return await auth.handler(req);
};

export const dynamic = 'force-dynamic'; 