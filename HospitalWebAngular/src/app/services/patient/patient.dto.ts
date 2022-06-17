import { Patient } from "./patient.model";

export class CreateUpdatePatientDTO {
    public readonly documentId: string;
    public readonly firstName: string;
    public readonly lastName: string;
    public readonly birthDate: string;
    public readonly gender: boolean;

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
        this.gender = data.gender;
    }
}