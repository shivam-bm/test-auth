'use client';

import { authClient } from '@/auth/auth-client';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

interface UserProfileProps {
  user: {
    id: string;
    name?: string | null;
    email?: string | null;
    image?: string | null;
  };
}

export function UserProfile({ user }: UserProfileProps) {
  const router = useRouter();

  const handleSignOut = async () => {
    await authClient.signOut({
      fetchOptions: {
        onSuccess: () => {
          router.push('/sign-in');
        }
      }
    });
  };

  return (
    <div className="bg-white shadow rounded-lg p-6">
      <div className="flex flex-col items-center">
        <div className="relative w-24 h-24 mb-4">
          {user.image ? (
            <Image
              src={user.image}
              alt={user.name || 'User'}
              className="rounded-full object-cover w-full h-full"
              width={96}
              height={96}
            />
          ) : (
            <div className="rounded-full bg-indigo-100 w-full h-full flex items-center justify-center">
              <span className="text-3xl font-medium text-indigo-700">
                {user.name?.charAt(0).toUpperCase() || user.email?.charAt(0).toUpperCase() || '?'}
              </span>
            </div>
          )}
        </div>
        <h2 className="text-xl font-semibold">{user.name || 'User'}</h2>
        <p className="text-gray-500 mt-1">{user.email}</p>
      </div>

      <div className="border-t mt-6 pt-6">
        <h3 className="text-lg font-medium mb-4">User Information</h3>
        <div className="space-y-3">
          <div>
            <p className="text-sm text-gray-500">User ID</p>
            <p className="font-medium truncate">{user.id}</p>
          </div>
        </div>
      </div>

      <div className="mt-6">
        <button
          onClick={handleSignOut}
          className="w-full bg-red-600 text-white py-2 px-4 rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
        >
          Sign Out
        </button>
      </div>
    </div>
  );
} 