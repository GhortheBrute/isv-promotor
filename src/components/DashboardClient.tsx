'use client';

import { useState, useMemo, useEffect } from 'react';
import { Product } from '@/types';
import ProductsTable from './ProductsTable';
import SearchFilters from './SearchFilters';
import HeaderActions from './HeaderActions';
import { useSearchParams } from 'next/navigation';

interface DashboardProps {
    initialProducts: Product[]; // Recebe a lista COMPLETA vinda do servidor
}

export default function DashboardClient({ initialProducts }: DashboardProps) {
    // 1. Estado que guarda a lista filtrada que aparece na tabela
    const [filteredProducts, setFilteredProducts] = useState<Product[]>(initialProducts);

    // 2. Extraímos a lista de fornecedores (Memoizado para performance)
    const uniqueSuppliers = useMemo(() => {
        const suppliers = initialProducts.map(p => p.supplier);
        return Array.from(new Set(suppliers)).sort();
    }, [initialProducts]);

    // 3. Recuperar filtros da URL se der F5 (Opcional, mas boa UX)
    const searchParams = useSearchParams();
    useEffect(() => {
        const urlSupplier = searchParams.get('supplier') || '';
        const urlQuery = searchParams.get('query') || '';
        // Aplica o filtro inicial se tiver algo na URL
        if (urlSupplier || urlQuery) {
            handleFilterChange(urlSupplier, urlQuery);
        }
    }, []);

    // 4. A Lógica de Filtro Instantâneo (Roda no navegador)
    const handleFilterChange = (supplier: string, query: string) => {
        let result = initialProducts;

        // Filtra Fornecedor
        if (supplier) {
            result = result.filter(p =>
                p.supplier.toLowerCase().includes(supplier.toLowerCase())
            );
        }

        // Filtra Texto Livre (Descrição ou Grupo)
        if (query) {
            const q = query.toLowerCase();
            result = result.filter(p =>
                p.description.toLowerCase().includes(q) ||
                p.sector.toLowerCase().includes(q)
            );
        }

        setFilteredProducts(result);
    };

    const getLastUpdateDate = () => {
        // Pega o dateStamp do primeiro item
        const rawDate = initialProducts[0]?.dataStamp;

        if (!rawDate) return "Data indisponível."

        try{
            // Converte a string SQL para Objeto Date
            const dateObj = new Date(rawDate.replace(' ','T'));

            // Formata a data para "01 de janeiro de 2026"
            return new Intl.DateTimeFormat('pt-BR', {
                day: '2-digit',
                month: 'long',
                year: 'numeric',
            }).format(dateObj);
        } catch (e) {
            return rawDate;
        }
    }

    return (
        <div className="animate-in fade-in duration-500">
            <div className="flex flex-col md:flex-row justify-between items-center mb-6">
                <h1 className="text-2xl font-bold text-gray-800 dark:text-white uppercase">
                    ISV Promotor
                </h1>
                {/* HeaderActions recebe os dados filtrados para exportar só o que vê */}
                <HeaderActions data={filteredProducts} />
            </div>

            <div className="no-print">
                {/* Passamos a função de filtro para o componente filho */}
                <SearchFilters
                    suppliersList={uniqueSuppliers}
                    onFilterChange={handleFilterChange}
                />
            </div>

            <div className="mb-2 text-sm text-gray-600 dark:text-gray-400 uppercase flex justify-between items-center print:hidden">
                <span>Resultados encontrados: <span className="font-bold text-black dark:text-white">{filteredProducts.length}</span></span>
                <span className="text-xs text-gray-400">Atualizado em: {getLastUpdateDate()}</span>
            </div>

            <ProductsTable products={filteredProducts}/>
        </div>
    );
}