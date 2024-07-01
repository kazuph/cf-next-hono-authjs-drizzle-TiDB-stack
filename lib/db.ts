import { getRequestContext } from "@cloudflare/next-on-pages";
import { drizzle as drizzleTiDB } from "drizzle-orm/tidb-serverless";
import { drizzle as drizzleProxy } from "drizzle-orm/mysql-proxy";
import { connect } from "@tidbcloud/serverless";

export const runtime = "edge";

export const getDb = () => {
	const env = getRequestContext().env;

	if (env.NODE_ENV === "production") {
		// 本番環境: TiDB Serverlessに直接接続
		const client = connect({
			url: `${env.TIDB_HTTP_URL}?ssl={"rejectUnauthorized":true}`,
			debug: true,
		});
		return drizzleTiDB(client);
		// biome-ignore lint/style/noUselessElse: <explanation>
	} else {
		// 開発環境: ローカルのMySQL proxyを使用
		return drizzleProxy(async (sql, params, method) => {
			try {
				const response = await fetch("http://localhost:8000/query", {
					method: "POST",
					headers: {
						"Content-Type": "application/json",
					},
					body: JSON.stringify({ sql, params, method }),
				});

				if (!response.ok) {
					throw new Error(`HTTP error! status: ${response.status}`);
				}

				const data = await response.json();
				return { rows: data };
				// biome-ignore lint/suspicious/noExplicitAny: <explanation>
			} catch (e: any) {
				console.error("Error from mysql proxy server: ", e.message);
				return { rows: [] };
			}
		});
	}
};
