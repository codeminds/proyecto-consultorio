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