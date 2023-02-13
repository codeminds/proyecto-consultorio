import { genderTestData } from "../test-data.js";

export class GenderService {
   static list(callback) {
      const genders = genderTestData;
      callback(genders);
   }
}