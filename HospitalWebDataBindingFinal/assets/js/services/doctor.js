import { BaseService } from "./base.js";

export class DoctorService extends BaseService {
   static list(filter, callback) {
      /* Se crea el filtro de la lista en query params para enviar al API */
      const filterString = `documentId=${filter?.documentId ?? ''}`
                            + `&firstName=${filter?.firstName ?? ''}`
                            + `&lastName=${filter?.lastName ?? ''}`
                            + `&fieldId=${filter?.fieldId ?? ''}`;

      fetch(`https://localhost:7143/api/doctors?${filterString}`, {
         method: 'GET',
         headers: {
            'Content-Type': 'application/json'
         }
      }).then((response) => this.handleResponse(response, callback));
   }

   static get(id, callback) {
      fetch(`https://localhost:7143/api/doctors/${id}`, {
         method: 'GET',
         headers: {
            'Content-Type': 'application/json'
         }
      }).then((response) => this.handleResponse(response, callback));
   }

   static insert(data, callback) {
      fetch('https://localhost:7143/api/doctors', {
         method: 'POST',
         headers: {
            'Content-Type': 'application/json'
         },
         body: JSON.stringify(data)
      }).then((response) => this.handleError(response, callback));
   }

   static update(id, data, callback) {
      fetch(`https://localhost:7143/api/doctors/${id}`, {
         method: 'PUT',
         headers: {
            'Content-Type': 'application/json'
         },
         body: JSON.stringify(data)
      }).then((response) => this.handleResponse(response, callback));
   }

   static delete(id, callback) {
      fetch(`https://localhost:7143/api/doctors/${id}`, {
         method: 'DELETE',
         headers: {
            'Content-Type': 'application/json'
         }
      }).then((response) => this.handleResponse(response, callback));
   }
}