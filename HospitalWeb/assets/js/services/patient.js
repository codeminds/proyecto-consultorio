import { patientTestData, getNextId, genderTestData } from "../test-data.js";

export class PatientsService {
   static list(filter, callback) {
      /* Si se recibe un filtro nulo se asigna a la variable un objeto vacío que funcionará 
      igual que un objeto de filtro con valores vacíos */
      filter = filter ?? {};

      const patients = patientTestData.filter((item) => {
         return ((!filter.documentId || item.documentId.toLowerCase().includes(filter.documentId.toLowerCase()))
            && (!filter.firstName || item.firstName.toLowerCase().includes(filter.firstName.toLowerCase()))
            && (!filter.lastName || item.lastName.toLowerCase().includes(filter.lastName.toLowerCase()))
            && (!filter.birthDateFrom || item.birthDate >= filter.birthDateFrom)
            && (!filter.birthDateTo || item.birthDate <= filter.birthDateTo)
            && (!filter.genderId || item.genderId == filter.genderId));
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
      const patient = { ...data };
      patient.id = getNextId(patientTestData);

      /* Para llenar la información del género que se utiliza en el objeto paciente cargamos 
      un género por medio de su id para utilizar y utilizamos los datos necesarios */
      const gender = genderTestData.find((item) => {
         return item.id == patient.genderId;
      })

      patient.gender = gender.name;

      patientTestData.push(patient);
      callback(patient);
   }

   static update(id, data, callback) {
      const patient = patientTestData.find((item) => {
         return item.id == id;
      });

      patient.documentId = data.documentId;
      patient.firstName = data.firstName;
      patient.lastName = data.lastName;
      patient.birthDate = data.birthDate;

      /* Para llenar la información del género que se utiliza en el objeto paciente cargamos 
      un género por medio de su id para utilizar y utilizamos los datos necesarios */
      const gender = genderTestData.find((item) => {
         return item.id == data.genderId;
      })

      patient.gender = gender.name;

      callback(patient);
   }

   static delete(id, callback) {
      const index = patientTestData.findIndex((item) => {
         return item.id == id;
      });

      const patient = patientTestData.splice(index, 1)[0];
      callback(patient);
   }
}