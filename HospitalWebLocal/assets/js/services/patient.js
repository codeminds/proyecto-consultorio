import { getNextId, patientTestData } from '../test-data.js';

export class PatientService {
   static list(filter, callback) {
      /* Si se recibe un filtro nulo se asigna a la variable un objeto vacío que funcionará 
      igual que un objeto de filtro con valores vacíos */
      filter ??= {};

      const patients = patientTestData.filter((item) => {
         const matchesDocumentId = !filter.documentId || item.documentId.toLowerCase().includes(filter.documentId.toLowerCase());
         const matchesFirstName = !filter.firstName || item.firstName.toLowerCase().includes(filter.firstName.toLowerCase());
         const matchestLastName = !filter.lastName || item.lastName.toLowerCase().includes(filter.lastName.toLowerCase());
         const matchesTel = !filter.tel || item.tel.toLowerCase().includes(filter.tel.toLowerCase());
         const matchesEmail = !filter.email || item.email.toLowerCase().includes(filter.email.toLowerCase());

         return matchesDocumentId
            && matchesFirstName
            && matchestLastName
            && matchesTel
            && matchesEmail;
      });

      callback(patients);
   }

   static get(id, callback) {
      const patient = patientTestData.find((item) => {
         return item.id == id;
      });

      callback(patient);
   }

   static insert(data, callback) {
      const patient = {
         id: getNextId(patientTestData),
         documentId: data.documentId,
         firstName: data.firstName,
         lastName: data.lastName,
         tel: data.tel,
         email: data.email
      };

      patientTestData.push(patient);

      callback(patient);
   }

   static update(id, data, callback) {
      /* No se valida un paciente no existente al actualizar por simplicidad del ejemplo */
      const patient = patientTestData.find((item) => {
         return item.id == id;
      });

      patient.documentId = data.documentId;
      patient.firstName = data.firstName;
      patient.lastName = data.lastName;
      patient.tel = data.tel;
      patient.email = data.email;

      callback(patient);
   }

   static delete(id, callback) {
      const index = patientTestData.findIndex((item) => {
         return item.id == id;
      });

      if (index >= 0) {
         const patient = patientTestData.splice(index, 1)[0];
         callback(patient);
      } else {
         callback(null);
      }
   }
}