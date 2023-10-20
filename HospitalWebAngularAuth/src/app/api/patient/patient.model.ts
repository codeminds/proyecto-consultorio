export class Patient {
    public id: number;
    public documentId: string;
    public firstName: string;
    public lastName: string;
    public tel: string;
    public email: string;

    constructor(data: any = null) {
        //Técnica de deep copy para eliminar referencias de memoria
        data = data ? JSON.parse(JSON.stringify(data)) : {};

        this.id = data.id ?? null;
        this.documentId = data.documentId ?? null;
        this.firstName = data.firstName ?? null;
        this.lastName = data.lastName ?? null;
        this.tel = data.tel ?? null;
        this.email = data.email ?? null;
    }
}