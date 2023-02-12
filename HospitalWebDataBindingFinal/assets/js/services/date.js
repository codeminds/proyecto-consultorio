export class DateService {
   static #pad(num, size) {
      var s = num+"";
      while (s.length < size) s = "0" + s;
      return s;
   }

   //Función para obtener un "string date", el tipo de texto de fecha con el formato requerido para los input datetime-local,
   //a partir de un objeto fecha
   static toInputDateString(date) {
      if(date == null) {
         return '';
      }

      return `${date.getFullYear()}-${DateService.#pad(date.getMonth() + 1, 2)}-${DateService.#pad(date.getDate(), 2)}T${DateService.#pad(date.getHours(), 2)}:${DateService.#pad(date.getMinutes(), 2)}`;
   }
   
   //Función para obtener una versión amigable para el UI de la fecha
   //a partir de un objeto fecha
   static toDisplayLocaleString(date, locale) {
      if(date == null) {
         return '';
      }

      return date.toLocaleString(locale, { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', hour12: true }).replace(/\.\xA0*/g, '').toUpperCase();
   }
}