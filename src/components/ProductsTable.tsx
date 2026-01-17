import {Product} from "@/types";
import { SortConfig } from "./DashboardClient";

interface PropsTable {
    products: Product[];
    isLoading: boolean;
    onSort: (key: keyof Product) => void;
    sortConfig: SortConfig;
}

interface SortableHeaderProps {
    label: string;
    columnKey: keyof Product;
    sortConfig: SortConfig;
    onSort: (key: keyof Product) => void;
    center?: boolean;
}

const SortableHeader = ({ label, columnKey, sortConfig, onSort, center = false }: SortableHeaderProps) => {
    const isActive = sortConfig.key === columnKey;
    const direction = sortConfig.direction;

    return (
    <th 
        scope="col" 
        className={`px-3 py-3 print:px-1 print:py-1 print:text-[10px] cursor-pointer hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors select-none ${center ? 'text-center' : 'text-left'}`}
        onClick={() => onSort(columnKey)}
        title="Clique para ordenar"
    >
        <div className={`flex items-center gap-1 ${center ? 'justify-center' : 'justify-start'}`}>
        {label}
        <span className="text-gray-500 text-[10px] w-3 flex justify-center">
            {isActive ? (
                direction === 'asc' ? '▲' : '▼'
            ) : (
                // Ícone fantasma para manter alinhamento
                <span className="opacity-0">▼</span> 
            )}
        </span>
        </div>
    </th>
    );
};

export default function ProductsTable({products, isLoading, onSort, sortConfig}: PropsTable){
    return (
        <div className="overflow-x-auto shadow-md sm:rounded-lg">
            <table className="w-full text-sm text-left uppercase text-gray-500 dark:text-gray-400">
                <thead className="text-xs text-gray-700 uppercase bg-gray-100 dark:bg-gray-700 dark:text-gray-200">
                <tr>
                    <SortableHeader label="Código" columnKey="sku" center sortConfig={sortConfig} onSort={onSort}/>
                    <SortableHeader label="Descrição" columnKey="description" sortConfig={sortConfig} onSort={onSort}/>
                    <SortableHeader label="Embalagem" columnKey="packaging" center sortConfig={sortConfig} onSort={onSort}/>
                    <SortableHeader label="Fornecedor" columnKey="supplier" sortConfig={sortConfig} onSort={onSort}/>
                    
                    <SortableHeader label="Emb 1" columnKey="emb1" center sortConfig={sortConfig} onSort={onSort}/>
                    <SortableHeader label="Emb 9" columnKey="emb9" center sortConfig={sortConfig} onSort={onSort}/>
                    <SortableHeader label="Idade" columnKey="age" center sortConfig={sortConfig} onSort={onSort}/>
                    <SortableHeader label="Sem Venda" columnKey="missSale" center sortConfig={sortConfig} onSort={onSort}/>
                    <SortableHeader label="Setor" columnKey="sector" center sortConfig={sortConfig} onSort={onSort}/>
                </tr>
                </thead>
                <tbody className="print:text-[10px] print:leading-none">
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
                            <tr key={product.sku} className="bg-white border-b hover:bg-gray-50 dark:bg-gray-800 dark:border-gray-700 dark:hover:bg-gray-600 transition-colors print:border-gray-300 print:text-black">
                                <td className="px-3 py-2 print:px-1 print:py-0.5 font-medium text-gray-900 whitespace-nowrap dark:text-white print:text-black">{product.sku}</td>
                                <td className="px-3 py-2 print:px-1 print:py-0.5 print:text-black">{product.description}</td>
                                <td className="px-3 py-2 print:px-1 print:py-0.5 print:text-black">{product.packaging}</td>
                                <td className="px-3 py-2 print:max-w-none print:px-1 print:py-0.5 print:text-black" title={product.supplier}>{product.supplier}</td>
                                <td className="px-3 py-2 text-center font-bold text-blue-600 dark:text-blue-400 print:text-black print:px-1 print:py-0.5">{product.emb1.toLocaleString('pt-BR', {maximumFractionDigits: 0})}</td>
                                <td className="px-3 py-2 text-center font-bold text-green-600 dark:text-green-400 print:text-black print:px-1 print:py-0.5">{product.emb9.toLocaleString('pt-BR', {maximumFractionDigits: 0})}</td>
                                <td className="px-3 py-2 text-center print:text-black print:px-1 print:py-0.5">{Math.floor(product.age)}</td>
                                <td className="px-3 py-2 text-center text-red-600 font-medium print:text-black print:px-1 print:py-0.5">{Math.floor(product.missSale)}</td>
                                <td className="px-3 py-2 text-xs print:text-[9px] print:px-1 print:py-0.5 print:text-black">{product.sector}</td>
                            </tr>
                        ))
                    )}
                </tbody>
            </table>
        </div>
    );
}