import { fieldTestData } from "../test-data.js";

export class FieldService {
   static list(callback) {
      const fields = fieldTestData;
      callback(fields);
   }
}