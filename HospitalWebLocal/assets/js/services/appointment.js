import { appointmentTestData, doctorTestData, getNextId, patientTestData } from "../test-data.js";
import { DoctorService } from "./doctor.js";
import { PatientsService } from "./patient.js";

export class AppointmentsService {
   static list(filter, callback) {
      /* Si se recibe un filtro nulo se asigna a la variable un objeto vacío que funcionará 
      igual que un objeto de filtro con valores vacíos */
      filter = filter ?? {};

      let doctors;
      let patients;

      //Por medio del filtro interno de doctor se trae una lista para filtrar las citas
      DoctorService.list(filter.doctor, (result) => {
         doctors = result;
      });

      //Por medio del filtro interno de paciente se trae una lista para filtrar las citas
      PatientsService.list(filter.patient, (result) => {
         patients = result;
      });

      const appointments = appointmentTestData.filter((item) => {
         return ((!filter.dateFrom || item.date >= filter.dateFrom)
            && (!filter.dateTo || item.date <= filter.dateTo)
            /* Se filtran sólo citas que tengan asginado a un doctor
            que esté en la lista filtrada de doctores */
            && doctors.some((doctor) => {
               return doctor.id == item.doctorId;
            })
            /* Se filtran sólo citas que tengan asginado a un paciente
            que esté en la lista filtrada de pacientes */
            && patients.some((patient) => {
               return patient.id == item.patientId;
            }));
      });

      callback(appointments);
   }

   static get(id, callback) {
      const appointment = appointmentTestData.find((item) => {
         return item.id == id;
      });

      callback(appointment);
   }

   static insert(data, callback) {
      const appointment = { ...data };
      appointment.id = getNextId(appointmentTestData);

      /* Para llenar la información del doctor que se utiliza en el objeto cita cargamos 
      un doctor por medio de su id para utilizar y utilizamos los datos necesarios */
      const doctor = doctorTestData.find((item) => {
         return item.id == appointment.doctorId;
      });

      appointment.doctorName = `${doctor.firstName} ${doctor.lastName}`;
      appointment.doctorField = doctor.field;

      /* Para llenar la información del paciente que se utiliza en el objeto cita cargamos 
      un paciente por medio de su id para utilizar y utilizamos los datos necesarios */
      const patient = patientTestData.find((item) => {
         return item.id == appointment.patientId;
      });

      appointment.patientName = `${patient.firstName} ${patient.lastName}`;

      appointmentTestData.push(appointment);
      callback(appointment);
   }

   static update(id, data, callback) {
      const appointment = appointmentTestData.find((item) => {
         return item.id == id;
      });

      appointment.date = data.date;
      appointment.doctorId = data.doctorId;
      appointment.patientId = data.patientId;

      /* Para llenar la información del doctor que se utiliza en el objeto cita cargamos 
      un doctor por medio de su id para utilizar y utilizamos los datos necesarios */
      const doctor = doctorTestData.find((item) => {
         return item.id == data.doctorId;
      });

      appointment.doctorName = `${doctor.firstName} ${doctor.lastName}`;
      appointment.doctorField = doctor.field;

      /* Para llenar la información del paciente que se utiliza en el objeto cita cargamos 
      un paciente por medio de su id para utilizar y utilizamos los datos necesarios */
      const patient = patientTestData.find((item) => {
         return item.id == data.patientId;
      });

      appointment.patientName = `${patient.firstName} ${patient.lastName}`;
      callback(appointment);
   }

   static delete(id, callback) {
      const index = appointmentTestData.findIndex((item) => {
         return item.id == id;
      });

      const appointment = appointmentTestData.splice(index, 1)[0];
      callback(appointment);
   }
}