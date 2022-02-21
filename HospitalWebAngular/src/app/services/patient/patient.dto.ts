import { Patient } from "./patient.model";

export class CreateUpdatePatientDTO {
    public documentId: Readonly<string>;
    public firstName: Readonly<string>;
    public lastName: Readonly<string>;
    public birthDate: Readonly<Date>;
    public gender: Readonly<boolean>;

    constructor(data: Patient) {
        this.documentId = data.documentId;
        this.firstName = data.firstName;
        this.lastName = data.lastName;
        this.birthDate = data.birthDate;
        this.gender = data.gender;
    }
}