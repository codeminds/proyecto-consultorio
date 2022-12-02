import { genderTestData } from "../test-data.js";

export class GenderService {
   static list(callback) {
      const result = genderTestData;
      callback(result);
   }
}