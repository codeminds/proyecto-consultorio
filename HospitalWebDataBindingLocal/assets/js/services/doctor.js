import { doctorTestData, fieldTestData, getNextId } from "../test-data.js";

export class DoctorService {
   static list(filter, callback) {
      filter = filter ?? {};

      const result = doctorTestData.filter((item) => {
         return ((!filter.documentId || item.documentId.toLowerCase().includes(filter.documentId.toLowerCase()))
            && (!filter.firstName || item.firstName.toLowerCase().includes(filter.firstName.toLowerCase()))
            && (!filter.lastName || item.lastName.toLowerCase().includes(filter.lastName.toLowerCase()))
            && (!filter.fieldId || item.fieldId == filter.fieldId));
      });

      callback(result);
   }

   static get(id, callback) {
      const result = doctorTestData.find((item) => {
         return item.id == id;
      });

      callback(result);
   }

   static insert(data, callback) {
      data.id = getNextId(doctorTestData);

      const field = fieldTestData.find((item) => {
         return item.id == data.fieldId;
      });

      data.field = field.name;

      doctorTestData.push(data);
      callback(data);
   }

   static update(id, data, callback) {
      const doctor = doctorTestData.find((item) => {
         return item.id == id;
      });

      if (doctor != null) {
         doctor.documentId = data.documentId;
         doctor.firstName = data.firstName;
         doctor.lastName = data.lastName;
         doctor.fieldId = data.fieldId;

         const field = fieldTestData.find((item) => {
            return item.id == data.fieldId;
         });

         doctor.field = field.name;

         callback(doctor);
      } else {
         callback(null);
      }
   }

   static delete(id, callback) {
      const index = doctorTestData.findIndex((item) => {
         return item.id == id;
      });

      if (index >= 0) {
         doctorTestData.splice(index, 1);
         callback(true);
      } else {
         callback(false);
      }
   }
}