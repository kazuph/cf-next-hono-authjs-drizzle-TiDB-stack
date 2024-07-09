// TodoList.tsx
import { headers } from 'next/headers';
import { revalidatePath } from 'next/cache';
import { hc } from "hono/client";
import type { AppType } from "@/app/api/[[...route]]/route";
import TodoItem from './TodoItem';
import AddTodoForm from './AddTodoForm';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3000';
const client = hc<AppType>(API_BASE_URL);

interface Todo {
  id: number;
  description: string;
  completed: boolean;
}

async function getTodos() {
  const headersList = headers();
  const cookie = headersList.get('cookie');

  try {
    const response = await client.api.todos.$get({}, {
      headers: {
        'Cookie': cookie || '',
      },
    });
    if (!response.ok) {
      throw new Error(`Failed to fetch todos: ${response.status} ${response.statusText}`);
    }
    return response.json();
  } catch (error) {
    console.error('Error fetching todos:', error);
    throw error;
  }
}

async function addTodo(formData: FormData) {
  'use server'
  const description = formData.get('description') as string;
  if (description) {
    const headersList = headers();
    const cookieHeader = headersList.get('cookie');
    try {
      await client.api.todos.$post({
        json: { description }
      }, {
        headers: {
          'Cookie': cookieHeader || '',
        },
      });
      revalidatePath('/');
    } catch (error) {
      console.error('Error adding todo:', error);
      throw error;
    }
  }
}

async function updateTodo(id: number, completed: boolean) {
  'use server'
  const headersList = headers();
  const cookieHeader = headersList.get('cookie');
  try {
    await client.api.todos[':id'].toggle.$put({
      param: { id: id.toString() },
      json: { completed }
    }, {
      headers: {
        'Cookie': cookieHeader || '',
      },
    });
    revalidatePath('/');
  } catch (error) {
    console.error('Error updating todo:', error);
    throw error;
  }
}

async function deleteTodo(id: number) {
  'use server'
  const headersList = headers();
  const cookieHeader = headersList.get('cookie');
  try {
    await client.api.todos[':id'].$delete({
      param: { id: id.toString() }
    }, {
      headers: {
        'Cookie': cookieHeader || '',
      },
    });
    revalidatePath('/');
  } catch (error) {
    console.error('Error deleting todo:', error);
    throw error;
  }
}

export default async function TodoList() {
  const todos = await getTodos();

  return (
    <div className="w-full max-w-3xl mx-auto mt-10">
      <h1 className="mb-4 text-2xl font-bold">Todo List</h1>
      <AddTodoForm addTodo={addTodo} />
      <ul className="w-full">
        {todos.map((todo: Todo) => (
          <TodoItem
            key={todo.id}
            todo={todo}
            updateTodo={updateTodo}
            deleteTodo={deleteTodo}
          />
        ))}
      </ul>
    </div>
  );
}
