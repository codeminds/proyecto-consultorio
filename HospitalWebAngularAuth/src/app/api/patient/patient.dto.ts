import { Patient } from "./patient.model";

export class InsertUpdatePatientDTO {
    public readonly documentId: string;
    public readonly firstName: string;
    public readonly lastName: string;
    public readonly birthDate: string;
    public readonly genderId: number;

    constructor(data: Patient) {
        this.documentId = data.documentId;
        this.firstName = data.firstName;
        this.lastName = data.lastName;
        //Convertimos la fecha a date string porque Angular fuerza
        //los objetos de fecha a convertirse a tiempo universal (UTC)
        //a la hora de hacer llamados de API, esencialmente cambiando la
        //hora guardada en la base de datos ya que nuestro sistema
        //no maneja conversiones de hora y sólo trabaja con hora local
        this.birthDate = data.birthDate?.toInputDateString();
        this.genderId = data.gender.id;
    }
}

export class FilterPatientDTO {
    public documentId: string;
    public firstName: string;
    public lastName: string;
    public birthDateFrom: Date;
    public birthDateTo: Date;
    public genderId: number;

    constructor(data: any = null) {
        //Técnica de deep copy para eliminar referencias de memoria
        data = data ? JSON.parse(JSON.stringify(data)) : {};

        this.documentId = data.documentId != null ? String(data.documentId) : null;
        this.firstName = data.firstName != null ? String(data.firstName) : null;
        this.lastName = data.lastName != null ? String(data.lastName) : null;
        this.birthDateFrom = data.birthDateFrom != null ? new Date(data.birthDateFrom) : null;
        this.birthDateTo = data.birthDateTo != null ? new Date(data.birthDateTo) : null;
        this.genderId = data.genderId != null ? Number(data.genderId) : null;
    }
}