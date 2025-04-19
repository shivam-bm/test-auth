import Link from 'next/link';

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <div className="flex flex-col items-center">
        <h1 className="text-4xl font-bold mb-8">Better Auth OIDC Demo</h1>
        
        <p className="text-lg text-center max-w-xl mb-8">
          A demo application showing how to implement OpenID Connect (OIDC) authentication with Better Auth and Drizzle ORM using PostgreSQL.
        </p>
        
        <div className="flex gap-4">
          <Link 
            href="/sign-in" 
            className="px-6 py-3 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition"
          >
            Sign In
          </Link>
          
          <Link 
            href="/dashboard" 
            className="px-6 py-3 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition"
          >
            Dashboard
          </Link>
        </div>
      </div>
    </main>
  );
}
