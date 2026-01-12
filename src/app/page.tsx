import {getProducts} from "@/services/productService";
import DashboardClient from "@/components/DashboardClient";
import {Suspense} from "react";

export default async function Home() {
    const allProducts = await getProducts();

    return (
        <main className="p-8 bg-gray-50 dark:bg-gray-900 min-h-screen transition-colors duration-200">
            {/* Usamos Suspense para garantir que o useSearchParams dentro do
                DashboardClient não trave a renderização inicial
            */}
            <Suspense fallback={
                <div className="flex items-center justify-center h-screen text-gray-500">
                    Carregando dados...
                </div>
            }>
                <DashboardClient initialProducts={allProducts} />
            </Suspense>
        </main>
    );
}