import { db } from "../db";
import { betterAuth } from "better-auth";
import { oidcProvider } from "better-auth/plugins";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import * as schema from '../auth/auth-schema';

export const auth = betterAuth({
  emailAndPassword: {
    enabled: true
  },
  trustedOrigins: ["http://localhost:3000"],
  secret: process.env.BETTER_AUTH_SECRET || "secret",
  database: drizzleAdapter(db, {
    provider: "pg",
    schema: {
      ...schema
    },
    usePlural: true
  }),
  plugins: [
    oidcProvider({
      loginPage: "/sign-in",
      consentPage: "/auth/consent",
      metadata: {
        issuer: process.env.NEXT_PUBLIC_APP_URL,
      },
      allowDynamicClientRegistration: true,
      getAdditionalUserInfoClaim: (user, scopes) => {
        const claims: Record<string, unknown> = {};
        if (scopes.includes('profile')) {
          claims.name = user.name;
          claims.picture = user.image;
        }
        return claims;
      }
    })
  ]
});


// Export type-safe API for use in server components and API routes
export type Auth = typeof auth; 