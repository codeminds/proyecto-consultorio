import { Doctor } from "./doctor.model";

export class CreateUpdateDoctorDTO {
    public readonly documentId: string;
    public readonly firstName: string;
    public readonly lastName: string;
    public readonly fieldId: number;

    constructor(data: Doctor) {
        this.documentId = data.documentId;
        this.firstName = data.firstName;
        this.lastName = data.lastName;
        this.fieldId = data.field.id;
    }
}

export class FilterDoctorDTO {
    public documentId: string;
    public firstName: string;
    public lastName: string;
    public fieldId: number;

    constructor(data: any = null) {
        //Técnica de deep copy para eliminar referencias de memoria
        data = data ? JSON.parse(JSON.stringify(data)) : {};

        this.documentId = data.documentId != null ? String(data.documentId) : null;
        this.firstName = data.firstName != null ? String(data.firstName) : null;
        this.lastName = data.lastName != null ? String(data.lastName) : null;
        this.fieldId = data.fieldId != null ? Number(data.fieldId) : null;
    }
}