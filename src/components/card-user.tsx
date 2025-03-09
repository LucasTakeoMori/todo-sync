import {  Briefcase, User } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";

interface CardUserProps {
    createdTasksCount: number
    completedTasksCount: number
}

export function CardUser({ createdTasksCount, completedTasksCount }: CardUserProps) {
    return (
        <div className="flex items-center justify-center gap-6 px-6 mt-4">
            <div className="flex items-center justify-between w-[460px]">
                <div className="flex gap-4">
                    <Avatar>
                        <AvatarImage src="./public/avatar.jpeg" className="object-cover object-center" />
                        <AvatarFallback>User</AvatarFallback>
                    </Avatar>

                    <div className="flex flex-col">
                        <div className="flex items-center gap-1">
                            <User className="w-4 h-4 text-sm text-zinc-500 font-bold" />
                            <span className="text-sm text-zinc-500 font-bold">
                                user.io
                            </span>
                        </div>

                        <div className="flex items-center gap-1">
                            <Briefcase className="w-4 h-4 text-sm text-zinc-500 font-bold" />

                            <span className="text-sm text-zinc-500">
                                Developer
                            </span>
                        </div>
                    </div>
                </div>

                <div className="flex flex-col">
                    {
                        createdTasksCount === 1
                            ? <p className="text-sm text-zinc-500"><span className="text-sm text-rose-500">{createdTasksCount}</span> tarefa criada</p>
                            : <p className="text-sm text-zinc-500"><span className="text-sm text-rose-500">{createdTasksCount}</span> tarefas criadas</p>
                    }

                    <p className="text-sm text-zinc-500">
                        <span className="text-sm text-rose-500">{completedTasksCount}</span> concluídas
                    </p>
                </div>
            </div>
        </div>
    )
}