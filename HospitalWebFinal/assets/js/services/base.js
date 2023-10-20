export class BaseService {
   static #handleError(data) {
      let errorMessage = '';
      
      for(const error of data.messages) {
         errorMessage += `${error}\n`;
      }

      if(errorMessage != '') {
         alert(errorMessage);
      }
   }

   static handleResponse(response, callback) {
      return response.json().then((data) => {
         if(data.statusCode == 200) {
            callback(data);
         } else {
            BaseService.#handleError(data);
         }
      });
   }
}