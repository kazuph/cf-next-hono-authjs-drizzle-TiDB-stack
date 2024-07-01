import { getRequestContext } from "@cloudflare/next-on-pages";
import Google from "@auth/core/providers/google";
import type { AuthConfig } from "@hono/auth-js";
import { getDb } from "@/lib/db";

import { DrizzleAdapter } from "@auth/drizzle-adapter";
import { accounts, sessions, users, verificationTokens } from "@/app/schema";

export function getAuthConfig(): AuthConfig {
	const db = getDb();
	return {
		adapter: DrizzleAdapter(db, {
			usersTable: users,
			accountsTable: accounts,
			sessionsTable: sessions,
			verificationTokensTable: verificationTokens,
		}),
		secret: getRequestContext().env.AUTH_SECRET,
		// session: {
		// 	strategy: "jwt",
		// },
		providers: [
			Google({
				clientId: getRequestContext().env.GOOGLE_CLIENT_ID,
				clientSecret: getRequestContext().env.GOOGLE_CLIENT_SECRET,
				allowDangerousEmailAccountLinking: true,
			}),
		],
	};
}
