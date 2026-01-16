'use client';

import { useState, useMemo, useEffect, useCallback } from 'react';
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


export default function DashboardClient() {
    const [products, setProducts] = useState<Product[]>([]);
    const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    const searchParams = useSearchParams();

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
        };

        setFilteredProducts(result);
    }, [products]);
    
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
                    fetch('files/suppliers.csv')
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
            if(!loading && products.length > 0) {
                const urlSupplier = searchParams.get('supplier') || '';
                const urlQuery = searchParams.get('query') || '';
                if (urlSupplier || urlQuery) {
                    handleFilterChange(urlSupplier, urlQuery);
                }
            }
        }, [loading, searchParams, products, handleFilterChange]);

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center h-64 text-gray-500 animate-pulse">
                <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mb4"></div>
                <p>Carregando estoque atualizado...</p>
            </div>
        );
    }

    if (error) {
        return <div className="text-red-600 text-center, p-8">{error}</div>
    }

    return (
    <div className="animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800 dark:text-white uppercase">
            Dashboard de Estoque
        </h1>
        <HeaderActions data={filteredProducts} />
      </div>

      <div className="no-print">
        <SearchFilters 
            suppliersList={uniqueSuppliers} 
            onFilterChange={handleFilterChange} 
        />
      </div>

      <div className="mb-2 text-sm text-gray-600 dark:text-gray-400 uppercase flex justify-between items-center">
          <span>Resultados encontrados: <span className="font-bold text-black dark:text-white">{filteredProducts.length}</span></span>
          <span className="text-xs text-gray-500 dark:text-gray-400 italic">
              Atualizado em: <span className="font-medium text-gray-700 dark:text-gray-300">{getLastUpdateDate()}</span>
          </span>
      </div>

      <ProductsTable products={filteredProducts}/>
    </div>
  );
}