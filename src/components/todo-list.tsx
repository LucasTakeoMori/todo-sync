import { v4 as uuidv4 } from 'uuid';
import { useState, type FormEvent } from "react";

import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { Separator } from "./ui/separator";
import { CardUser } from "./card-user";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from './ui/accordion';

import { toast } from "sonner";
import { PlusCircle, Trash, SearchIcon, Timer, CalendarDays, Check } from "lucide-react";
import { format, formatDistanceToNow } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import z from "zod";
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
    const [task, setTask] = useState<Task[]>(() => {
        const storedTasks = localStorage.getItem('tasks');
        return storedTasks ? JSON.parse(storedTasks) : [];
    });

    const [search, setSearch] = useState('');

    async function handleCreateNewTask(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();

        await new Promise(resolve => setTimeout(resolve, 1000));

        const inputValue = (event.target as HTMLFormElement).querySelector('input')?.value;
        const existingTask = task.find(task => task.title === inputValue && !task.completed);

        if (!inputValue) return;

        if (existingTask) {
            toast.error('Já existe uma tarefa com essa descrição', {
                position: 'top-right',
                duration: 2000
            });
            return;
        }

        try {
            const newTask: Task = {
                id: uuidv4(),
                title: inputValue,
                createdAt: new Date(),
                completed: false,
            };

            const updatedTasks = [...task, newTask];
            setTask(updatedTasks);

            localStorage.setItem('tasks', JSON.stringify(updatedTasks));

            toast.success('Tarefa criada com sucesso', {
                position: 'top-right',
                duration: 2000
            });

            (event.target as HTMLFormElement).reset();
        } catch (error) {
            const errorMsg = error as Error;

            toast.error(`Erro ao tentar criar a sua tarefa! | ${errorMsg.message}`, {
                position: 'top-right',
                duration: 2000
            });

            console.error(error);
        }
    }

    async function handleConcludedTask(id: string) {
        await new Promise(resolve => setTimeout(resolve, 1000))

        task.forEach((task) => {
            if (task.id === id) {
                task.completed = true;
                task.completedAt = new Date();
            }
        })

        localStorage.setItem('tasks', JSON.stringify(task));

        toast.success('Tarefa concluída com sucesso', {
            position: 'top-right',
            duration: 2000
        })

        setTask([...task])
        return;
    }

    async function handleRemoveTask(id: string) {
        await new Promise(resolve => setTimeout(resolve, 1000))

        task.forEach((task) => {
            if (task.id === id) {
                task.deletedAt = new Date();
            }
        })

        localStorage.setItem('tasks', JSON.stringify(task));

        toast.success('Tarefa excluída com sucesso', {
            position: 'top-right',
            duration: 2000
        })

        setTask(task);
        return;
    }

    const createdTaskCount = task.length;

    const completedTaskCount = task.filter(task => task.completed === true).length;
    const canceledTaskCount = task.filter(task => task.deletedAt).length;

    const filteredTasks = task.filter((task) => task.title.toLowerCase().includes(search.toLowerCase()) && task.completed === false && !task.deletedAt).reverse();

    return (
        <div className='flex flex-col items-center gap-4 justify-center mx-auto'>
            <CardUser createdTasksCount={createdTaskCount} completedTasksCount={completedTaskCount} />

            <Separator orientation="horizontal" className="w-[490px]" />

            <div className="flex items-center gap-4">
                <SearchIcon size={20} />

                <Input className="text-zinc-400 w-[430px] h-8 rounded-2xl col-span-3" placeholder="Buscar tarefa" value={search} onChange={(e) => setSearch(e.target.value)} required />
            </div>


            <form onSubmit={handleCreateNewTask} className="flex items-center justify-center gap-1">
                <Input className="text-zinc-400 w-[395px] h-12 rounded-xl col-span-3" placeholder="Crie uma tarefa" required />

                <Button className="flex items-center gap-2 text-sm h-12 rounded-xl hover:opacity-90 transition-all duration-300">
                    Criar
                    <PlusCircle size={20} />
                </Button>
            </form>

            <div className='flex flex-col gap-4 items-center bg-zinc-900 rounded-xl w-[500px] h-[500px] py-4 px-4'>
                {filteredTasks.length > 0 ? (
                    filteredTasks.map((item) => (
                        <div key={item.id} className='w-full flex items-start bg-zinc-800 border-l-rose-500 border-l-4 rounded-[10px] p-2'>
                            <div className='flex flex-col items-start justify-center flex-1'>
                                <div className='flex items-center gap-4'>
                                    <Avatar className='w-6 h-6 rounded-full'>
                                        <AvatarImage src="./public/avatar.jpeg" className="object-cover object-center rounded-full" />
                                        <AvatarFallback>User</AvatarFallback>
                                    </Avatar>

                                    <p className='flex items-center gap-2 text-xs text-muted-foreground'>
                                        {format(new Date(item.createdAt), 'dd/MM/yyyy')}
                                        <CalendarDays className='w-4 h-4 text-white' />
                                    </p>
                                </div>

                                <p className='flex items-center gap-2 text-sm text-muted-foreground mt-4'>
                                    {item.title}
                                </p>
                            </div>

                            <div className='flex flex-col items-end gap-4 ml-auto'>
                                <Button className='flex items-center gap-2 text-sm h-6 rounded-full hover:opacity-90 transition-all duration-300' onClick={() => handleConcludedTask(item.id)}>
                                    <Check className='w-4 h-4' />
                                </Button>

                                <Button className='flex items-center gap-2 text-sm h-6 rounded-full hover:opacity-90 transition-all duration-300' onClick={() => handleRemoveTask(item.id)}>
                                    <Trash className='w-4 h-4' />
                                </Button>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className='flex flex-col items-center justify-center flex-1'>
                        <p className='text-sm text-muted-foreground'>
                            Quais as suas próximas tarefas?
                        </p>
                    </div>
                )}
            </div>

            <div className='w-[500px]'>
                <Accordion type="single" collapsible className="w-full">
                    <AccordionItem value="item-1">
                        <AccordionTrigger>
                            <div className='flex items-center gap-1'>
                                Tarefas Finalizadas <span className='ml-2 text-muted-foreground'>{completedTaskCount}</span>
                            </div>
                        </AccordionTrigger>
                        <AccordionContent>
                            {task.filter((task) => task.completed === true).map((task) => {
                                return (
                                    <div className='flex flex-col items-start gap-2 p-2'>
                                        <div className='bg-zinc-800 rounded-xl p-4 w-full shadow-md'>
                                            <p className='text-sm text-gray-400'>
                                                <span className='font-semibold text-white'>ID:</span> <span className='ml-2'>{task.id}</span>
                                            </p>
                                            <p className='text-sm text-gray-400 mt-2'>
                                                <span className='font-semibold text-white'>Título da tarefa:</span> <span className='ml-2'>{task.title}</span>
                                            </p>

                                            <p className='flex items-center gap-2 text-sm text-gray-400 mt-2'>
                                                <Timer className='w-4 h-4 text-white' />
                                                {formatDistanceToNow(new Date(task.createdAt), {
                                                    locale: ptBR,
                                                    addSuffix: true
                                                })}
                                            </p>
                                        </div>
                                    </div>
                                )
                            })}
                        </AccordionContent>
                    </AccordionItem>

                    <AccordionItem value="item-2">
                        <AccordionTrigger>
                            <div className='flex items-center gap-1'>
                                Tarefas Excluídas <span className='ml-2 text-muted-foreground'>{canceledTaskCount}</span>
                            </div>
                        </AccordionTrigger>
                        <AccordionContent>
                            {task.filter((task) => task.deletedAt !== null).map((task) => {
                                return (
                                    <div className='flex flex-col items-start gap-2 p-2'>
                                        <div className='bg-zinc-800 rounded-xl p-4 w-full shadow-md'>
                                            <p className='text-sm text-gray-400'>
                                                <span className='font-semibold text-white'>ID:</span> <span className='ml-2'>{task.id}</span>
                                            </p>
                                            <p className='text-sm text-gray-400 mt-2'>
                                                <span className='font-semibold text-white'>Título da tarefa:</span> <span className='ml-2'>{task.title}</span>
                                            </p>

                                            <p className='flex items-center gap-2 text-sm text-gray-400 mt-2'>
                                                <Timer className='w-4 h-4 text-white' />
                                                {formatDistanceToNow(new Date(task.createdAt), {
                                                    locale: ptBR,
                                                    addSuffix: true
                                                })}
                                            </p>
                                        </div>
                                    </div>
                                )
                            })}
                        </AccordionContent>
                    </AccordionItem>
                </Accordion>
            </div>
        </div>
    )
}