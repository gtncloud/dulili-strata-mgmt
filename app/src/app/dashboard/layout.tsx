
import { verifySession } from "@/lib/session";
import { Sidebar } from "./_components/sidebar";
import { redirect } from "next/navigation";
import { GlobalSearch } from "@/components/global-search";
import { WattleIllustration } from "@/components/wattle-illustration";

export default async function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const session = await verifySession();

    if (!session?.isAuth) {
        redirect("/auth/login");
    }

    return (
        <div className="grid min-h-screen w-full md:grid-cols-[240px_1fr] bg-gray-50 relative">
            {/* Background Watermark */}
            <div className="fixed inset-0 flex items-center justify-center pointer-events-none opacity-[0.03] z-0">
                <WattleIllustration className="w-full max-w-3xl h-auto" />
            </div>
            
            <div className="hidden border-r border-gray-200 bg-gray-50 md:block relative z-10">
                <Sidebar userRole={session.role} />
            </div>
            <div className="flex flex-col relative z-10">
                <header className="flex h-14 items-center gap-4 border-b border-gray-200 bg-white px-5 sticky top-0 z-10">
                    <div className="flex-1 flex items-center gap-4">
                        <span className="font-semibold text-sm text-gray-900 md:hidden">Dulili</span>
                        <div className="hidden md:block flex-1 max-w-xl">
                            <GlobalSearch />
                        </div>
                    </div>
                </header>
                <main className="flex-1 p-5 bg-gray-50">
                    {children}
                </main>
            </div>
        </div>
    );
}
