import { appointmentTestData, getNextId, doctorTestData, patientTestData, statusTestData } from '../test-data.js';
import { DoctorService } from './doctor.js';
import { PatientService } from './patient.js';

export class AppointmentService {
   static list(filter, callback) {
      /* Si se recibe un filtro nulo se asigna a la variable un objeto vacío que funcionará 
      igual que un objeto de filtro con valores vacíos */
      filter ??= {};

      let doctors;
      let patients;

      /* Por medio del filtro interno de doctor se trae una lista para filtrar las citas */
      DoctorService.list(filter.doctor, (result) => {
         doctors = result;
      });

      /* Por medio del filtro interno de paciente se trae una lista para filtrar las citas */
      PatientService.list(filter.patient, (result) => {
         patients = result;
      });

      const appointments = appointmentTestData.filter((item) => {
         const matchesDateFrom = !filter.dateFrom || item.date >= filter.dateFrom;
         const matchesDateTo = !filter.dateTo || item.date <= filter.dateTo;
         const matchesStatus = !filter.statusId || item.status.id == filter.statusId;
         const matchesDoctors = doctors.some((doctor) => {
            return doctor.id == item.doctor.id;
         });
         const matchesPatients = patients.some((patient) => {
            return patient.id == item.patient.id;
         });

         return matchesDateFrom
            && matchesDateTo
            && matchesStatus
            && matchesDoctors
            && matchesPatients;
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
      const appointment = {
         id: getNextId(appointmentTestData),
         date: data.date,
      };

      /* Para llenar la información del doctor que se utiliza en el objeto cita cargamos 
      un doctor por medio de su id para utilizar y utilizamos los datos necesarios */
      const doctor = doctorTestData.find((item) => {
         return item.id == data.doctorId;
      });

      /* Para evitar valores por referencia el campo field se redefine con el spread */
      appointment.doctor = {
         ...doctor,
         field: { ...doctor.field }
      };

      /* Para llenar la información del paciente que se utiliza en el objeto cita cargamos 
      un paciente por medio de su id para utilizar y utilizamos los datos necesarios */
      const patient = patientTestData.find((item) => {
         return item.id == data.patientId;
      });

      /* Para evitar valores por referencia el campo gender se redefine con el spread */
      appointment.patient = {
         ...patient
      };

      /* Para llenar la información de la estado que se utiliza en el objeto cita cargamos 
      un estado por medio de su id para utilizar y utilizamos los datos necesarios */
      const status = statusTestData.find((item) => {
         return item.id == data.statusId;
      });

      /* Para evitar valores por referencia el campo status se redefine con el spread */
      appointment.status = {
         ...status
      };

      appointmentTestData.push(appointment);

      callback(appointment);
   }

   static update(id, data, callback) {
      /* No se valida una cita no existente al actualizar por simplicidad del ejemplo */
      const appointment = appointmentTestData.find((item) => {
         return item.id == id;
      });

      appointment.date = data.date;

      /* Para llenar la información del doctor que se utiliza en el objeto cita cargamos 
      un doctor por medio de su id para utilizar y utilizamos los datos necesarios */
      const doctor = doctorTestData.find((item) => {
         return item.id == data.doctorId;
      });

      /* Para evitar valores por referencia el campo field se redefine con el spread */
      appointment.doctor = {
         ...doctor,
         field: { ...doctor.field }
      };

      /* Para llenar la información del paciente que se utiliza en el objeto cita cargamos 
      un paciente por medio de su id para utilizar y utilizamos los datos necesarios */
      const patient = patientTestData.find((item) => {
         return item.id == data.patientId;
      });

      /* Para evitar valores por referencia el campo gender se redefine con el spread */
      appointment.patient = {
         ...patient
      };

      /* Para llenar la información de la estado que se utiliza en el objeto cita cargamos 
      un estado por medio de su id para utilizar y utilizamos los datos necesarios */
      const status = statusTestData.find((item) => {
         return item.id == data.statusId;
      });

      /* Para evitar valores por referencia el campo status se redefine con el spread */
      appointment.status = {
         ...status
      };

      callback(appointment);
   }

   static delete(id, callback) {
      const index = appointmentTestData.findIndex((item) => {
         return item.id == id;
      });

      if (index >= 0) {
         const appointment = appointmentTestData.splice(index, 1)[0];
         callback(appointment);
      } else {
         callback(null);
      }
   }
}