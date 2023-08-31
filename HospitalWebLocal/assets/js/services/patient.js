import { genderTestData, getNextId, patientTestData } from '../test-data.js';

export class PatientService {
   static list(filter, callback) {
      /* Si se recibe un filtro nulo se asigna a la variable un objeto vacío que funcionará 
      igual que un objeto de filtro con valores vacíos */
      filter ??= {};

      const patients = patientTestData.filter((item) => {
         const matchesDocumentId = !filter.documentId || item.documentId.toLowerCase().includes(filter.documentId.toLowerCase());
         const matchesFirstName = !filter.firstName || item.firstName.toLowerCase().includes(filter.firstName.toLowerCase());
         const matchestLastName = !filter.lastName || item.lastName.toLowerCase().includes(filter.lastName.toLowerCase());
         const matchesBirthDateFrom = !filter.birthDateFrom || item.birthDate >= filter.birthDateFrom;
         const matchesBirthDateTo = !filter.birthDateTo || item.birthDate <= filter.birthDateTo;
         const matchesGender = !filter.genderId || item.gender.id == filter.genderId;

         return matchesDocumentId
            && matchesFirstName
            && matchestLastName
            && matchesBirthDateFrom
            && matchesBirthDateTo
            && matchesGender
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
         birthDate: data.birthDate
      };

      /* Para llenar la información del género que se utiliza en el objeto paciente cargamos 
      un género por medio de su id para utilizar y utilizamos los datos necesarios */
      const gender = genderTestData.find((item) => {
         return item.id == data.genderId;
      });

      patient.gender = {
         ...gender
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
      patient.birthDate = data.birthDate;

      /* Para llenar la información de la especialidad que se utiliza en el objeto doctor cargamos 
      una especialidad por medio de su id para utilizar y utilizamos los datos necesarios */
      const gender = genderTestData.find((item) => {
         return item.id == data.genderId;
      });

      patient.gender = {
         ...gender
      };

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