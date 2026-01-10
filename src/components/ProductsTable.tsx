import {Product} from "@/types";

interface PropsTable {
    products: Product[];
}

export default async function ProductsTable({products}: PropsTable){
    return (
        <div className="overflow-x-auto">
            <table className="w-full text-sm text-left uppercase">
                <thead className="bg-gray-100 uppercase">
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
                    <tr key={product.sku} className="border-b hover:bg-gray-50">
                        <td className="px-4 py-3 text-center">{product.sku}</td>
                        <td className="px-4 py-3">{product.description}</td>
                        <td className="px-4 py-3 text-center">{product.packaging}</td>
                        <td className="px-4 py-3">{product.supplier}</td>
                        <td className="px-4 py-3 text-center text-blue-700">{product.emb1}</td>
                        <td className="px-4 py-3 text-center text-blue-700">{product.emb9}</td>
                        <td className="px-4 py-3 text-center">{product.age}</td>
                        <td className="px-4 py-3 text-center">{product.missSale}</td>
                        <td className="px-4 py-3">{product.sector}</td>
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
    )
}