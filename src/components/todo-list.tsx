import { useState } from "react";
import { toast } from "sonner";
import z from "zod";
import { CardUser } from "./card-user";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { PlusCircle, Trash, SearchIcon } from "lucide-react";
import { Separator } from "./ui/separator";
import { v4 as uuidv4 } from 'uuid';

interface Task {
    id: string;
    title: string;
    createdAt: Date;
    deletedAt?: Date;
    completedAt?: Date;
    completed: boolean;
}

const Task = z.object({
    id: z.string(),
    title: z.string(),
    createdAt: z.date(),
    deletedAt: z.date(),
    completedAt: z.date(),
    completed: z.boolean(),
})

export function TodoList() {
    const [task, setTask] = useState<Task[]>([]);
    const [search, setSearch] = useState('');
    const [isOpen, setIsOpen] = useState(false);

    async function handleCreateNewTask(event: any) {
        event.preventDefault()

        await new Promise(resolve => setTimeout(resolve, 1000))

        const inputValue = event.target.querySelector('input').value;
        const existingTask = task.find(task => task.title === inputValue && task.completed === false);

        if (!inputValue) return;

        if (existingTask) {
            toast.error('Já existe uma tarefa com esse descrição', {
                position: 'top-right',
                duration: 2000
            })

            return;
        }

        try {
            const newTask = {
                id: uuidv4(),
                title: inputValue,
                createdAt: new Date(),
                completed: false,
            }

            const updatedTasks = [...task, newTask]
            setTask(updatedTasks)

            toast.success('Tarefa criada com sucesso', {
                position: 'top-right',
                duration: 2000
            })

            event.target.reset()
        } catch (error) {
            const errorMsg = error as Error

            toast.error(`Erro ao tentar criar a sua tarefa! | ${errorMsg}`, {
                position: 'top-right',
                duration: 2000
            })

            console.log(error)
        }
    }

    async function handleRemoveTask(id: string) {
        await new Promise(resolve => setTimeout(resolve, 1000))

        task.forEach((task) => {
            if (task.id === id) {
                task.deletedAt = new Date();
            }
        })

        const updatedTasks = task.filter(task => task.id !== id);

        toast.success('Tarefa excluída com sucesso', {
            position: 'top-right',
            duration: 2000
        })

        setTask(updatedTasks);
        return;
    }

    async function handleConcludedTask(id: string) {
        await new Promise(resolve => setTimeout(resolve, 1000))

        task.forEach((task) => {
            if (task.id === id) {
                task.completed = true;
                task.completedAt = new Date();
            }
        })

        toast.success('Tarefa concluída com sucesso', {
            position: 'top-right',
            duration: 2000
        })

        setTask([...task])
        return;
    }

    const countCreatedTaskCount = task.length
    const countCompletedTaskCount = task.filter(task => task.completed === true).length;

    return (
        <>
            <CardUser createdTasksCount={countCreatedTaskCount} completedTasksCount={countCompletedTaskCount} />

            <div className="flex flex-col items-center justify-center gap-5">
                <div className="flex items-center gap-2">
                    {/* <Input className="text-zinc-400 w-[430px] h-12 rounded-xl col-span-3" placeholder="Buscar tarefa..." value={search} onChange={(e) => setSearch(e.target.value)} required /> */}

                    <SearchIcon size={20} />

                    <Input className="text-zinc-400 w-[430px] h-8 rounded-2xl col-span-3" placeholder="Buscar tarefa..." value={search} onChange={(e) => setSearch(e.target.value)} required />
                </div>

                <Separator orientation="horizontal" className="w-[490px]" />

                <form onSubmit={handleCreateNewTask} className="flex items-center justify-center gap-1">
                    <Input className="text-zinc-400 w-[395px] h-12 rounded-xl col-span-3" placeholder="Crie uma tarefa..." required />

                    <Button className="flex items-center gap-2 text-sm h-12 rounded-xl hover:opacity-90 transition-all duration-300">
                        Criar
                        <PlusCircle size={20} />
                    </Button>
                </form>

                <div className={`bg-zinc-900 ${task.filter(task => task.completed === false && !task.deletedAt).length > 0 ? 'h-auto' : 'h-[400px]'} w-[490px] rounded-xl transition-all duration-300`}>
                    {task.filter(task => task.completed === false && !task.deletedAt).length > 0 ? (
                        task.filter(task => task.completed === false && !task.deletedAt && task.title.toLowerCase().includes(search.toLowerCase())).slice(0, 10).map(task => (
                            <ul key={task.id} className="p-2">
                                <li className="mb-3 bg-zinc-800 p-2 rounded-xl hover:bg-zinc-700 transition-all duration-300">
                                    <div className="flex items-center justify-between w-[460px]">
                                        <div className="flex gap-4">
                                            <Input type="checkbox" onClick={() => handleConcludedTask(task.id)} className="w-3 h-3" />
                                            <div className="flex flex-col">
                                                <span className="text-base text-zinc-400">{task.title}</span>
                                                <span className="text-xs text-zinc-500">
                                                    {task.createdAt.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric' })}
                                                </span>
                                            </div>
                                        </div>
                                        <div className="flex gap-4">
                                            <Button
                                                className="flex items-center gap-2 text-sm h-12 rounded-xl hover:opacity-90 transition-all duration-300"
                                                onClick={() => handleRemoveTask(task.id)}
                                            >
                                                <Trash size={20} />
                                            </Button>
                                        </div>
                                    </div>
                                </li>
                            </ul>
                        ))
                    ) : (
                        <div className="flex justify-center items-center h-full">
                            <p className="text-zinc-400">Crie uma tarefa!</p>
                        </div>
                    )}
                </div>
            </div>
        </>
    )
}