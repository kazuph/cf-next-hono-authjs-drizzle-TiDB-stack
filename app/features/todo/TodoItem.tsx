'use client'

import { useTransition, useState, useRef, useEffect } from 'react';

interface Todo {
  id: number;
  description: string;
  completed: boolean;
}

interface TodoItemProps {
  todo: Todo;
  updateTodo: (id: number, completed: boolean) => Promise<void>;
  deleteTodo: (id: number) => Promise<void>;
  editTodo: (id: number, description: string) => Promise<void>;
}

export default function TodoItem({ todo, updateTodo, deleteTodo, editTodo }: TodoItemProps) {
  const [isPending, startTransition] = useTransition();
  const [isEditing, setIsEditing] = useState(false);
  const [editedDescription, setEditedDescription] = useState(todo.description);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isEditing]);

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

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleEditSubmit = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      startTransition(() => {
        editTodo(todo.id, editedDescription);
      });
      setIsEditing(false);
    }
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
        {isEditing ? (
          <input
            ref={inputRef}
            type="text"
            value={editedDescription}
            onChange={(e) => setEditedDescription(e.target.value)}
            onKeyDown={handleEditSubmit}
            className="flex-grow"
            disabled={isPending}
          />
        ) : (
          <span
            className={`flex-grow cursor-pointer ${todo.completed ? 'line-through' : ''}`}
            onClick={handleEdit}
          >
            {todo.description}
          </span>
        )}
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
