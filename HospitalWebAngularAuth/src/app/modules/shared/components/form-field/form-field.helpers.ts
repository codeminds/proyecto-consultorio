export function getProperty(obj: any, structure?: string): unknown {
    if(structure?.trim()) {
        for(const prop of structure.split('.')) {
            obj = obj[prop];
        }
    }

    return obj;
}