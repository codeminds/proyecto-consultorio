import { statusTestData } from "../test-data.js";

export class StatusService {
   static list(callback) {
      const statusses = statusTestData;
      callback(statusses);
   }
}