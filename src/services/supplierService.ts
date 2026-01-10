import * as fs from "node:fs";


type SupplierMap = Record<string, string>;

export async function getSuppliersMap(): Promise<SupplierMap> {
    const filepath = 'src/data/suppliers.csv';

    const fileContents = fs.readFileSync(filepath, 'utf8');

    const map: SupplierMap ={};

    const lines = fileContents.split('\n');

    for (let i = 1; i< lines.length; i++){
        const line = lines[i].trim();
        if(!line) continue; // Skip empty lines

        const columns = line.split(';');

        const id = columns[0];
        const name = columns[1];
        const shortName = columns[2] ? columns[2].trim() : '';

        map[id] = shortName || name;

    }

    return map;
}