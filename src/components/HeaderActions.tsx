'use client';

import { useTheme } from 'next-themes';
import { Product } from '@/types';
import {
    PrinterIcon,
    ArrowDownTrayIcon,
    MoonIcon,
    SunIcon
} from '@heroicons/react/24/outline';
import { useEffect, useState } from 'react';

interface HeaderActionsProps {
    data: Product[]; // Recebe os dados atuais (já filtrados) para exportar
}

export default function HeaderActions({ data }: HeaderActionsProps) {
    const { theme, setTheme } = useTheme();
    const [mounted, setMounted] = useState(false);

    // Evita erro de hidratação no ícone do tema
    useEffect(() => setMounted(true), []);

    // --- LÓGICA DE EXPORTAÇÃO CSV ---
    const handleExport = () => {
        // 1. Cabeçalho do CSV
        const headers = ["Código", "Descrição", "Embalagem", "Fornecedor", "EMB1", "EMB9", "Idade", "Sem Venda", "Grupo"];

        // 2. Linhas do CSV
        const rows = data.map(item => [
            item.sku,
            `"${item.description}"`, // Aspas evitam quebra se tiver ponto e vírgula no texto
            item.packaging,
            `"${item.supplier}"`,
            item.emb1,
            item.emb9,
            item.age,
            item.missSale,
            item.sector
        ]);

        // 3. Montar o conteúdo (CSV usa ponto e vírgula no Brasil para abrir direto no Excel corretamente)
        const csvContent = [
            headers.join(";"),
            ...rows.map(row => row.join(";"))
        ].join("\n");

        // 4. Criar o blob e baixar
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.setAttribute("href", url);
        link.setAttribute("download", `estoque_export_${new Date().toLocaleDateString()}.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    // --- LÓGICA DE IMPRESSÃO ---
    const handlePrint = () => {
        window.print();
    };

    return (
        <div className="flex gap-2 print:hidden"> {/* print:hidden esconde os botões na impressão */}

            {/* Botão Exportar */}
            <button
                onClick={handleExport}
                title="Exportar CSV/Excel"
                className="p-2 text-gray-600 hover:text-blue-600 dark:text-gray-300 dark:hover:text-blue-400 border border-gray-300 dark:border-gray-600 rounded hover:bg-gray-50 dark:hover:bg-gray-800 transition"
            >
                <ArrowDownTrayIcon className="w-5 h-5" />
            </button>

            {/* Botão Imprimir */}
            <button
                onClick={handlePrint}
                title="Imprimir (A4 Landscape)"
                className="p-2 text-gray-600 hover:text-green-600 dark:text-gray-300 dark:hover:text-green-400 border border-gray-300 dark:border-gray-600 rounded hover:bg-gray-50 dark:hover:bg-gray-800 transition"
            >
                <PrinterIcon className="w-5 h-5" />
            </button>

            {/* Toggle Dark Mode */}
            {mounted && (
                <button
                    onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                    title="Alternar Tema"
                    className="p-2 text-gray-600 hover:text-purple-600 dark:text-gray-300 dark:hover:text-yellow-400 border border-gray-300 dark:border-gray-600 rounded hover:bg-gray-50 dark:hover:bg-gray-800 transition"
                >
                    {theme === 'dark' ? <SunIcon className="w-5 h-5" /> : <MoonIcon className="w-5 h-5" />}
                </button>
            )}
        </div>
    );
}