import { doctorTestData, fieldTestData, getNextId } from '../test-data.js';

export class DoctorService {
   static list(filter, callback) {
      /* Si se recibe un filtro nulo se asigna a la variable un objeto vacío que funcionará 
      igual que un objeto de filtro con valores vacíos */
      filter ??= {};

      const doctors = doctorTestData.filter((item) => {
         const matchesCode = !filter.code || item.code.toLowerCase().includes(filter.code.toLowerCase());
         const matchesFirstName = !filter.firstName || item.firstName.toLowerCase().includes(filter.firstName.toLowerCase());
         const matchestLastName = !filter.lastName || item.lastName.toLowerCase().includes(filter.lastName.toLowerCase());
         const matchesField = !filter.fieldId || item.field.id == filter.fieldId;

         return matchesCode
            && matchesFirstName
            && matchestLastName
            && matchesField;
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
      const doctor = {
         id: getNextId(doctorTestData),
         code: data.code,
         firstName: data.firstName,
         lastName: data.lastName
      };

      /* Para llenar la información de la especialidad que se utiliza en el objeto doctor cargamos 
      una especialidad por medio de su id para utilizar y utilizamos los datos necesarios */
      const field = fieldTestData.find((item) => {
         return item.id == data.fieldId;
      });

      /* Para evitar valores por referencia el campo field se redefine con el spread */
      doctor.field = {
         ...field
      };

      doctorTestData.push(doctor);

      callback(doctor);
   }

   static update(id, data, callback) {
      /* No se valida un doctor no existente al actualizar por simplicidad del ejemplo */
      const doctor = doctorTestData.find((item) => {
         return item.id == id;
      });

      doctor.code = data.code;
      doctor.firstName = data.firstName;
      doctor.lastName = data.lastName;

      /* Para llenar la información de la especialidad que se utiliza en el objeto doctor cargamos 
      una especialidad por medio de su id para utilizar y utilizamos los datos necesarios */
      const field = fieldTestData.find((item) => {
         return item.id == data.fieldId;
      });

      /* Para evitar valores por referencia el campo field se redefine con el spread */
      doctor.field = {
         ...field
      };

      callback(doctor);
   }

   static delete(id, callback) {
      const index = doctorTestData.findIndex((item) => {
         return item.id == id;
      });

      if (index >= 0) {
         const doctor = doctorTestData.splice(index, 1)[0];
         callback(doctor);
      } else {
         callback(null);
      }
   }
}