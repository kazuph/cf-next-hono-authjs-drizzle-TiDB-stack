import { defineConfig } from "drizzle-kit";

const isDevelopment = process.env.NODE_ENV === "development";

if (!isDevelopment && !process.env.TIDB_HTTP_URL) {
	throw new Error(
		"TIDB_HTTP_URL is not defined in non-development environment",
	);
}

export default defineConfig({
	schema: "./app/schema.ts",
	out: "./drizzle/migrations",
	dialect: "mysql",
	dbCredentials: isDevelopment
		? {
				url: "mysql://root:@localhost:4000/test",
			}
		: {
				url: `${process.env.TIDB_HTTP_URL}?ssl={"rejectUnauthorized":true}`,
			},
	verbose: true,
	strict: true,
});
