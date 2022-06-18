export class Field {
    public id: number;
    public name: string;

    constructor(data: any = null) {
        //Técnica de deep copy para eliminar referencias de memoria
        data = data ? JSON.parse(JSON.stringify(data)) : {};

        this.id = data.id != null ? Number(data.id) : null;
        this.name = data.name != null ? String(data.name) : null;
    }
}