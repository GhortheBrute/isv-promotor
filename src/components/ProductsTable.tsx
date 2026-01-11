import {Product} from "@/types";

interface PropsTable {
    products: Product[];
}

export default async function ProductsTable({products}: PropsTable){
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
                {products.map((product) => (
                    <tr key={product.sku} className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 print:break-inside-avoid">
                        <td className="px-4 py-3 text-center font-medium text-gray-900 dark:text-white">{product.sku}</td>
                        <td className="px-4 py-3 text-gray-700 dark:text-gray-300">{product.description}</td>
                        <td className="px-4 py-3 text-center">{product.packaging}</td>
                        <td className="px-4 py-3 text-xs uppercase">{product.supplier}</td>
                        <td className="px-4 py-3 text-right font-mono text-blue-700 dark:text-blue-400 font-bold">{product.emb1}</td>
                        <td className="px-4 py-3 text-right font-mono text-purple-700 dark:text-purple-400 font-bold">{product.emb9}</td>
                        <td className="px-4 py-3 text-center">{product.age}</td>
                        <td className={`px-4 py-3 text-center font-bold ${product.missSale > 30 ? 'text-red-600 dark:text-red-400' : ''}`}>{product.missSale}</td>
                        <td className="px-4 py-3 text-xs uppercase">{product.sector}</td>
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
    )
}