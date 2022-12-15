import { Gender } from "@api/gender/gender.model";

export class Patient {
    public id: number;
    public documentId: string;
    public firstName: string;
    public lastName: string;
    public birthDate: Date;
    public gender: Gender;

    constructor(data: any = null) {
        //Técnica de deep copy para eliminar referencias de memoria
        data = data ? JSON.parse(JSON.stringify(data)) : {};

        this.id = data.id != null ? Number(data.id) : null;
        this.documentId = data.documentId != null ? String(data.documentId) : null;
        this.firstName = data.firstName != null ? String(data.firstName) : null;
        this.lastName = data.lastName != null ? String(data.lastName) : null;
        this.birthDate = data.birthDate != null ? new Date(data.birthDate) : null;
        this.gender = new Gender(data.gender);
    }
}