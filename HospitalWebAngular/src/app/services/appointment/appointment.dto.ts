import { Appointment } from "./appointment.model";

export class CreateUpdateAppointmentDTO {
    public date: Readonly<Date>;
    public doctorId: Readonly<number>;
    public patientId: Readonly<number>;

    constructor(data: Appointment) {
        this.date = data.date;
        this.doctorId = data.doctor.id;
        this.patientId = data.patient.id;
    }
}