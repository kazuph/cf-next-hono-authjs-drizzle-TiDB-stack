'use client'

import { useTransition } from 'react';

interface Todo {
  id: number;
  description: string;
  completed: boolean;
}

interface TodoItemProps {
  todo: Todo;
  updateTodo: (id: number, completed: boolean) => Promise<void>;
  deleteTodo: (id: number) => Promise<void>;
}

export default function TodoItem({ todo, updateTodo, deleteTodo }: TodoItemProps) {
  const [isPending, startTransition] = useTransition();

  const handleToggle = () => {
    startTransition(() => {
      updateTodo(todo.id, !todo.completed);
    });
  };

  const handleDelete = () => {
    startTransition(() => {
      deleteTodo(todo.id);
    });
  };

  return (
    <li className="flex items-center justify-between w-full p-2 mb-2 border-b">
      <div className="flex items-center flex-grow">
        <input
          type="checkbox"
          checked={todo.completed}
          onChange={handleToggle}
          className="mr-2"
          disabled={isPending}
        />
        <span className={`flex-grow ${todo.completed ? 'line-through' : ''}`}>
          {todo.description}
        </span>
      </div>
      <button
        onClick={handleDelete}
        className="ml-2 text-red-500"
        disabled={isPending}
      >
        Delete
      </button>
    </li>
  );
}
