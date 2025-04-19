'use client';

import { useState, useEffect } from 'react';
import { authClient } from '@/auth/auth-client';

interface OAuthClient {
  id: string;
  clientId: string;
  clientSecret?: string;
  name: string;
  redirectURLs: string;
  createdAt: string;
}

export function OidcManagerPanel() {
  const [clients, setClients] = useState<OAuthClient[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [newClient, setNewClient] = useState<OAuthClient | null>(null);
  
  // Form state
  const [clientName, setClientName] = useState('');
  const [redirectURLs, setRedirectURLs] = useState('');
  const [showForm, setShowForm] = useState(false);

  // Fetch all OAuth clients on component mount
  const fetchClients = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Fetch registered clients from the API
      try {
        const response = await fetch('/api/auth/oauth2/clients');
        if (response.ok) {
          const data = await response.json();
          setClients(data.clients || []);
          return;
        } else {
          console.warn('Failed to fetch clients:', await response.text());
        }
      } catch (fetchError) {
        console.error('Error fetching clients:', fetchError);
      }
      
      // Fallback: If fetch fails or isn't implemented yet
      if (newClient) {
        setClients([newClient]);
      } else {
        setClients([]);
      }
    } catch (err) {
      setError('An unexpected error occurred');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchClients();
  }, [newClient]);

  const handleCreateClient = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    setLoading(true);
    
    try {
      // Create OIDC client
      if (authClient.oauth2 && typeof authClient.oauth2.register === 'function') {
        console.log('Attempting to register client with:', {
          client_name: clientName,
          redirect_uris: redirectURLs.split(',').map(url => url.trim())
        });
        
        const result = await authClient.oauth2.register({
          redirect_uris: redirectURLs.split(',').map(url => url.trim()),
          client_name: clientName
        });
        
        if (result.error) {
          setError(result.error.message || 'Failed to create client');
          console.error('Client registration error:', result.error);
        } else if (result.data) {
          setSuccess('Client registered successfully!');
          console.log('Client registration success:', result.data);
          
          // Create a new client object from the result
          const newClientData: OAuthClient = {
            id: result.data.client_id || 'unknown-id',
            clientId: result.data.client_id || 'unknown',
            clientSecret: result.data.client_secret,
            name: clientName,
            redirectURLs: redirectURLs,
            createdAt: new Date().toISOString()
          };
          
          setNewClient(newClientData);
          setClients(prev => [...prev, newClientData]);
          
          // Reset form
          setClientName('');
          setRedirectURLs('');
          setShowForm(false);
        }
      } else {
        setError('OIDC client registration is not available in the current client');
        console.warn('oauth2.register method not found on auth client');
      }
    } catch (err) {
      setError('An unexpected error occurred');
      console.error('Client registration exception:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white/0.04 shadow rounded-lg p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold">OIDC Clients</h2>
        <button
          onClick={() => setShowForm(!showForm)}
          className="bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
        >
          {showForm ? 'Cancel' : 'Register New Client'}
        </button>
      </div>

      {error && (
        <div className="rounded-md bg-red-50 p-4 mb-4">
          <div className="text-sm text-red-700">{error}</div>
        </div>
      )}
      
      {success && (
        <div className="rounded-md bg-green-50 p-4 mb-4">
          <div className="text-sm text-green-700">{success}</div>
        </div>
      )}

      {showForm && (
        <div className="mb-8 p-4 border rounded-md bg-white/0.04">
          <h3 className="text-lg font-medium mb-4">Register New OIDC Client</h3>
          <form onSubmit={handleCreateClient} className="space-y-4">
            <div>
              <label htmlFor="clientName" className="block text-sm font-medium">
                Client Name
              </label>
              <input
                id="clientName"
                type="text"
                value={clientName}
                onChange={(e) => setClientName(e.target.value)}
                required
                className="py-2 mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              />
            </div>
            
            <div>
              <label htmlFor="redirectURLs" className="block text-sm font-medium">
                Redirect URLs (comma separated)
              </label>
              <input
                id="redirectURLs"
                type="text"
                value={redirectURLs}
                onChange={(e) => setRedirectURLs(e.target.value)}
                required
                placeholder="https://example.com/callback,https://app.example.com/callback"
                className="py-2 mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              />
              <p className="mt-1 text-xs text-gray-500">
                URLs that the OIDC provider is allowed to redirect to after authentication
              </p>
            </div>
            
            <div>
              <button
                type="submit"
                disabled={loading}
                className="inline-flex justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
              >
                {loading ? 'Registering...' : 'Register Client'}
              </button>
            </div>
          </form>
        </div>
      )}

      {loading && clients.length === 0 ? (
        <div className="flex justify-center items-center p-8">
          <p className="text-gray-500">Loading clients...</p>
        </div>
      ) : clients.length === 0 ? (
        <div className="border rounded-md p-8 text-center">
          <p className="text-gray-500">No OIDC clients registered yet.</p>
          <p className="text-gray-500 mt-2">
            Register a new client to start using this OIDC provider.
          </p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <h3 className="text-lg font-medium mb-4">Your Registered Clients</h3>
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Client ID
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Client Secret
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Redirect URLs
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Created
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {clients.map((client) => (
                <tr key={client.id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{client.name}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900 font-mono">{client.clientId}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900 font-mono">
                      {client.clientSecret ? (
                        <span className="font-mono bg-gray-100 p-1 rounded">{client.clientSecret}</span>
                      ) : (
                        <span className="text-gray-500 italic">Hidden</span>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-900 truncate max-w-xs">
                      {client.redirectURLs}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500">
                      {new Date(client.createdAt).toLocaleDateString()}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          
          <div className="bg-blue-50 p-4 mt-6 rounded-md">
            <h4 className="text-blue-800 font-medium">Testing Your OIDC Client</h4>
            <p className="text-blue-500 mt-2">
              To test your OIDC client, use the following authorization URL (replacing CLIENT_ID with your client ID):
            </p>
            <pre className="bg-white p-2 rounded my-2 overflow-x-auto text-sm text-black">
              {`${window.location.origin}/api/auth/oauth2/authorize?client_id=CLIENT_ID&response_type=code&scope=openid%20profile%20email&redirect_uri=YOUR_REDIRECT_URI`}
            </pre>
            <p className="text-blue-700 mt-2">
              Make sure to use one of the redirect URIs you registered with your client.
            </p>
          </div>
        </div>
      )}
    </div>
  );
} 