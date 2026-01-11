import {getProducts} from "@/services/productService";
import ProductsTable from "@/components/ProductsTable";
import SearchFilters from "@/components/SearchFilters";
import HeaderActions from "@/components/HeaderActions";

interface PageProps {
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}
export default async function Home(props: PageProps) {
    const searchParams = await props.searchParams;

    // Extrai os filtros da URL
    const filters = {
        supplier: typeof searchParams.supplier === 'string' ? searchParams.supplier : undefined,
        query: typeof searchParams.query === 'string' ? searchParams.query : undefined,
    }

    // Busca produtos filtrados para a tabela
    const products = await getProducts(filters);

    // Busca todos os produtos apenas para pegar a lista de fornecedores únicos
    const allProducts = await getProducts();

    // Set transforma o array com valores únicos
    const uniqueSuppliers = Array.from(new Set(allProducts.map(p => p.supplier)));

    return (
        <main className="p-8 bg-gray-50 dark:bg-gray-900 min-h-screen transition-colors duration-200">

            {/* Cabeçalho Flexível */}
            <div className="flex flex-col md:flex-row justify-between items-center mb-6">
                <h1 className="text-2xl font-bold text-gray-800 dark:text-white uppercase">
                    Dashboard de Estoque
                </h1>

                {/* Ações (Imprimir, Baixar, Tema) */}
                <HeaderActions data={products} />
            </div>

            {/* SearchFilters ganha a classe 'no-print' para sumir na impressão */}
            <div className="no-print">
                <SearchFilters suppliersList={uniqueSuppliers} />
            </div>

            <div className="mb-2 text-sm text-gray-600 dark:text-gray-400 uppercase flex justify-between items-center">
                <span>Resultados encontrados: <span className="font-bold text-black dark:text-white">{products.length}</span></span>
            </div>

            <ProductsTable products={products}/>
        </main>
    );
}
