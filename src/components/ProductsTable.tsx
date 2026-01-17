import {Product} from "@/types";

interface PropsTable {
    products: Product[];
    isLoading: boolean;
}

export default async function ProductsTable({products, isLoading}: PropsTable){
    return (
        <div className="overflow-x-auto shadow-md sm:rounded-lg">
            <table className="w-full text-sm text-left uppercase text-gray-500 dark:text-gray-400">
                <thead className="text-xs text-gray-700 uppercase bg-gray-100 dark:bg-gray-700 dark:text-gray-200">
                <tr>
                    <th className="px-4 py-3 text-center">Código</th>
                    <th className="px-4 py-3 text-center">Descrição</th>
                    <th className="px-4 py-3 text-center">Embalagem</th>
                    <th className="px-4 py-3 text-center">Fornecedor</th>
                    <th className="px-4 py-3 text-center">Emb1</th>
                    <th className="px-4 py-3 text-center">Emb9</th>
                    <th className="px-4 py-3 text-center">Idade</th>
                    <th className="px-4 py-3 text-center">Sem Venda</th>
                    <th className="px-4 py-3 text-center">Grupo</th>
                </tr>
                </thead>
                <tbody>
                    {/* Cenário 1 - Carregando */}
                    {isLoading ? (
                        <tr>
                            <td colSpan={9} className="px-6 py-10 text-center">
                                <div className="flex flex-col items-center justify-center">
                                    <div className="w-8 h-8 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mb-2"></div>
                                    <span className="text-gray-500 font-medium animate-pulse">
                                        Carregando dados do estoque...
                                    </span>
                                </div>
                            </td>
                        </tr>
                    ) : products.length === 0 ? (
                        /* Cenário 2 - Sem resultados */
                        <tr>
                            <td colSpan={9} className="px-6 py-8 text-center text-gray-500 italic">
                                Nenhum produto encontrado com os filtros atuais.
                            </td>
                        </tr>
                    ) : (
                        /* --- CENÁRIO 3: LISTA DE PRODUTOS --- */
                        products.map((product) => (
                            <tr key={product.sku} className="bg-white border-b hover:bg-gray-50 dark:bg-gray-800 dark:border-gray-700 dark:hover:bg-gray-600 transition-colors">
                                <td className="px-3 py-2 font-medium text-gray-900 whitespace-nowrap dark:text-white">{product.sku}</td>
                                <td className="px-3 py-2">{product.description}</td>
                                <td className="px-3 py-2">{product.packaging}</td>
                                <td className="px-3 py-2 truncate max-w-[150px]" title={product.supplier}>{product.supplier}</td>
                                <td className="px-3 py-2 text-center font-bold text-blue-600 dark:text-blue-400">{product.emb1.toLocaleString('pt-BR', {maximumFractionDigits: 0})}</td>
                                <td className="px-3 py-2 text-center font-bold text-green-600 dark:text-green-400">{product.emb9.toLocaleString('pt-BR', {maximumFractionDigits: 0})}</td>
                                <td className="px-3 py-2 text-center">{Math.floor(product.age)}</td>
                                <td className="px-3 py-2 text-center text-red-600 font-medium">{Math.floor(product.missSale)}</td>
                                <td className="px-3 py-2 text-xs">{product.sector}</td>
                            </tr>
                        ))
                    )}
                </tbody>
            </table>
        </div>
    );
}