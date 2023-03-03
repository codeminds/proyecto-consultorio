export class BaseService {
   static #handleError(response) {
      let errorMessage = '';
      
      for(const error of response.messages) {
         errorMessage += `${error}\n`;
      }

      if(errorMessage != '') {
         alert(errorMessage);
      }
   }
   
   static handleResponse(response, callback) {
      return response.json().then((data) => {
         if (data.statusCode == 200) {
            callback(data);
         } else {
            this.#handleError(data);
         }
      });
   }
}