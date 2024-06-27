import { defineConfig } from "drizzle-kit";

if (!process.env.TIDB_HTTP_URL) {
	throw new Error("TIDB_HTTP_URL is not defined");
}

export default defineConfig({
	schema: "./app/schema.ts",
	out: "./drizzle/migrations",
	dialect: "mysql",
	dbCredentials: {
		url: `${process.env.TIDB_HTTP_URL}?ssl={"rejectUnauthorized":true}`,
	},
	verbose: true,
	strict: true,
});
