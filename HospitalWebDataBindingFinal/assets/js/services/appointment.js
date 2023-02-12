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
         + `&patient.birthDateFrom=${DateService.toInputDateString(filter?.patient?.birthDateFrom)}`
         + `&patient.birthDateTo=${DateService.toInputDateString(filter?.patient?.birthDateTo)}`
         + `&patient.genderId=${filter?.patient?.genderId ?? ''}`
         + `&dateFrom=${DateService.toInputDateString(filter?.dateFrom)}`
         + `&dateTo=${DateService.toInputDateString(filter?.dateTo)}`;

      fetch(`https://localhost:7143/api/appointments?${filterString}`, {
         method: 'GET',
         headers: {
            'Content-Type': 'application/json'
         }
      }).then((response) => response.json())
         .then((data) => {
            if (data.statusCode == 200) {
               callback(data);
            } else {
               this.handleError(data);
            }
         });
   }

   static get(id, callback) {
      fetch(`https://localhost:7143/api/appointments/${id}`, {
         method: 'GET',
         headers: {
            'Content-Type': 'application/json'
         }
      }).then((response) => response.json())
         .then((data) => {
            if (data.statusCode == 200) {
               callback(data);
            } else {
               this.handleError(data);
            }
         });
   }

   static insert(data, callback) {
      fetch('https://localhost:7143/api/appointments', {
         method: 'POST',
         headers: {
            'Content-Type': 'application/json'
         },
         body: JSON.stringify(data)
      }).then((response) => response.json())
         .then((data) => {
            if (data.statusCode == 200) {
               callback(data);
            } else {
               this.handleError(data);
            }
         });
   }

   static update(id, data, callback) {
      fetch(`https://localhost:7143/api/appointments/${id}`, {
         method: 'PUT',
         headers: {
            'Content-Type': 'application/json'
         },
         body: JSON.stringify(data)
      }).then((response) => response.json())
         .then((data) => {
            if (data.statusCode == 200) {
               callback(data);
            } else {
               this.handleError(data);
            }
         });
   }

   static delete(id, callback) {
      fetch(`https://localhost:7143/api/appointments/${id}`, {
         method: 'DELETE',
         headers: {
            'Content-Type': 'application/json'
         }
      }).then((response) => response.json())
         .then((data) => {
            if (data.statusCode == 200) {
               callback(data);
            } else {
               this.handleError(data);
            }
         });
   }
}
