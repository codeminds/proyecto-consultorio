import { Patient } from "./patient.model";

export class CreateUpdatePatientDTO {
    public readonly documentId: string;
    public readonly firstName: string;
    public readonly lastName: string;
    public readonly tel: string;
    public readonly email: string;

    constructor(data: Patient) {
        this.documentId = data.documentId;
        this.firstName = data.firstName;
        this.lastName = data.lastName;
        this.tel = data.tel;
        this.email = data.email;
    }
}

export class FilterPatientDTO {
    public documentId: string;
    public firstName: string;
    public lastName: string;
    public tel: string;
    public email: string;

    constructor(data: any = null) {
        //Técnica de deep copy para eliminar referencias de memoria
        data = data ? JSON.parse(JSON.stringify(data)) : {};

        this.documentId = data.documentId ?? null;
        this.firstName = data.firstName ?? null;
        this.lastName = data.lastName ?? null;
        this.tel = data.tel ?? null;
        this.email = data.email ?? null;
    }
}