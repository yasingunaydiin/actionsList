import { Card, CardHeader, CardTitle } from '@/app/components/ui/card';
import { Todo } from '@prisma/client';
import { useEffect } from 'react';
import CreateTodo from './Createtodo';
import DeleteTodo from './Deletetodo';
import UpdateTodo from './Updatetodo';

interface TodoListProps {
  todos: Todo[] | null;
  setTodos: React.Dispatch<React.SetStateAction<Todo[] | null>>;
}

const EmptyState = () => (
  <div className='space-y-3'>
    <div>
      <p className='text-center text-lg text-zinc-500'>
        All tasks completed! Enjoy your day. ✨
      </p>
    </div>
  </div>
);

const renderTodoTitle = (title: string) => {
  const urlRegex = /(https?:\/\/[^\s]+)/g;
  return title.split(urlRegex).map((part, index) =>
    part.match(urlRegex) ? (
      <a
        key={index}
        href={part}
        target='_blank'
        rel='noopener noreferrer'
        className='text-blue-500 underline'
      >
        {part}
      </a>
    ) : (
      part
    )
  );
};

export default function TodoList({ todos, setTodos }: TodoListProps) {
  // Make sure to load todos from localStorage when the component mounts
  useEffect(() => {
    const storedTodos = localStorage.getItem('todos');
    if (storedTodos) {
      setTodos(JSON.parse(storedTodos)); // Load from localStorage
    }
  }, [setTodos]); // Ensure useEffect is only called once on mount

  const toggleComplete = (id: string) => {
    if (todos) {
      const updatedTodos = todos.map((todo) =>
        todo.id === id ? { ...todo, isCompleted: !todo.isCompleted } : todo
      );

      setTodos(updatedTodos);
      localStorage.setItem('todos', JSON.stringify(updatedTodos)); // Update localStorage
    }
  };

  if (!todos || todos.length === 0) {
    return <EmptyState />;
  }

  return (
    <div className='space-y-3'>
      {todos.map((todo) => (
        <Card
          key={todo.id}
          className='group relative flex w-96 max-w-md items-center rounded-lg border border-zinc-700/50 bg-zinc-900/70 text-white backdrop-blur-sm transition-all hover:bg-zinc-800/70 hover:shadow-[0_0_15px_rgba(255,255,255,0.1)]'
        >
          <div className='m-3 flex justify-center'>
            <input
              type='checkbox'
              className='size-4 accent-orange-500 appearance-auto rounded-md border'
              checked={todo.isCompleted}
              onChange={() => toggleComplete(todo.id)}
            />
          </div>
          <div className='absolute right-2 flex space-x-1 opacity-0 transition-opacity group-hover:opacity-100'>
            <UpdateTodo todo={todo} setTodos={setTodos} />
            <DeleteTodo id={todo.id} setTodos={setTodos} />
          </div>
          <CardHeader className='h-3 flex items-center justify-center'>
            <CardTitle>
              {todo.isCompleted ? (
                <span className='line-through'>
                  {renderTodoTitle(todo.title)}
                </span>
              ) : (
                renderTodoTitle(todo.title)
              )}
            </CardTitle>
          </CardHeader>
        </Card>
      ))}
      <CreateTodo setTodos={setTodos} />
    </div>
  );
}
