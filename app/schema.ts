import { sql } from "drizzle-orm";
import {
	mysqlTable,
	varchar,
	timestamp,
	boolean,
	int,
	text,
	primaryKey,
	char,
} from "drizzle-orm/mysql-core";
import { createId } from "@paralleldrive/cuid2";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { z } from "zod";

export const users = mysqlTable("user", {
	id: char("id", { length: 24 })
		.notNull()
		.primaryKey()
		.$defaultFn(() => createId()),
	name: varchar("name", { length: 255 }),
	email: varchar("email", { length: 255 }).notNull(),
	emailVerified: timestamp("emailVerified"),
	image: varchar("image", { length: 255 }),
});

export const accounts = mysqlTable(
	"account",
	{
		userId: char("userId", { length: 24 })
			.notNull()
			.references(() => users.id, { onDelete: "cascade" }),
		type: varchar("type", { length: 255 })
			.$type<"oauth" | "oidc" | "email">()
			.notNull(),
		provider: varchar("provider", { length: 255 }).notNull(),
		providerAccountId: varchar("providerAccountId", { length: 255 }).notNull(),
		refresh_token: varchar("refresh_token", { length: 255 }),
		access_token: varchar("access_token", { length: 255 }),
		expires_at: int("expires_at"),
		token_type: varchar("token_type", { length: 255 }),
		scope: varchar("scope", { length: 255 }),
		id_token: text("id_token"),
		session_state: varchar("session_state", { length: 255 }),
	},
	(table) => ({
		pk: primaryKey(table.userId, table.provider),
	}),
);

export const sessions = mysqlTable("session", {
	sessionToken: char("sessionToken", { length: 36 }).notNull().primaryKey(),
	userId: char("userId", { length: 24 })
		.notNull()
		.references(() => users.id, { onDelete: "cascade" }),
	expires: timestamp("expires").notNull(),
});

export const verificationTokens = mysqlTable(
	"verificationToken",
	{
		identifier: varchar("identifier", { length: 255 }).notNull(),
		token: varchar("token", { length: 255 }).notNull(),
		expires: timestamp("expires").notNull(),
	},
	(table) => ({
		pk: primaryKey(table.identifier, table.token),
	}),
);

export const todos = mysqlTable("todos", {
	id: char("id", { length: 24 })
		.notNull()
		.primaryKey()
		.$defaultFn(() => createId()),
	description: varchar("description", { length: 255 }).notNull(),
	userId: char("user_id", { length: 24 })
		.notNull()
		.references(() => users.id),
	completed: boolean("completed").default(false).notNull(),
	createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertTodoSchema = createInsertSchema(todos).extend({
	description: z
		.string()
		.min(1, "Description is required")
		.min(3, "Description must be at least 3 characters")
		.max(100, "Description must be 100 characters or less"),
});

export const selectTodoSchema = createSelectSchema(todos);

export const createTodoSchema = z.object({
	description: z
		.string()
		.min(1, "Description is required")
		.min(3, "Description must be at least 3 characters")
		.max(100, "Description must be 100 characters or less"),
});

export const updateToggleTodoSchema = z.object({
	completed: z.boolean(),
});

export const updateTodoParamSchema = z.object({
	id: z.string().length(24),
});

export const updateTodoJsonSchema = z.object({
	description: z.string().min(1),
});

export const deleteTodoSchema = z.object({
	id: z.string().length(24),
});
