import { createAuthClient } from "better-auth/client";
import { oidcClient } from "better-auth/client/plugins";

export const authClient = createAuthClient({
  plugins: [
    oidcClient()
  ]
}); 