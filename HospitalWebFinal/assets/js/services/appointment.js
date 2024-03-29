import { BaseService } from "./base.js";

export class AppointmentService extends BaseService {
   static list(filter, callback) {
      /* Se crea el filtro de la lista en query params para enviar al API */
      const filterString = `doctor.code=${filter?.doctor?.code ?? ''}`
         + `&doctor.firstName=${filter?.doctor?.firstName ?? ''}`
         + `&doctor.lastName=${filter?.doctor?.lastName ?? ''}`
         + `&doctor.fieldId=${filter?.doctor?.fieldId ?? ''}`
         + `&patient.documentId=${filter?.patient?.documentId ?? ''}`
         + `&patient.firstName=${filter?.patient?.firstName ?? ''}`
         + `&patient.lastName=${filter?.patient?.lastName ?? ''}`
         + `&patient.tel=${filter?.patient?.tel ?? ''}`
         + `&patient.email=${filter?.patient?.email ?? ''}`
         + `&dateFrom=${filter?.dateFrom ?? ''}`
         + `&dateTo=${filter?.dateTo ?? ''}`
         + `&statusId=${filter?.statusId ?? ''}`;

      fetch(`https://localhost:7221/api/appointments?${filterString}`, {
         method: 'GET',
         headers: {
            'Content-Type': 'application/json'
         }
      }).then((response) => this.handleResponse(response, callback));
   }

   static get(id, callback) {
      fetch(`https://localhost:7221/api/appointments/${id}`, {
         method: 'GET',
         headers: {
            'Content-Type': 'application/json'
         }
      }).then((response) => this.handleResponse(response, callback));
   }

   static insert(data, callback) {
      fetch('https://localhost:7221/api/appointments', {
         method: 'POST',
         headers: {
            'Content-Type': 'application/json'
         },
         body: JSON.stringify(data)
      }).then((response) => this.handleResponse(response, callback));
   }

   static update(id, data, callback) {
      fetch(`https://localhost:7221/api/appointments/${id}`, {
         method: 'PUT',
         headers: {
            'Content-Type': 'application/json'
         },
         body: JSON.stringify(data)
      }).then((response) => this.handleResponse(response, callback));
   }

   static delete(id, callback) {
      fetch(`https://localhost:7221/api/appointments/${id}`, {
         method: 'DELETE',
         headers: {
            'Content-Type': 'application/json'
         }
      }).then((response) => this.handleResponse(response, callback));
   }
}