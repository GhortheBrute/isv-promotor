import type { Metadata } from "next";
import { Inter } from "next/font/google"; // <--- 1. Importação necessária
import "./globals.css";
import { Providers } from "@/components/Providers";

// 2. Configuração da fonte
const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
    title: "Dashboard de Estoque",
    description: "Gerenciamento de estoque varejo/atacado",
};

export default function RootLayout({
                                       children,
                                   }: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="pt-br" suppressHydrationWarning>
        {/* 3. Aplicação da classe da fonte no body */}
        <body className={inter.className}>
            <Providers>{children}</Providers>
        </body>
        </html>
    );
}