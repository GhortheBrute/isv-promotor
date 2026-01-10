// src/types/index.ts

export interface Product {
    sku: number;
    description: string;
    packaging: string;
    supplier: string;
    emb1: number;
    emb9: number;
    age: number;
    missSale: number;
    sector: string;
    dataStamp: string;
}

export interface Supplier {
    supplier: string;
    supplier_name: string;
    supplier_short_name: string;
}