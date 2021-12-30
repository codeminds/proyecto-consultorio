import { Doctor } from "./doctor.model";

export class CreateUpdaterDoctorDTO {
    public documentId: Readonly<string>;
    public firstName: Readonly<string>;
    public lastName: Readonly<string>;
    public fieldId: Readonly<number>;

    constructor(data: Doctor) {
        this.documentId = data.documentId;
        this.firstName = data.firstName;
        this.lastName = data.lastName;
        this.fieldId = data.field.id;
    }
}