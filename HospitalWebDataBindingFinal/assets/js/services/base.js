export class BaseService {
   static handleError(response) {
      let errorMessage = '';
      
      for(const error of response.messages) {
         errorMessage += `${error}\n`;
      }

      if(errorMessage != '') {
         alert(errorMessage);
      }
   }   
}