import { Doctor } from "./doctor.model";

export class CreateUpdateDoctorDTO {
    public readonly code: string;
    public readonly firstName: string;
    public readonly lastName: string;
    public readonly fieldId: number;

    constructor(data: Doctor) {
        this.code = data.code;
        this.firstName = data.firstName;
        this.lastName = data.lastName;
        this.fieldId = data.field.id;
    }
}

export class FilterDoctorDTO {
    public code: string;
    public firstName: string;
    public lastName: string;
    public fieldId: number;

    constructor(data: any = null) {
        //Técnica de deep copy para eliminar referencias de memoria
        data = data ? JSON.parse(JSON.stringify(data)) : {};

        this.code = data.code ?? null;
        this.firstName = data.firstName ?? null;
        this.lastName = data.lastName ?? null;
        this.fieldId = data.fieldId ?? null;
    }
}