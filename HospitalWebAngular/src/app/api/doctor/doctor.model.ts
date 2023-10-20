import { Field } from "@api/field/field.model";

export class Doctor {
    public id: number;
    public code: string;
    public firstName: string;
    public lastName: string;
    public field: Field;

    constructor(data: any = null) {
        //Técnica de deep copy para eliminar referencias de memoria
        data = data ? JSON.parse(JSON.stringify(data)) : {};

        this.id = data.id ?? null;
        this.code = data.code ?? null;
        this.firstName = data.firstName ?? null;
        this.lastName = data.lastName ?? null;
        this.field = new Field(data.field);
    }
}