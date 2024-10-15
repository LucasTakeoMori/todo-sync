export function Header() {
    return (
        <div className="border-b">
            <div className="flex items-center justify-center gap-6 px-6 h-16">
                <img src="/sync-logo.svg" alt="" />

                <h1 className="text-3xl font-bold"> TodoSync </h1>
            </div>
        </div>
    )
}