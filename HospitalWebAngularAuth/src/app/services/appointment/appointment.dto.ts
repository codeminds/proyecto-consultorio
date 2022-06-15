import { Appointment } from "./appointment.model";

export class CreateUpdateAppointmentDTO {
    public readonly date: string;
    public readonly doctorId: number;
    public readonly patientId: number;

    constructor(data: Appointment) {
        //Convertimos la fecha a date string porque Angular fuerza
        //los objetos de fecha a convertirse a tiempo universal (UTC)
        //a la hora de hacer llamados de API, esencialmente cambiando la
        //hora guardada en la base de datos ya que nuestro sistema
        //no maneja conversiones de hora y sólo trabaja con hora local
        this.date = data.date.toInputDateString();
        this.doctorId = data.doctor.id;
        this.patientId = data.patient.id;
    }
}