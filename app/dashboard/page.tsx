import dynamic from 'next/dynamic'
// const TodoList = dynamic(() => import('@/components/TodoList'), { ssr: false })
import TodoList from '@/app/features/todo/TodoList'


export default function DashboardPage() {
  return (
    <div className="w-full max-w-3xl pb-16 mx-auto mt-10">
      <TodoList />
    </div>
  );
}
