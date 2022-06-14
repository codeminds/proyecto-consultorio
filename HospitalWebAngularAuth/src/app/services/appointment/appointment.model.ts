import { Doctor } from "@services/doctor/doctor.model";
import { Patient } from "@services/patient/patient.model";

export class Appointment {
    public id: number;
    public date: Date;
    public doctor: Doctor;
    public patient: Patient;

    constructor(data: any = null) {
        //Técnica de deep copy para eliminar referencias de memoria
        data = data ? JSON.parse(JSON.stringify(data)) : {};

        this.id = data.id || null;
        this.date = data.date ? new Date(data.date) : null;
        this.doctor = new Doctor(data.doctor);
        this.patient = new Patient(data.patient);
    }
}