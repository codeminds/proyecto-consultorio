import { Doctor } from "./doctor.model";

export class CreateUpdateDoctor {
    public identification: Readonly<string>;
    public firstName: Readonly<string>;
    public lastName: Readonly<string>;
    public fieldId: Readonly<number>;

    constructor(data: Doctor) {
        this.identification = data.identification;
        this.firstName = data.firstName;
        this.lastName = data.lastName;
        this.fieldId = data.field.id;
    }
}