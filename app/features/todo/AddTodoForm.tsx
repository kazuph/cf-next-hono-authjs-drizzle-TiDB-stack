'use client'

import { useRef } from 'react';

interface AddTodoFormProps {
  addTodo: (formData: FormData) => Promise<void>;
}

export default function AddTodoForm({ addTodo }: AddTodoFormProps) {
  const formRef = useRef<HTMLFormElement>(null);

  return (
    <form ref={formRef} action={addTodo} className="flex mb-4">
      <input
        name="description"
        type="text"
        placeholder="Add a new todo"
        className="flex-grow p-2 mr-2 border rounded"
      />
      <button type="submit" className="px-4 py-2 text-white bg-blue-500 rounded">
        Add Todo
      </button>
    </form>
  );
}
