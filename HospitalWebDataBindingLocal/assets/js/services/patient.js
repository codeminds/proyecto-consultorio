import { patientTestData, getNextId, genderTestData } from "../test-data.js";

export class PatientsService {
   static list(filter, callback) {
      filter = filter ?? {};

      const result = patientTestData.filter((item) => {
         return ((!filter.documentId || item.documentId.toLowerCase().includes(filter.documentId.toLowerCase()))
            && (!filter.firstName || item.firstName.toLowerCase().includes(filter.firstName.toLowerCase()))
            && (!filter.lastName || item.lastName.toLowerCase().includes(filter.lastName.toLowerCase()))
            && (!filter.birthDateFrom || item.birthDate >= filter.birthDateFrom)
            && (!filter.birthDateTo || item.birthDate <= filter.birthDateTo)
            && (!filter.genderId || item.genderId == filter.genderId));
      });

      callback(result);
   }

   static get(id, callback) {
      const result = patientTestData.find((item) => {
         return item.id == id;
      });
      callback(result);
   }

   static insert(data, callback) {
      data.id = getNextId(patientTestData);

      const gender = genderTestData.find((item) => {
         return item.id == data.genderId;
      })

      data.gender = gender.name;

      patientTestData.push(data);
      callback(data);
   }

   static update(id, data, callback) {
      const patient = patientTestData.find((item) => {
         return item.id == id;
      });

      if (patient != null) {
         patient.documentId = data.documentId;
         patient.firstName = data.firstName;
         patient.lastName = data.lastName;
         patient.birthDate = data.birthDate;

         const gender = genderTestData.find((item) => {
            return item.id == data.genderId;
         })

         patient.gender = gender.name;

         callback(patient);
      } else {
         callback(null);
      }
   }

   static delete(id, callback) {
      const index = patientTestData.findIndex((item) => {
         return item.id == id;
      });

      if (index >= 0) {
         patientTestData.splice(index, 1);
         callback(true);
      } else {
         callback(false);
      }
   }
}

