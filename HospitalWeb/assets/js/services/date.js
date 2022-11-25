export class DateService {
   static #pad(num, size) {
      var s = num + "";
      while (s.length < size) s = "0" + s;
      return s;
   }

   static toInputDateString(date) {
      if (date == null) {
         return '';
      }

      return `${date.getFullYear()}-${DateService.#pad(date.getMonth() + 1, 2)}-${DateService.#pad(date.getDate(), 2)}T${DateService.#pad(date.getHours(), 2)}:${DateService.#pad(date.getMinutes(), 2)}:${DateService.#pad(date.getSeconds(), 2)}.${date.getMilliseconds()}`;
   }

   static toDisplayLocaleString(date, locale) {
      if (date == null) {
         return '';
      }

      return date.toLocaleString(locale, { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', hour12: true }).replace(/\.\xA0*/g, '').toUpperCase();
   }
}