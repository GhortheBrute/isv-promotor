'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

interface SearchProps {
    suppliersList: string[];
}

export default function SearchFilters({ suppliersList }: SearchProps) {
    const router = useRouter();
    const searchParams = useSearchParams();

    const [supplierInput, setSupplierInput] = useState('');
    const [genericSearch, setGenericSearch] = useState('');
    const [showMoreFilters, setShowMoreFilters] = useState(false);
    const [filteredSuppliers, setFilteredSuppliers] = useState<string[]>([]);
    const [showSuggestions, setShowSuggestions] = useState(false);

    useEffect(() => {
        setSupplierInput(searchParams.get('supplier') || '');
        setGenericSearch(searchParams.get('query') || '');
        if (searchParams.get('query')) setShowMoreFilters(true);
    }, [searchParams]);

    const handleSupplierChange = (val: string) => {
        setSupplierInput(val);
        if (val.length > 0) {
            const matches = suppliersList.filter(s =>
                s.toLowerCase().includes(val.toLowerCase())
            );
            setFilteredSuppliers(matches.slice(0, 5));
            setShowSuggestions(true);
        } else {
            setShowSuggestions(false);
        }
    };

    const selectSuggestion = (name: string) => {
        setSupplierInput(name);
        setShowSuggestions(false);
        handleSearch(name);
    };

    const handleSearch = (supplierOverride?: string) => {
        const params = new URLSearchParams();
        // Verifica se supplierOverride é string válida, senão usa o input
        const currentSupplier = typeof supplierOverride === 'string' ? supplierOverride : supplierInput;

        if (currentSupplier) params.set('supplier', currentSupplier);
        if (genericSearch) params.set('query', genericSearch);

        router.push(`/?${params.toString()}`);
    };

    const handleClear = () => {
        setSupplierInput('');
        setGenericSearch('');
        setShowMoreFilters(false);
        router.push('/');
    };

    return (
        // print:hidden -> Esconde na impressão
        // dark:bg-gray-800 dark:border-gray-700 -> Estilos do container no modo dark
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 mb-6 uppercase print:hidden dark:bg-gray-800 dark:border-gray-700 transition-colors">
            <div className="flex flex-col md:flex-row gap-4 items-end">

                {/* Input Fornecedor */}
                <div className="relative w-full md:w-1/3">
                    <label className="block text-xs font-bold text-gray-700 mb-1 dark:text-gray-300">
                        Fornecedor
                    </label>
                    <input
                        type="text"
                        // dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:placeholder-gray-400
                        className="w-full border p-2 rounded text-sm focus:ring-2 focus:ring-blue-500 outline-none uppercase bg-white dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:placeholder-gray-400"
                        placeholder="Digite o fornecedor..."
                        value={supplierInput}
                        onChange={(e) => handleSupplierChange(e.target.value)}
                        onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
                        onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                    />

                    {/* Lista de Sugestões */}
                    {showSuggestions && filteredSuppliers.length > 0 && (
                        <ul className="absolute z-10 w-full bg-white border border-gray-300 mt-1 rounded shadow-lg max-h-60 overflow-auto dark:bg-gray-700 dark:border-gray-600">
                            {filteredSuppliers.map((sup, idx) => (
                                <li
                                    key={idx}
                                    // dark:text-gray-200 dark:hover:bg-gray-600
                                    className="p-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer dark:text-gray-200 dark:hover:bg-gray-600"
                                    onClick={() => selectSuggestion(sup)}
                                >
                                    {sup}
                                </li>
                            ))}
                        </ul>
                    )}
                </div>

                {/* Botões */}
                <div className="flex gap-2">
                    <button
                        // IMPORTANTE: Use arrow function para não passar o evento de clique como argumento
                        onClick={() => handleSearch()}
                        className="bg-blue-600 text-white px-4 py-2 rounded text-sm font-bold hover:bg-blue-700 transition"
                    >
                        BUSCAR
                    </button>

                    <button
                        onClick={() => setShowMoreFilters(!showMoreFilters)}
                        className="bg-gray-200 text-gray-700 px-4 py-2 rounded text-sm font-bold hover:bg-gray-300 transition dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600"
                    >
                        {showMoreFilters ? 'MENOS FILTROS' : 'MAIS FILTROS'}
                    </button>

                    <button
                        onClick={handleClear}
                        className="text-red-600 px-4 py-2 rounded text-sm font-bold hover:bg-red-50 transition border border-transparent hover:border-red-100 dark:hover:bg-red-900/30 dark:hover:border-red-900"
                    >
                        LIMPAR FILTROS
                    </button>
                </div>
            </div>

            {/* Área Expandida */}
            {showMoreFilters && (
                <div className="mt-4 pt-4 border-t border-gray-100 dark:border-gray-700 animate-fade-in-down">
                    <div className="w-full md:w-1/3">
                        <label className="block text-xs font-bold text-gray-700 mb-1 dark:text-gray-300">
                            Descrição ou Grupo
                        </label>
                        <input
                            type="text"
                            // Mesmas classes do input de cima
                            className="w-full border p-2 rounded text-sm focus:ring-2 focus:ring-blue-500 outline-none uppercase bg-white dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:placeholder-gray-400"
                            placeholder="Ex: ARROZ ou MERCEARIA"
                            value={genericSearch}
                            onChange={(e) => setGenericSearch(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                        />
                    </div>
                </div>
            )}
        </div>
    );
}