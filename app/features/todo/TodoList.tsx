// TodoList.tsx
import TodoItem from './TodoItem';
import AddTodoForm from './AddTodoForm';
import { getTodos, addTodo, updateTodo, deleteTodo, editTodo } from './TodoActions';

interface Todo {
  id: number;
  description: string;
  completed: boolean;
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
            editTodo={editTodo}
          />
        ))}
      </ul>
    </div>
  );
}
