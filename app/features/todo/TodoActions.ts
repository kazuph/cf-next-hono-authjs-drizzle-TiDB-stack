"use server";

import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import { hc } from "hono/client";
import type { AppType } from "@/app/api/[[...route]]/route";

const API_BASE_URL =
	process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:3000";

const client = hc<AppType>(API_BASE_URL, {
	fetch: (input, init) => {
		const cookieStore = cookies();
		const headers = new Headers(init?.headers);
		headers.set("Cookie", cookieStore.toString());
		return fetch(input, { ...init, headers });
	},
});

export async function getTodos() {
	try {
		const response = await client.api.todos.$get();
		if (!response.ok) {
			throw new Error(
				`Failed to fetch todos: ${response.status} ${response.statusText}`,
			);
		}
		return response.json();
	} catch (error) {
		console.error("Error fetching todos:", error);
		throw error;
	}
}

export async function addTodo(formData: FormData) {
	const description = formData.get("description") as string;
	if (description) {
		try {
			await client.api.todos.$post({
				json: { description },
			});
			revalidatePath("/");
		} catch (error) {
			console.error("Error adding todo:", error);
			throw error;
		}
	}
}

export async function editTodo(id: number, description: string) {
	try {
		await client.api.todos[":id"].$put({
			param: { id: id.toString() },
			json: { description },
		});
		revalidatePath("/");
	} catch (error) {
		console.error("Error editing todo:", error);
		throw error;
	}
}

export async function updateTodo(id: number, completed: boolean) {
	try {
		await client.api.todos[":id"].toggle.$put({
			param: { id: id.toString() },
			json: { completed },
		});
		revalidatePath("/");
	} catch (error) {
		console.error("Error updating todo:", error);
		throw error;
	}
}

export async function deleteTodo(id: number) {
	try {
		await client.api.todos[":id"].$delete({
			param: { id: id.toString() },
		});
		revalidatePath("/");
	} catch (error) {
		console.error("Error deleting todo:", error);
		throw error;
	}
}
