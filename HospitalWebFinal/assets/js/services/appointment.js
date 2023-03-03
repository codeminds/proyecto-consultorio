import { BaseService } from "./base.js";
import { DateService } from "./date.js";

export class AppointmentsService extends BaseService {
   static list(filter, callback) {
      /* Se crea el filtro de la lista en query params para enviar al API */
      const filterString = `doctor.documentId=${filter?.doctor?.documentId ?? ''}`
         + `&doctor.firstName=${filter?.doctor?.firstName ?? ''}`
         + `&doctor.lastName=${filter?.doctor?.lastName ?? ''}`
         + `&doctor.fieldId=${filter?.doctor?.fieldId ?? ''}`
         + `&patient.documentId=${filter?.patient?.documentId ?? ''}`
         + `&patient.firstName=${filter?.patient?.firstName ?? ''}`
         + `&patient.lastName=${filter?.patient?.lastName ?? ''}`
         + `&patient.birthDateFrom=${filter?.patient?.birthDateFrom ?? ''}`
         + `&patient.birthDateTo=${filter?.patient?.birthDateTo ?? ''}`
         + `&patient.genderId=${filter?.patient?.genderId ?? ''}`
         + `&dateFrom=${filter?.dateFrom ?? ''}`
         + `&dateTo=${filter?.dateTo ?? ''}`;

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