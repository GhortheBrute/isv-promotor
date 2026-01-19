'use client';

import { useState, useMemo, useEffect, useCallback, useRef } from 'react';
import { Product } from '@/types';
import ProductsTable from './ProductsTable';
import SearchFilters from './SearchFilters';
import HeaderActions from './HeaderActions';
import { useSearchParams } from 'next/navigation';

interface ApiProductRaw {
    sku: string;
    description: string;
    packaging: string;
    supplier: string;
    emb1: string;
    emb9: string;
    age: string;
    missSale: string;
    sector: string;
    dataStamp: string;
}

export type SortDirection = 'asc' | 'desc';
export type SortConfig = {
    key: keyof Product;
    direction: SortDirection;
}


export default function DashboardClient() {
    const [products, setProducts] = useState<Product[]>([]);
    const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [sortConfig, setSortConfig] = useState<SortConfig>({
        key: 'description',
        direction: 'asc'
    });

    const searchParams = useSearchParams();
    const initialFiltersApplied = useRef(false);
    const [itemsPerPage, setItemsPerPage] = useState(100);

    // Função para mudar a ordenação
    const handleSort = (key: keyof Product) => {
        setSortConfig((current) => {
            // Se clicar na mesma coluna, inverte a direção
            if (current.key === key) {
                return {key, direction: current.direction === 'asc' ? 'desc' : 'asc'}
            }
            // Se clicar em uma coluna nova, começa ascendente
            return {key, direction: 'asc' };
        });
    };

    // Aplica a ordenação na lista filtrada
    const sortedProducts = useMemo(() => {
        // Cria uma cópia para não mutar o estado original
        const sorted = [...filteredProducts];

        sorted.sort((a, b) => {
            const aValue = a[sortConfig.key];
            const bValue = b[sortConfig.key];

            // Lógica para números (subtração)
            if (typeof aValue === 'number' && typeof bValue === 'number') {
                return sortConfig.direction === 'asc' ? aValue - bValue : bValue - aValue;
            }

            // Lógica para strings (localeCompare para acentuação)
            const aString = String(aValue).toLowerCase();
            const bString = String(bValue).toLowerCase();

            return sortConfig.direction === 'asc' ? aString.localeCompare(bString) : bString.localeCompare(aString);
        });
        return sorted;
    }, [filteredProducts, sortConfig]);

    // Paginação dos dados
    const paginatedProducts = useMemo(() => {
        const startIndex = (currentPage - 1) * itemsPerPage;
        return sortedProducts.slice(startIndex, startIndex + itemsPerPage);
    }, [sortedProducts, currentPage]);

    const totalPages = Math.ceil(sortedProducts.length / itemsPerPage);

    //Lista de fornecedores únicos (memoizado)
    const uniqueSuppliers = useMemo(() => {
        const suppliers = products.map(p => p.supplier);
        return Array.from(new Set(suppliers)).sort();
    }, [products]);

    // Lógica do Filtro Local
    const handleFilterChange = useCallback((supplier: string, query: string) => {
        let result = products;

        if (supplier) {
            result = result.filter(p => p.supplier.toLowerCase().includes(supplier.toLowerCase()));
        }

        if (query) {
            result = result.filter(p =>
                    p.description.toLowerCase().includes(query.toLowerCase()) ||
                    p.sector.toLowerCase().includes(query.toLowerCase())
            );
        }

        setFilteredProducts(result);
        setCurrentPage(1); // Reseta a página ao filtrar
    }, [products]);

    const handleItemsPerPageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setItemsPerPage(Number(e.target.value));
        setCurrentPage(1); // Volta para a primeira página para não quebrar o visual
    };
    
    const getLastUpdateDate = () => {
        const rawDate = products[0]?.dataStamp;
        if (!rawDate) return "Indisponível";
        try{
            const dateObj = new Date(rawDate.replace(' ', 'T'));
            return new Intl.DateTimeFormat('pt-BR', {
                day: '2-digit',
                month: 'long',
                year: 'numeric'
            }).format(dateObj);
        } catch { return rawDate }
    };

    // Buscar os dados no PHP assim que a página carrega
    useEffect(() => {
        const fetchData = async () => {
            try{
                const apiUrl = process.env.NEXT_PUBLIC_API_URL || '';

                // Dispara as duas requisições em paralelo
                const [resProducts, resSuppliers] = await Promise.all([
                    fetch(apiUrl),
                    fetch('/files/suppliers.csv')
                ]);

                if (!apiUrl) throw new Error("URL da API não configurada.");

                if (!resProducts.ok) throw new Error("Falha ao carregar os dados.");

                // Processa o mapa de fornecedores
                const csvText = await resSuppliers.text();
                const supplierMap: Record<string, string> = {};

                csvText.split('\n').forEach(line => {
                    const [code, name] = line.split(';');
                    if (code && name) {
                        const cleanCode = code.trim().substring(0,8);
                        supplierMap[cleanCode] = name.trim();
                    }
                });

                // Processa o mapa de produto
                const data: ApiProductRaw[] = await resProducts.json();

                // Mapeamento para garantir a tipagem
                const mappedProducts: Product[] = data.map((item) => {
                    // Pega o código bruto do banco e garante que é string
                    const rawSupplierCode = String(item.supplier).trim();

                    // Extrai os 8 primeiros dígitos (CNPJ raiz)
                    const supplierRoot = rawSupplierCode.substring(0, 8);

                    // Busca no Mapa usando a raiz
                    // Senão achar,usa o original como fallback
                    const finalSupplierName = supplierMap[supplierRoot] || rawSupplierCode;

                    return {
                        sku: item.sku,
                        description: item.description,
                        packaging: item.packaging,
                        supplier: finalSupplierName,
                        emb1: Number(item.emb1) || 0,
                        emb9: Number(item.emb9) || 0,
                        age: Number(item.age) || 0,
                        missSale: Number(item.missSale) || 0,
                        sector: item.sector,
                        dataStamp: item.dataStamp, 
                    };
                });

                setProducts(mappedProducts);
                setFilteredProducts(mappedProducts);
            } catch (err) {
                console.error(err);
                setError("Não foi possível carregar os dados do estoque.")
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    // Reaplica filtros da URL quando os produtos carregarem
    useEffect(() => {
        if(!loading && products.length > 0 && !initialFiltersApplied.current) {
            const urlSupplier = searchParams.get('supplier') || '';
            const urlQuery = searchParams.get('query') || '';
            if (urlSupplier || urlQuery) {
                handleFilterChange(urlSupplier, urlQuery);
            }
        }
    }, [loading, searchParams, products]);


    if (error) {
        return <div className="text-red-600 text-center, p-8">{error}</div>
    }

    return (
    <div>
      <div className="flex flex-col md:flex-row justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800 dark:text-white uppercase">
            ISV Promotor
        </h1>
        {/* Desabilita ações enquanto carrega para evitar cliques falsos */}
        <div className={loading ? 'opacity-50 pointer-events-none' : ''}>
            <HeaderActions data={filteredProducts} />
        </div>
      </div>

      <div className="no-print">
        <div className={loading ? 'opacity-70 pointer-events-none grayscale' : ''}>
          <SearchFilters 
            suppliersList={uniqueSuppliers} 
            onFilterChange={handleFilterChange} 
        />  
        </div>
      </div>

        <div className="mb-2 text-sm text-gray-600 dark:text-gray-400 uppercase flex flex-col md:flex-row justify-between items-end gap-2 no-print">
            <div className="flex gap-4 items-center">
                <span>Encontrados: <span className="font-bold text-black dark:text-white">{sortedProducts.length}</span></span>

                {/* SELETOR DE LINHAS POR PÁGINA */}
                <div className="flex items-center gap-2">
                    <label htmlFor="rows" className="text-xs font-bold">Exibir:</label>
                    <select
                        id="rows"
                        value={itemsPerPage}
                        onChange={handleItemsPerPageChange}
                        className="border rounded p-1 text-xs bg-white dark:bg-gray-700 text-black dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
                    >
                        <option value={25}>25</option>
                        <option value={50}>50</option>
                        <option value={100}>100</option>
                        <option value={200}>200</option>
                    </select>
                </div>

                <span>Atualizado em: <span>{loading ? 'Verificando...' : getLastUpdateDate()}</span></span>
            </div>

            <div className="flex items-center gap-2">
                <span>Página <span className="font-bold text-black dark:text-white">{currentPage}</span> de {totalPages || 1}</span>

                {/* Botões de Paginação */}
                {totalPages > 1 && (
                    <div className="flex gap-1">
                        <button
                            onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                            disabled={currentPage === 1}
                            className="px-3 py-1 bg-gray-200 rounded text-xs font-bold disabled:opacity-50 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600"
                        >
                            ANTERIOR
                        </button>
                        <button
                            onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                            disabled={currentPage === totalPages}
                            className="px-3 py-1 bg-gray-200 rounded text-xs font-bold disabled:opacity-50 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600"
                        >
                            PRÓXIMA
                        </button>
                    </div>
                )}
            </div>
        </div>

      <ProductsTable
            products={paginatedProducts}
            isLoading={loading}
            onSort={handleSort}
            sortConfig={sortConfig}
        />
    </div>
  );
}