import * as mysql from "mysql2/promise";
import express from "express";

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

async function tryConnection(connectionString, maxAttempts = 5, delay = 2000) {
	let attempts = 0;
	while (attempts < maxAttempts) {
		try {
			const connection = await mysql.createConnection(connectionString);
			console.log("Successfully connected to MySQL");
			return connection;
		} catch (error) {
			attempts++;
			console.error(`Connection attempt ${attempts} failed: ${error.message}`);
			if (attempts >= maxAttempts) {
				throw new Error(
					"Max connection attempts reached. Unable to connect to MySQL.",
				);
			}
			await sleep(delay);
		}
	}
}

const app = express();
app.use(express.json());
const port = 8000;

const main = async () => {
	let connection;
	try {
		connection = await tryConnection("mysql://root:@127.0.0.1:4000/test");
	} catch (error) {
		console.error("Failed to connect to MySQL:", error.message);
		process.exit(1);
	}

	app.post("/query", async (req, res) => {
		const { sql: sqlBody, params, method } = req.body;

		if (method === "all") {
			try {
				const result = await connection.query({
					sql: sqlBody,
					values: params,
					rowsAsArray: true,
					typeCast: function (field: any, next: any) {
						if (
							field.type === "TIMESTAMP" ||
							field.type === "DATETIME" ||
							field.type === "DATE"
						) {
							return field.string();
						}
						return next();
					},
				});
				console.log(
					JSON.stringify({ sqlBody, params, method, result: result[0] }),
				);

				res.send(result[0]);
			} catch (e: any) {
				console.error("Error in 'all' method:", e);
				res.status(500).json({ error: e.message, stack: e.stack });
			}
		} else if (method === "execute") {
			try {
				const result = await connection.query({
					sql: sqlBody,
					values: params,
					typeCast: function (field: any, next: any) {
						if (
							field.type === "TIMESTAMP" ||
							field.type === "DATETIME" ||
							field.type === "DATE"
						) {
							return field.string();
						}
						return next();
					},
				});

				console.log(
					JSON.stringify({ sqlBody, params, method, result: result[0] }),
				);
				res.send(result);
			} catch (e: any) {
				console.error("Error in 'execute' method:", e);
				res.status(500).json({ error: e.message, stack: e.stack });
			}
		} else {
			res.status(500).json({ error: "Unknown method value" });
		}
	});

	app.post("/migrate", async (req, res) => {
		const { queries } = req.body;

		await connection.query("BEGIN");
		try {
			for (const query of queries) {
				await connection.query(query);
			}
			await connection.query("COMMIT");
		} catch {
			await connection.query("ROLLBACK");
		}

		res.send({});
	});

	app.listen(port, () => {
		console.log(`Example app listening on port ${port}`);
	});
};

main();
