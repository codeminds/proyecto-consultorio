import { FilterDoctorDTO } from "@api/doctor/doctor.dto";
import { FilterPatientDTO } from "@api/patient/patient.dto";
import { Appointment } from "./appointment.model";

export class InsertUpdateAppointmentDTO {
    public readonly date: string;
    public readonly doctorId: number;
    public readonly patientId: number;
    public readonly statusId: number;

    constructor(data: Appointment) {
        //Convertimos la fecha a date string porque Angular fuerza
        //los objetos de fecha a convertirse a tiempo universal (UTC)
        //a la hora de hacer llamados de API, esencialmente cambiando la
        //hora guardada en la base de datos ya que nuestro sistema
        //no maneja conversiones de hora y sólo trabaja con hora local
        this.date = data.date?.toInputDateString();
        this.doctorId = data.doctor.id;
        this.patientId = data.patient.id;
        this.statusId = data.status.id;
    }
}

export class FilterAppointmentDTO {
    public dateFrom: Date;
    public dateTo: Date;
    public statusId: number;
    public patient: FilterPatientDTO;
    public doctor: FilterDoctorDTO;

    constructor(data: any = null) {
        //Técnica de deep copy para eliminar referencias de memoria
        data = data ? JSON.parse(JSON.stringify(data)) : {};

        this.dateFrom = data.dateFrom != null ? new Date(data.dateFrom) : null;
        this.dateTo = data.dateTo != null ? new Date(data.dateTo) : null;
        this.statusId = data.statusId;
        this.patient = new FilterPatientDTO(data.patient);
        this.doctor = new FilterDoctorDTO(data.doctor);
    }
}