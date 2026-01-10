import {getProducts} from "@/services/productService";
import ProductsTable from "@/components/ProductsTable";

export default async function Home() {
    const products = await getProducts();

    return (
    <main className="p-8">
        <h1 className="text-2xl font-bold mb-4">Dashboard de Estoque</h1>

        <p className="mb-4">Total de registros: {products.length}</p>

        <ProductsTable products={products}/>
    </main>
    );
}
