import { appointmentTestData, doctorTestData, getNextId, patientTestData } from "../test-data.js";
import { DoctorService } from "./doctor.js";
import { PatientsService } from "./patient.js";

export class AppointmentsService {
   static list(filter, callback) {
      filter = filter ?? {};

      let doctors;
      let patients;

      DoctorService.list(filter.doctor, (result) => {
         doctors = result;
      });

      PatientsService.list(filter.patient, (result) => {
         patients = result;
      });

      const result = appointmentTestData.filter((item) => {
         return ((!filter.dateFrom || item.date >= filter.dateFrom)
            && (!filter.dateTo || item.date <= filter.dateTo)
            && doctors.some((doctor) => {
               return doctor.id == item.doctorId;
            })
            && patients.some((patient) => {
               return patient.id == item.patientId;
            }));
      });

      callback(result);
   }

   static get(id, callback) {
      const result = appointmentTestData.find((item) => {
         return item.id == id;

      });

      callback(result);
   }

   static insert(data, callback) {
      data.id = getNextId(appointmentTestData);

      const doctor = doctorTestData.find((item) => {
         return item.id == data.doctorId;
      });

      data.doctorName = `${doctor.firstName} ${doctor.lastName}`;
      data.doctorField = doctor.field;

      const patient = patientTestData.find((item) => {
         return item.id == data.patientId;
      });

      data.patientName = `${patient.firstName} ${patient.lastName}`;

      appointmentTestData.push(data);
      callback(data);
   }

   static update(id, data, callback) {
      const appointment = appointmentTestData.find((item) => {
         return item.id == id;
      });

      if (appointment != null) {
         appointment.date = data.date;
         appointment.doctorId = data.doctorId;
         appointment.patientId = data.patientId;

         const doctor = doctorTestData.find((item) => {
            return item.id == data.doctorId;
         });

         appointment.doctorName = `${doctor.firstName} ${doctor.lastName}`;
         appointment.doctorField = doctor.field;

         const patient = patientTestData.find((item) => {
            return item.id == data.patientId;
         });

         appointment.patientName = `${patient.firstName} ${patient.lastName}`;
         callback(appointment);
      } else {
         callback(null);
      }
   }

   static delete(id, callback) {
      const index = appointmentTestData.findIndex((item) => {
         return item.id == id;
      });

      if (index >= 0) {
         appointmentTestData.splice(index, 1);
         callback(true);
      } else {
         callback(false);
      }
   }
}
