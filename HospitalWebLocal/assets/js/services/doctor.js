import { doctorTestData, fieldTestData, getNextId } from "../test-data.js";

export class DoctorService {
   static list(filter, callback) {
      /* Si se recibe un filtro nulo se asigna a la variable un objeto vacío que funcionará 
      igual que un objeto de filtro con valores vacíos */
      filter = filter ?? {};

      const doctors = doctorTestData.filter((item) => {
         return ((!filter.documentId || item.documentId.toLowerCase().includes(filter.documentId.toLowerCase()))
            && (!filter.firstName || item.firstName.toLowerCase().includes(filter.firstName.toLowerCase()))
            && (!filter.lastName || item.lastName.toLowerCase().includes(filter.lastName.toLowerCase()))
            && (!filter.fieldId || item.fieldId == filter.fieldId));
      });

      callback(doctors);
   }

   static get(id, callback) {
      const doctor = doctorTestData.find((item) => {
         return item.id == id;
      });

      callback(doctor);
   }

   static insert(data, callback) {
      const doctor = { ...data };
      doctor.id = getNextId(doctorTestData);

      /* Para llenar la información de la especialidad que se utiliza en el objeto doctor cargamos 
      una especialidad por medio de su id para utilizar y utilizamos los datos necesarios */
      const field = fieldTestData.find((item) => {
         return item.id == doctor.fieldId;
      });

      doctor.field = field.name;

      doctorTestData.push(doctor);
      callback(doctor);
   }

   static update(id, data, callback) {
      const doctor = doctorTestData.find((item) => {
         return item.id == id;
      });

      doctor.documentId = data.documentId;
      doctor.firstName = data.firstName;
      doctor.lastName = data.lastName;
      doctor.fieldId = data.fieldId;

      /* Para llenar la información de la especialidad que se utiliza en el objeto doctor cargamos 
      una especialidad por medio de su id para utilizar y utilizamos los datos necesarios */
      const field = fieldTestData.find((item) => {
         return item.id == data.fieldId;
      });

      doctor.field = field.name;

      callback(doctor);
   }

   static delete(id, callback) {
      const index = doctorTestData.findIndex((item) => {
         return item.id == id;
      });

      const doctor = doctorTestData.splice(index, 1)[0];
      callback(doctor);
   }
}