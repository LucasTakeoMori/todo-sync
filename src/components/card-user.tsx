import { Avatar, AvatarImage } from "./ui/avatar";

interface CardUserProps {
    createdTasksCount: number
    completedTasksCount: number
    // excludedTasksCount: number
}

export function CardUser({ createdTasksCount, completedTasksCount }: CardUserProps) {
    return (
        <div className="flex items-center justify-center gap-6 mt-5 mb-16 px-6">
            <div className="flex items-center justify-between w-[460px]">
                <div className="flex gap-4">
                    <Avatar>
                        <AvatarImage src="https://github.com/lucastakeomori.png" />
                    </Avatar>

                    <div className="flex flex-col">
                        <span className="text-sm text-zinc-500 font-bold">
                            @lucas.mori
                        </span>

                        <span className="text-sm text-zinc-500">
                            Developer
                        </span>
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