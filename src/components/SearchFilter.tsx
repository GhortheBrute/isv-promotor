'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

interface SearchProps {
    suppliersList: string[]; // Lista única de fornecedores para o autocomplete
}

export default function SearchFilters({ suppliersList }: SearchProps) {
    const router = useRouter();
    const searchParams = useSearchParams();

    // Estados dos campos
    const [supplierInput, setSupplierInput] = useState('');
    const [genericSearch, setGenericSearch] = useState('');
    const [showMoreFilters, setShowMoreFilters] = useState(false);

    // Estado das sugestões
    const [filteredSuppliers, setFilteredSuppliers] = useState<string[]>([]);
    const [showSuggestions, setShowSuggestions] = useState(false);

    // Carregar filtros da URL ao abrir a página (caso dê F5)
    useEffect(() => {
        setSupplierInput(searchParams.get('supplier') || '');
        setGenericSearch(searchParams.get('query') || '');
        if (searchParams.get('query')) setShowMoreFilters(true);
    }, [searchParams]);

    // Lógica do Autocomplete do Fornecedor
    const handleSupplierChange = (val: string) => {
        setSupplierInput(val);
        if (val.length > 0) {
            const matches = suppliersList.filter(s =>
                s.toLowerCase().includes(val.toLowerCase())
            );
            setFilteredSuppliers(matches.slice(0, 5)); // Limita a 5 sugestões
            setShowSuggestions(true);
        } else {
            setShowSuggestions(false);
        }
    };

    const selectSuggestion = (name: string) => {
        setSupplierInput(name);
        setShowSuggestions(false);
    };

    // Ação de Buscar (Atualiza a URL)
    const handleSearch = () => {
        const params = new URLSearchParams();
        if (supplierInput) params.set('supplier', supplierInput);
        if (genericSearch) params.set('query', genericSearch); // query = description ou sector

        router.push(`/?${params.toString()}`);
    };

    // Ação de Limpar
    const handleClear = () => {
        setSupplierInput('');
        setGenericSearch('');
        setShowMoreFilters(false);
        router.push('/'); // Remove tudo da URL
    };

    return (
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 mb-6 uppercase">
            <div className="flex flex-col md:flex-row gap-4 items-end">

                {/* Input Fornecedor com Autocomplete */}
                <div className="relative w-full md:w-1/3">
                    <label className="block text-xs font-bold text-gray-700 mb-1">Fornecedor</label>
                    <input
                        type="text"
                        className="w-full border p-2 rounded text-sm focus:ring-2 focus:ring-blue-500 outline-none uppercase"
                        placeholder="Digite o fornecedor..."
                        value={supplierInput}
                        onChange={(e) => handleSupplierChange(e.target.value)}
                        onBlur={() => setTimeout(() => setShowSuggestions(false), 200)} // Delay para permitir o clique
                    />

                    {/* Lista de Sugestões Flutuante */}
                    {showSuggestions && filteredSuppliers.length > 0 && (
                        <ul className="absolute z-10 w-full bg-white border border-gray-300 mt-1 rounded shadow-lg max-h-60 overflow-auto">
                            {filteredSuppliers.map((sup, idx) => (
                                <li
                                    key={idx}
                                    className="p-2 text-sm hover:bg-gray-100 cursor-pointer"
                                    onClick={() => selectSuggestion(sup)}
                                >
                                    {sup}
                                </li>
                            ))}
                        </ul>
                    )}
                </div>

                {/* Botões de Ação */}
                <div className="flex gap-2">
                    <button
                        onClick={handleSearch}
                        className="bg-blue-600 text-white px-4 py-2 rounded text-sm font-bold hover:bg-blue-700 transition"
                    >
                        BUSCAR
                    </button>

                    <button
                        onClick={() => setShowMoreFilters(!showMoreFilters)}
                        className="bg-gray-200 text-gray-700 px-4 py-2 rounded text-sm font-bold hover:bg-gray-300 transition"
                    >
                        {showMoreFilters ? 'MENOS FILTROS' : 'MAIS FILTROS'}
                    </button>

                    <button
                        onClick={handleClear}
                        className="text-red-600 px-4 py-2 rounded text-sm font-bold hover:bg-red-50 transition border border-transparent hover:border-red-100"
                    >
                        LIMPAR FILTROS
                    </button>
                </div>
            </div>

            {/* Área Expandida (Mais Filtros) */}
            {showMoreFilters && (
                <div className="mt-4 pt-4 border-t border-gray-100 animate-fade-in-down">
                    <div className="w-full md:w-1/3">
                        <label className="block text-xs font-bold text-gray-700 mb-1">Descrição ou Grupo</label>
                        <input
                            type="text"
                            className="w-full border p-2 rounded text-sm focus:ring-2 focus:ring-blue-500 outline-none uppercase"
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