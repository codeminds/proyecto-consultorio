import { BaseService } from "./base.js";


export class StatusService extends BaseService{
   static list(callback) {
      fetch('https://localhost:7221/api/statusses', {
         method: 'GET',
         headers: {
            'Content-Type': 'application/json'
         }
      }).then((response) => this.handleResponse(response, callback));
   }
}