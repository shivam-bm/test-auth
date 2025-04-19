import Link from 'next/link';
import { OidcManagerPanel } from '@/components/OidcManagerPanel';

export default function DashboardPage() {
  return (
    <div className="container mx-auto max-w-6xl py-12 px-4 text-[#b1b1b1]">
      <h1 className="text-3xl font-bold mb-8">Dashboard</h1>
      
      <div className="bg-white/0.4 shadow rounded-lg p-6 mb-8">
        <h2 className="text-xl font-semibold mb-4">Welcome to Your OIDC Auth App</h2>
        
        <div className="mt-4">
          <h3 className="text-lg font-medium">User Information</h3>
          <p className="mt-2">This would display the user information when authentication is working.</p>
        </div>
        
        <div className="mt-8">
          <h3 className="text-lg font-medium">OIDC Integration</h3>
          <p className="mt-2">
            This application is configured as an OpenID Connect Provider.
            Other applications can use it for authentication via the OIDC protocol.
          </p>
          <p className="mt-2">
            Use the OIDC Manager Panel below to register client applications.
          </p>
          
          <div className="mt-4 p-4 bg-blue-50 rounded-md">
            <h4 className="font-medium text-blue-800">How to Use This OIDC Provider</h4>
            <ol className="list-decimal pl-5 mt-2 space-y-2 text-blue-700">
              <li>Register a new client application below</li>
              <li>Use the client ID and secret in your application</li>
              <li>Configure your application to use these endpoints:
                <ul className="list-disc pl-5 mt-1 space-y-1">
                  <li><span className="font-mono bg-white px-1 py-0.5 rounded text-sm">Authorization URL: /api/auth/oauth2/authorize</span></li>
                  <li><span className="font-mono bg-white px-1 py-0.5 rounded text-sm">Token URL: /api/auth/oauth2/token</span></li>
                  <li><span className="font-mono bg-white px-1 py-0.5 rounded text-sm">UserInfo URL: /api/auth/oauth2/userinfo</span></li>
                </ul>
              </li>
              <li>When users authenticate through your app, they&apos;ll be redirected here to sign in</li>
              <li>After successful authentication, they&apos;ll be redirected back to your app with an auth code</li>
              <li>Your app will exchange this code for tokens using the token endpoint</li>
            </ol>
          </div>
        </div>
        
        <div className="mt-6">
          <Link
            href="/sign-in"
            className="inline-block bg-red-600 text-white py-2 px-4 rounded-md hover:bg-red-700"
          >
            Return to Sign In
          </Link>
        </div>
      </div>
      
      {/* OIDC Manager Panel */}
      <OidcManagerPanel />
    </div>
  );
} 