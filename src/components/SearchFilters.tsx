'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';

interface SearchProps {
    suppliersList: string[];
    onFilterChange?: (supplier: string, query: string) => void;
}

export default function SearchFilters({ suppliersList, onFilterChange }: SearchProps) {
    const searchParams = useSearchParams();

    const [supplierInput, setSupplierInput] = useState('');
    const [genericSearch, setGenericSearch] = useState('');
    const [showMoreFilters, setShowMoreFilters] = useState(false);
    const [filteredSuppliers, setFilteredSuppliers] = useState<string[]>([]);
    const [showSuggestions, setShowSuggestions] = useState(false);

    // 1. Carrega filtros iniciais da URL (Apenas na montagem)
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

    // --- CORREÇÃO 1: Atualização Silenciosa (Sem Piscar) ---
    const handleSearch = (supplierOverride?: string) => {
        const currentSupplier = typeof supplierOverride === 'string' ? supplierOverride : supplierInput;
        
        // 1. Atualiza a lista na tela imediatamente
        if (onFilterChange) {
            onFilterChange(currentSupplier, genericSearch);
        }

        // 2. Atualiza a URL sem recarregar a página (replaceState)
        const params = new URLSearchParams();
        if (currentSupplier) params.set('supplier', currentSupplier);
        if (genericSearch) params.set('query', genericSearch);

        // Se tiver params, adiciona ?, senão limpa tudo
        const queryString = params.toString();
        const newUrl = queryString ? `?${queryString}` : window.location.pathname;
        
        window.history.replaceState(null, '', newUrl);
    };

    // --- CORREÇÃO 2: Limpeza Completa ---
    const handleClear = () => {
        setSupplierInput('');
        setGenericSearch('');
        setShowMoreFilters(false);
        
        // 1. Reseta a lista
        if (onFilterChange) {
            onFilterChange('', '');
        }

        // 2. Limpa a URL visualmente
        window.history.replaceState(null, '', window.location.pathname);
    };

    return (
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 mb-6 uppercase print:hidden dark:bg-gray-800 dark:border-gray-700 transition-colors">
             <div className="flex flex-col md:flex-row gap-4 items-end">
                <div className="relative w-full md:w-1/3">
                    <label className="block text-xs font-bold text-gray-700 mb-1 dark:text-gray-300">Fornecedor</label>
                    <input 
                        type="text" 
                        className="w-full border p-2 rounded text-sm focus:ring-2 focus:ring-blue-500 outline-none uppercase bg-white dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:placeholder-gray-400"
                        placeholder="DIGITE O FORNECEDOR..."
                        value={supplierInput}
                        onChange={(e) => handleSupplierChange(e.target.value)}
                        onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
                        onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                                e.preventDefault(); // <--- IMPEDE O RELOAD DA PÁGINA
                                handleSearch();
                            }
                        }}
                    />
                    
                    {showSuggestions && filteredSuppliers.length > 0 && (
                        <ul className="absolute z-10 w-full bg-white border border-gray-300 mt-1 rounded shadow-lg max-h-60 overflow-auto dark:bg-gray-700 dark:border-gray-600">
                            {filteredSuppliers.map((sup, idx) => (
                                <li key={idx} className="p-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer dark:text-gray-200 dark:hover:bg-gray-600" onClick={() => selectSuggestion(sup)}>{sup}</li>
                            ))}
                        </ul>
                    )}
                </div>
                <div className="flex gap-2">
                     <button onClick={() => handleSearch()} className="bg-blue-600 text-white px-4 py-2 rounded text-sm font-bold hover:bg-blue-700 transition">BUSCAR</button>
                     <button onClick={() => setShowMoreFilters(!showMoreFilters)} className="bg-gray-200 text-gray-700 px-4 py-2 rounded text-sm font-bold hover:bg-gray-300 transition dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600">{showMoreFilters ? 'MENOS FILTROS' : 'MAIS FILTROS'}</button>
                     <button onClick={handleClear} className="text-red-600 px-4 py-2 rounded text-sm font-bold hover:bg-red-50 transition border border-transparent hover:border-red-100 dark:hover:bg-red-900/30 dark:hover:border-red-900">LIMPAR FILTROS</button>
                </div>
             </div>
             
             {showMoreFilters && (
                <div className="mt-4 pt-4 border-t border-gray-100 dark:border-gray-700 animate-fade-in-down">
                    <div className="w-full md:w-1/3">
                        <label className="block text-xs font-bold text-gray-700 mb-1 dark:text-gray-300">Descrição ou Grupo</label>
                        <input 
                            type="text" 
                            className="w-full border p-2 rounded text-sm focus:ring-2 focus:ring-blue-500 outline-none uppercase bg-white dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:placeholder-gray-400" 
                            placeholder="Ex: ARROZ ou MERCEARIA" 
                            value={genericSearch} 
                            onChange={(e) => setGenericSearch(e.target.value)} 
                            onKeyDown={(e) => {
                                if (e.key === 'Enter') {
                                    e.preventDefault(); // <--- IMPEDE O RELOAD AQUI TAMBÉM
                                    handleSearch();
                                }
                            }} 
                        />
                    </div>
                </div>
             )}
        </div>
    );
}