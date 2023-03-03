import { BaseService } from "./base.js";


export class GenderService extends BaseService{
   static list(callback) {
      fetch('https://localhost:7221/api/genders', {
         method: 'GET',
         headers: {
            'Content-Type': 'application/json'
         }
      }).then((response) => this.handleResponse(response, callback));
   }
}