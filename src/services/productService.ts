import dadosMock from '@/data/products.json';

import { Product } from "@/types";
import {getSuppliersMap} from "@/services/supplierService";

const URL_API_PHP = 'http://localhost/api/produtos.php';

type ProductFilter = {
    supplier?: string;
    query?: string;
}

export async function getProducts(filters?: ProductFilter): Promise<Product[]> {
    // --- CENÁRIO FUTURO (Integração com PHP) ---
    /*
    try {
      // O 'no-store' garante que o Next.js não faça cache e sempre pegue dados frescos do PHP
      const response = await fetch(URL_API_PHP, { cache: 'no-store' });

      if (!response.ok) {
        throw new Error('Falha ao buscar dados do PHP');
      }

      const dados: Produto[] = await response.json();
      return dados;
    } catch (error) {
      console.error("Erro na API PHP:", error);
      return []; // Retorna lista vazia em caso de erro para não quebrar a tela
    }
    */

    const supplierMap = await getSuppliersMap();

    let products: Product[] = dadosMock.map((item: any) => {
        const supplierCode = String(item.fornecedor || item.supplier);

        const finalSupplierName = supplierMap[supplierCode] || supplierCode;
        return {
            sku: item.sku,
            description: item.description,
            packaging: item.packaging,
            supplier: finalSupplierName,
            emb1: item.emb1,
            emb9: item.emb9,
            age: item.age,
            missSale: item.missSale,
            sector: item.sector,
            dataStamp: item.dataStamp
        };
    });

    if (filters?.supplier) {
        const termSupplier = filters.supplier.toLowerCase();
        products = products.filter(p => p.supplier.toLowerCase().includes(termSupplier));
    }

    if (filters?.query) {
        const termQuery = filters.query.toLowerCase();
        products = products.filter(p =>
            p.description.toLowerCase().includes(termQuery) ||
            p.sector.toLowerCase().includes(termQuery));
    }

    return products;
}