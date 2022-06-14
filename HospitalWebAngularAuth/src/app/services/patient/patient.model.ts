export class Patient {
    public id: number;
    public documentId: string;
    public firstName: string;
    public lastName: string;
    public birthDate: Date;
    public gender: boolean;

    constructor(data: any = null) {
        //Técnica de deep copy para eliminar referencias de memoria
        data = data ? JSON.parse(JSON.stringify(data)) : {};

        this.id = data.id || null;
        this.documentId = data.documentId || null;
        this.firstName = data.firstName || null;
        this.lastName = data.lastName || null;
        this.birthDate = data.birthDate ? new Date(data.birthDate) : null;
        this.gender = data.gender != null ? data.gender : null;
    }
}