import { BaseService } from "./base.js";


export class FieldService extends BaseService {
   static list(callback) {
      fetch('https://localhost:7143/api/fields', {
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
}