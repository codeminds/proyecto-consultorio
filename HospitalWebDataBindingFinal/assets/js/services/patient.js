import { BaseService } from "./base.js";
import { DateService } from "./date.js";

export class PatientsService extends BaseService {
   static list(filter, callback) {
      /* Se crea el filtro de la lista en query params para enviar al API */
      const filterString = `&documentId=${filter?.documentId ?? ''}`
         + `&firstName=${filter?.firstName ?? ''}`
         + `&lastName=${filter?.lastName ?? ''}`
         + `&birthDateFrom=${DateService.toInputDateString(filter?.birthDateFrom)}`
         + `&birthDateTo=${DateService.toInputDateString(filter?.birthDateTo)}`
         + `&genderId=${filter?.genderId ?? ''}`;

      fetch(`https://localhost:7143/api/patients?${filterString}`, {
         method: 'GET',
         headers: {
            'Content-Type': 'application/json'
         }
      }).then((response) => this.handleResponse(response, callback));
   }

   static get(id, callback) {
      fetch(`https://localhost:7143/api/patients/${id}`, {
         method: 'GET',
         headers: {
            'Content-Type': 'application/json'
         }
      }).then((response) => this.handleResponse(response, callback));
   }

   static insert(data, callback) {
      fetch('https://localhost:7143/api/patients', {
         method: 'POST',
         headers: {
            'Content-Type': 'application/json'
         },
         body: JSON.stringify(data)
      }).then((response) => this.handleResponse(response, callback));
   }

   static update(id, data, callback) {
      fetch(`https://localhost:7143/api/patients/${id}`, {
         method: 'PUT',
         headers: {
            'Content-Type': 'application/json'
         },
         body: JSON.stringify(data)
      }).then((response) => this.handleResponse(response, callback));
   }

   static delete(id, callback) {
      fetch(`https://localhost:7143/api/patients/${id}`, {
         method: 'DELETE',
         headers: {
            'Content-Type': 'application/json'
         }
      }).then((response) => this.handleResponse(response, callback));
   }
}

