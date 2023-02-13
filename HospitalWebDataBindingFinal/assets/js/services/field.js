import { BaseService } from "./base.js";


export class FieldService extends BaseService {
   static list(callback) {
      fetch('https://localhost:7143/api/fields', {
         method: 'GET',
         headers: {
            'Content-Type': 'application/json'
         }
      }).then((response) => this.handleResponse(response, callback));
   }
}