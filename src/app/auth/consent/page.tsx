'use client';

import { useEffect, useState } from 'react';
// import { useSearchParams } from 'next/navigation';

const ConsentPage = () => {
  // const searchParams = useSearchParams();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [params, setParams] = useState<URLSearchParams | null>(null);

  useEffect(() => {
    const sp = new URLSearchParams(window.location.search);
    console.log("Search params:", Object.fromEntries(sp.entries()));
    setParams(sp);
    
    // Validate required parameters
    if (!sp.get('client_id')) {
      setError('Missing client_id parameter');
    }
    if (!sp.get('redirect_uri')) {
      setError('Missing redirect_uri parameter');
    }
  }, []);

  // Get all parameters from the URL
  const clientId = params?.get('client_id');
  const scope = params?.get('scope') || '';
  const redirectUri = params?.get('redirect_uri');
  const responseType = params?.get('response_type') || 'code';
  
  // Any other parameters
  const nonce = params?.get('nonce');
  const codeChallenge = params?.get('code_challenge');
  const codeChallengeMethod = params?.get('code_challenge_method');
  const state = params?.get('state');
  
  // Parse scopes
  const scopes = scope.split(' ').filter(Boolean);

  const handleConsent = async () => {
    try {
      setLoading(true);
      setError(null);
      
      if (!redirectUri) {
        setError('Invalid redirect URI');
        setLoading(false);
        return;
      }
      
      // Construct the authorization URL with all original parameters
      const approveUrl = new URL('/api/auth/oauth2/authorize', window.location.origin);
      
      // Add all original query parameters
      approveUrl.searchParams.append('client_id', clientId || '');
      approveUrl.searchParams.append('response_type', responseType);
      approveUrl.searchParams.append('scope', scope);
      approveUrl.searchParams.append('redirect_uri', redirectUri);
      
      if (nonce) approveUrl.searchParams.append('nonce', nonce);
      if (codeChallenge) approveUrl.searchParams.append('code_challenge', codeChallenge);
      if (codeChallengeMethod) approveUrl.searchParams.append('code_challenge_method', codeChallengeMethod);
      if (state) approveUrl.searchParams.append('state', state);
      
      // Add consent approval parameter
      approveUrl.searchParams.append('consent', 'approved');
      
      console.log('Redirecting to:', approveUrl.toString());
      
      // Redirect to the authorization endpoint with consent approval
      window.location.href = approveUrl.toString();
    } catch (err) {
      console.error('Consent error:', err);
      setError('Failed to process consent');
      setLoading(false);
    }
  };

  const handleDeny = () => {
    // Redirect to home or show access denied message
    window.location.href = '/';
  };

  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="p-4 bg-red-50 rounded-md">
          <p className="text-red-700">{error}</p>
          <button 
            onClick={() => window.location.href = '/'}
            className="mt-4 px-4 py-2 bg-red-600 text-white rounded-md"
          >
            Return Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-bold tracking-tight text-gray-900">
            Authorize Access
          </h2>
          <p className="mt-2 text-center text-sm text-gray-800">
            An application would like to access your information
          </p>
        </div>
        
        <div className="bg-white p-6 shadow sm:rounded-lg text-black">
          <div className="space-y-4">
            <p className="font-medium">
              The application <span className="font-bold">{clientId}</span> is requesting access to:
            </p>
            
            <ul className="list-disc pl-5 space-y-2">
              {scopes.includes('openid') && (
                <li>Your identity</li>
              )}
              {scopes.includes('profile') && (
                <li>Your profile information</li>
              )}
              {scopes.includes('email') && (
                <li>Your email address</li>
              )}
            </ul>
            
            <div className="pt-4 flex space-x-4">
              <button
                onClick={handleConsent}
                disabled={loading}
                className="flex-1 bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
              >
                {loading ? 'Authorizing...' : 'Allow'}
              </button>
              
              <button
                onClick={handleDeny}
                disabled={loading}
                className="flex-1 bg-gray-200 text-gray-800 py-2 px-4 rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
              >
                Deny
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ConsentPage;