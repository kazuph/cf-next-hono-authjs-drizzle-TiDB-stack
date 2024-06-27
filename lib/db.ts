import { getRequestContext } from "@cloudflare/next-on-pages";
import { connect } from "@tidbcloud/serverless";
import { drizzle } from "drizzle-orm/tidb-serverless";

export const runtime = "edge";

export const getDb = () => {
	const client = connect({
		url: getRequestContext().env.TIDB_HTTP_URL,
	});
	return drizzle(client);
};
