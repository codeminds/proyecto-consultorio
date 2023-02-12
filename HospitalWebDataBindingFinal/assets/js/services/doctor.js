import { doctorTestData, fieldTestData, getNextId } from "../test-data.js";
import { BaseService } from "./base.js";

export class DoctorService extends BaseService {
   static list(filter, callback) {
      const filterString = `documentId=${filter?.documentId ?? ''}`
                            + `&firstName=${filter?.firstName ?? ''}`
                            + `&lastName=${filter?.lastName ?? ''}`
                            + `&fieldId=${filter?.fieldId ?? ''}`;

      fetch(`https://localhost:7143/api/doctors?${filterString}`, {
         method: 'GET',
         headers: {
            'Content-Type': 'application/json'
         }
      }).then((response) => response.json())
      .then((data) => {
         if(data.statusCode == 200) {
               callback(data);
         } else {
               this.handleError(data);
         }
      });
   }

   static get(id, callback) {
      fetch(`https://localhost:7143/api/doctors/${id}`, {
         method: 'GET',
         headers: {
            'Content-Type': 'application/json'
         }
      }).then((response) => response.json())
      .then((data) => {
         if(data.statusCode == 200) {
               callback(data);
         } else {
               this.handleError(data);
         }
      });
   }

   static insert(data, callback) {
      fetch('https://localhost:7143/api/doctors', {
         method: 'POST',
         headers: {
            'Content-Type': 'application/json'
         },
         body: JSON.stringify(data)
      }).then((response) => response.json())
      .then((data) => {
         if(data.statusCode == 200) {
               callback(data);
         } else {
               this.handleError(data);
         }
      });
   }

   static update(id, data, callback) {
      fetch(`https://localhost:7143/api/doctors/${id}`, {
         method: 'PUT',
         headers: {
            'Content-Type': 'application/json'
         },
         body: JSON.stringify(data)
      }).then((response) => response.json())
      .then((data) => {
         if(data.statusCode == 200) {
               callback(data);
         } else {
               this.handleError(data);
         }
      });
   }

   static delete(id, callback) {
      fetch(`https://localhost:7143/api/doctors/${id}`, {
         method: 'DELETE',
         headers: {
            'Content-Type': 'application/json'
         }
      }).then((response) => response.json())
      .then((data) => {
         if(data.statusCode == 200) {
               callback(data);
         } else {
               this.handleError(data);
         }
      });
   }
}