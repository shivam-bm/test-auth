"use client";

import { useState, useEffect } from "react";
import { authClient } from "@/auth/auth-client";

export function SignInForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [callbackURL, setCallbackURL] = useState("");
  const [consentURL, setConsentURL] = useState("");

  useEffect(() => {
    // Extract URL parameters from the current URL
    const queryParams = new URLSearchParams(window.location.search);
    const params: Record<string, string> = {};
    
    // Extract relevant OAuth parameters
    const relevantParams = ["client_id", "scope", "redirect_uri", "response_type", "state"];
    relevantParams.forEach(param => {
      const value = queryParams.get(param);
      if (value) params[param] = value;
    });
    
    // Set callback URL from the redirect_uri parameter
    if (params.redirect_uri) {
      setCallbackURL(decodeURIComponent(params.redirect_uri));
    }
    
    // Construct consent URL using extracted parameters
    if (params.client_id && params.scope && params.redirect_uri) {
      // Get the current origin for auth server
      const authServerOrigin = window.location.origin;
      
      setConsentURL(
        `${authServerOrigin}/auth/consent?client_id=${params.client_id}&scope=${params.scope}&redirect_uri=${params.redirect_uri}&state=${params.state}`
      );
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const { error } = await authClient.signIn.email({
        email,
        password,
        callbackURL,
      });

      if (error) {
        setError(error.message || "Authentication failed");
      } else {
        // Redirect to the consent page using URL built from original parameters
        window.location.href = consentURL;
      }
    } catch (err) {
      setError("An unexpected error occurred");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form className="space-y-6" onSubmit={handleSubmit}>
      {error && (
        <div className="rounded-md bg-red-50 p-4 mb-4">
          <div className="text-sm text-red-700">{error}</div>
        </div>
      )}

      <div>
        <label
          htmlFor="email"
          className="block text-sm font-medium text-gray-700"
        >
          Email address
        </label>
        <div className="mt-1">
          <input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className=" p-2 block w-full rounded-md border-gray-300 shadow-sm text-black focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          />
        </div>
      </div>

      <div>
        <label
          htmlFor="password"
          className="block text-sm font-medium text-gray-700"
        >
          Password
        </label>
        <div className="mt-1">
          <input
            id="password"
            name="password"
            type="password"
            autoComplete="current-password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="p-2 block w-full rounded-md border-gray-300 shadow-sm text-black focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          />
        </div>
      </div>

      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <input
            id="remember-me"
            name="remember-me"
            type="checkbox"
            className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
          />
          <label
            htmlFor="remember-me"
            className="ml-2 block text-sm text-gray-900"
          >
            Remember me
          </label>
        </div>

        <div className="text-sm">
          <a
            href="#"
            className="font-medium text-indigo-600 hover:text-indigo-500"
          >
            Forgot your password?
          </a>
        </div>
      </div>

      <div>
        <button
          type="submit"
          disabled={loading}
          className="flex w-full justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
        >
          {loading ? "Signing in..." : "Sign in"}
        </button>
      </div>

      <div className="mt-6">
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-300" />
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="bg-white px-2 text-gray-500">Or</span>
          </div>
        </div>

        <div className="mt-6 grid grid-cols-1 gap-3">
          <button
            type="button"
            onClick={async () => {
              setLoading(true);
              try {
                const result = await authClient.signUp.email({
                  email,
                  password,
                  name: email.split("@")[0],
                  callbackURL: "/dashboard",
                });

                if (result.error) {
                  setError(result.error.message || "Sign-up failed");
                }
              } catch (err) {
                console.error("Sign-up error:", err);
                setError("An unexpected error occurred during sign-up");
              } finally {
                setLoading(false);
              }
            }}
            className="inline-flex w-full justify-center rounded-md border border-gray-300 bg-white py-2 px-4 text-sm font-medium text-gray-500 shadow-sm hover:bg-gray-50"
          >
            {loading ? "Signing up..." : "Sign up with Email"}
          </button>
        </div>
      </div>
    </form>
  );
}
