import { Field } from "@services/field/field.model";

export class Doctor {
    public id: number;
    public documentId: string;
    public firstName: string;
    public lastName: string;
    public field: Field;

    constructor(data: any = null) {
        //Técnica de deep copy para eliminar referencias de memoria
        data = data ? JSON.parse(JSON.stringify(data)) : {};

        this.id = data.id || null;
        this.documentId = data.documentId || null;
        this.firstName = data.firstName || null;
        this.lastName = data.lastName || null;
        this.field = new Field(data.field);
    }
}