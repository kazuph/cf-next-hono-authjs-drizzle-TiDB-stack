import { Hono } from "hono";
import { handle } from "hono/vercel";
import { authHandler, initAuthConfig, verifyAuth } from "@hono/auth-js";
import { getAuthConfig } from "@/lib/auth";

import { zValidator } from "@hono/zod-validator";

import {
	todos,
	createTodoSchema,
	updateToggleTodoSchema,
	deleteTodoSchema,
	updateTodoJsonSchema,
	updateTodoParamSchema,
} from "@/app/schema";
import { eq, and } from "drizzle-orm";
import { getDb } from "@/lib/db";

export const runtime = "edge";

const app = new Hono().basePath("/api");

app.use("*", initAuthConfig(getAuthConfig));
app.use("/auth/*", authHandler());
app.use("/*", verifyAuth());
const route = app
	.get("/todos", async (c) => {
		const authUser = c.get("authUser");
		if (!authUser) return c.json({ error: "Unauthorized" }, 401);
		if (!authUser.user) return c.json({ error: "Invalid user" }, 400);

		const db = getDb();
		try {
			const results = await db
				.select()
				.from(todos)
				.where(eq(todos.userId, authUser.user.id));
			return c.json(results);
		} catch (error) {
			console.error("Database error:", error);
			return c.json({ error: "Internal server error" }, 500);
		}
	})
	.post("/todos", zValidator("json", createTodoSchema), async (c) => {
		const authUser = c.get("authUser");
		if (!authUser) return c.json({ error: "Unauthorized" }, 401);
		if (!authUser.user) return c.json({ error: "Invalid user" }, 400);

		const db = getDb();
		const { description } = c.req.valid("json");
		try {
			const result = await db
				.insert(todos)
				.values({ description, userId: authUser.user.id });

			if (result.insertId) {
				const newTodo = await db
					.select()
					.from(todos)
					.where(eq(todos.id, result.insertId))
					.limit(1);
				return c.json(newTodo[0]);
			}
		} catch (error) {
			console.error("Database error:", error);
			return c.json({ error: "Internal server error" }, 500);
		}
	})
	.put(
		"/todos/:id/toggle",
		zValidator("param", updateTodoParamSchema),
		zValidator("json", updateToggleTodoSchema),
		async (c) => {
			const authUser = c.get("authUser");
			if (!authUser) return c.json({ error: "Unauthorized" }, 401);
			if (!authUser.user) return c.json({ error: "Invalid user" }, 400);

			const db = getDb();
			const { id } = c.req.valid("param");
			const { completed } = c.req.valid("json");
			try {
				const result = await db
					.update(todos)
					.set({ completed })
					.where(and(eq(todos.id, id), eq(todos.userId, authUser.user.id)));

				if (result.rowsAffected === 0)
					return c.json({ error: "Todo not found or not owned by user" }, 404);

				const updatedTodo = await db
					.select()
					.from(todos)
					.where(eq(todos.id, id))
					.limit(1);
				return c.json(updatedTodo[0]);
			} catch (error) {
				console.error("Database error:", error);
				return c.json({ error: "Internal server error" }, 500);
			}
		},
	)
	.put(
		"/todos/:id",
		zValidator("param", updateTodoParamSchema),
		zValidator("json", updateTodoJsonSchema),
		async (c) => {
			const authUser = c.get("authUser");
			if (!authUser) return c.json({ error: "Unauthorized" }, 401);
			if (!authUser.user) return c.json({ error: "Invalid user" }, 400);

			const db = getDb();
			const { id } = c.req.valid("param");
			const { description } = c.req.valid("json");
			try {
				const result = await db
					.update(todos)
					.set({ description })
					.where(and(eq(todos.id, id), eq(todos.userId, authUser.user.id)));

				if (result.rowsAffected === 0)
					return c.json({ error: "Todo not found or not owned by user" }, 404);

				const updatedTodo = await db
					.select()
					.from(todos)
					.where(eq(todos.id, id))
					.limit(1);
				return c.json(updatedTodo[0]);
			} catch (error) {
				console.error("Database error:", error);
				return c.json({ error: "Internal server error" }, 500);
			}
		},
	)
	.delete("/todos/:id", zValidator("param", deleteTodoSchema), async (c) => {
		const authUser = c.get("authUser");
		if (!authUser) return c.json({ error: "Unauthorized" }, 401);
		if (!authUser.user) return c.json({ error: "Invalid user" }, 400);

		const db = getDb();
		const { id } = c.req.valid("param");
		try {
			const result = await db
				.delete(todos)
				.where(and(eq(todos.id, id), eq(todos.userId, authUser.user.id)));

			if (result.rowsAffected === 0)
				return c.json({ error: "Todo not found or not owned by user" }, 404);
			return c.json({ success: true });
		} catch (error) {
			console.error("Database error:", error);
			return c.json({ error: "Internal server error" }, 500);
		}
	});

export const GET = handle(route);
export const POST = handle(route);
export const PUT = handle(route);
export const DELETE = handle(route);

export type AppType = typeof route;
