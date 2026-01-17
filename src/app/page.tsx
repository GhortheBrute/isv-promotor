import DashboardClient from "@/components/DashboardClient";
import {Suspense} from "react";

export default async function Home() {
    return (
        <main className="p-8 bg-gray-50 dark:bg-gray-900 min-h-screen transition-colors duration-200 print:bg-white">
            {/* Usamos Suspense para garantir que o useSearchParams dentro do
                DashboardClient não trave a renderização inicial
            */}
            <Suspense fallback={null}>
                <DashboardClient />
            </Suspense>
        </main>
    );
}