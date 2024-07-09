'use client'

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import type { z } from 'zod';
import { addTodo } from './TodoActions';
import { createTodoSchema } from '@/app/schema';

type TodoFormData = z.infer<typeof createTodoSchema>;

export default function AddTodoForm() {
  const [serverError, setServerError] = useState<string | null>(null);
  const { register, handleSubmit, reset, formState: { errors } } = useForm<TodoFormData>({
    resolver: zodResolver(createTodoSchema)
  });

  const onSubmit = async (data: TodoFormData) => {
    try {
      setServerError(null);
      await addTodo(new FormData(document.getElementById('addTodoForm') as HTMLFormElement));
      reset();
    } catch (error) {
      if (error instanceof Error) {
        setServerError(error.message);
      } else {
        setServerError('An unexpected error occurred');
      }
    }
  };

  return (
    <form id="addTodoForm" onSubmit={handleSubmit(onSubmit)} className="mb-4">
      <input
        {...register('description')}
        type="text"
        placeholder="Add a new todo"
        className="w-full p-2 border rounded"
      />
      {errors.description && (
        <p className="mt-1 text-sm text-red-600">{errors.description.message}</p>
      )}
      {serverError && (
        <p className="mt-1 text-sm text-red-600">{serverError}</p>
      )}
      <button type="submit" className="mt-2 px-4 py-2 bg-blue-500 text-white rounded">
        Add Todo
      </button>
    </form>
  );
}
