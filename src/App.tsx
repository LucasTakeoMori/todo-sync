import { Header } from "./components/header";
import { Toaster } from 'sonner'
import { TodoList } from "./components/todo-list";


export function App() {
  return (
    <>
      <Toaster richColors />

      <Header />
      <TodoList />
    </>
  )
}
