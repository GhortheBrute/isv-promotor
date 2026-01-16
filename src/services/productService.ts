import { Product } from "@/types";
import {getSuppliersMap} from "@/services/supplierService";

const URL_API_PHP = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/produtos.php';


type ProductFilter = {
    supplier?: string;
    query?: string;
}

export async function getProducts(filters?: ProductFilter): Promise<Product[]> {
    let rawData: any[] = [];

    try{
        // 'no-store': Garante que sempre busca dados novos no banco
        const res = await fetch(URL_API_PHP, {cache: 'no-store'});
        console.log(res)

        if (!res.ok) {
            throw new Error(`Erro HTTP: ${res.status}`);
        }

        rawData = await res.json();

        // Se o PHP retornar erro em JSON (conexão falhou)
        if ((rawData as any).erro) {
            console.error("Erro PHP:", (rawData as any).erro);
            return [];
        }
    } catch (error) {
        console.error("Falha ao conectar na API PHP. Verifique se o XAMPP está rodando corretamente.");
    }

    const supplierMap = await getSuppliersMap();

    let products: Product[] = rawData.map((item: any) => {
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